import type { CreativeEngine } from '@cesdk/cesdk-js';
import { DesignBlockType } from '@cesdk/cesdk-js';
import type { Font } from './font-resolver';
import defaultFontResolver from './font-resolver';
import type { Gradient, IDML, RGBA } from './types';
import {
  angleToGradientControlPoints,
  extractColors,
  extractGradients,
  getImageURI,
  getPageAttributes,
  getTransformAndShapeProperties,
  unzipIdmlFile
} from './utils';

// The design unit used in the CESDK Editor
const DESIGN_UNIT = 'Inch';
/**
 * The pixel scale factor used in the CESDK Editor
 * This is used to convert the IDML file's pixel values to CESDK's design unit
 */
const PIXEL_SCALE_FACTOR = 72;
const DEFAULT_FONT: Font = { name: 'Roboto', style: 'Regular' };

// Element types of the spreads in the IDML file
const SPREAD_ELEMENTS = {
  PAGE: 'Page',
  RECTANGLE: 'Rectangle',
  OVAL: 'Oval',
  POLYGON: 'Polygon',
  GRAPHIC_LINE: 'GraphicLine',
  TEXT_FRAME: 'TextFrame',
  GROUP: 'Group'
} as const;

export default class IDMLParser {
  private engine: CreativeEngine;
  // The scene ID of the parsed IDML file
  private scene: number;
  // The IDML file contents
  private idml: IDML;
  // A function that resolves the font URI from the font name and style
  private fontResolver: (font: Font) => string | null;
  // A map of the colors used in the IDML document and their RGBA values
  private colors: Map<string, RGBA>;
  // A map of the gradients used in the IDML document and their GradientColorStop values
  private gradients: Map<string, Gradient>;
  private spreads: Document[];

  private constructor(
    engine: CreativeEngine,
    idml: IDML,
    fontResolver?: (font: Font) => string | null
  ) {
    this.engine = engine;
    this.idml = idml;
    this.colors = extractColors(this.idml['Resources/Graphic.xml']);
    this.gradients = extractGradients(this.idml['Resources/Graphic.xml']);

    this.fontResolver = fontResolver ?? defaultFontResolver;
    this.spreads = this.getSpreads();

    // get the default width and height from the first page
    const firstPage = this.spreads[0].querySelector(SPREAD_ELEMENTS.PAGE)!;
    const { width, height } = getPageAttributes(firstPage);

    // create a new scene and set the design unit and page dimensions
    // we are assuming that all pages have the same dimensions since
    // we do not support different page sizes in the CESDK Editor yet
    this.scene = this.engine.scene.create('VerticalStack');

    const stack = this.engine.block.findByType(DesignBlockType.Stack)[0];
    // set standard values for the stack block:
    this.engine.block.setFloat(stack, 'stack/spacing', 35);
    this.engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

    this.engine.scene.setDesignUnit(DESIGN_UNIT);
    this.engine.block.setFloat(
      this.scene,
      'scene/pixelScaleFactor',
      PIXEL_SCALE_FACTOR
    );
    this.engine.block.setFloat(
      this.scene,
      'scene/pageDimensions/width',
      width / PIXEL_SCALE_FACTOR
    );
    this.engine.block.setFloat(
      this.scene,
      'scene/pageDimensions/height',
      height / PIXEL_SCALE_FACTOR
    );
    this.engine.editor;
  }

  /**
   * Instantiate a new IDMLParser from a File or Blob
   *
   * @param cesdk The CreativeEditorSDK instance
   * @param file The IDML file
   * @param fontResolver A function that resolves the font URI from the font name and style
   * @returns A new IDMLParser instance
   */
  static async fromFile(
    engine: CreativeEngine,
    file: Blob | File,
    fontResolver?: (font: Font) => string | null
  ) {
    const idml = await unzipIdmlFile(file);
    return new IDMLParser(engine, idml, fontResolver);
  }

  public async parse() {
    // generate page blocks from the spreads and populate them with the page elements
    await this.generatePagesFromSpreads();
    return this.scene;
  }

  private getSpreads() {
    // extract the designmap.xml file
    const designMap = this.idml['designmap.xml'];

    // extract the spreads from the designmap.xml file and
    // map the spread src to the spread document in the IDML file
    return Array.from(designMap.getElementsByTagName('idPkg:Spread')).map(
      (spread) => {
        const src = spread.getAttribute('src') as string;
        return this.idml[src];
      }
    );
  }

  // Extract bleed margins from the IDML file
  private getBleedMargins() {
    const preferences = this.idml['Resources/Preferences.xml'];
    const documentPreference = preferences.querySelector('DocumentPreference')!;
    const bleedMargins = {
      top:
        parseFloat(documentPreference.getAttribute('DocumentBleedTopOffset')!) /
        PIXEL_SCALE_FACTOR,
      bottom:
        parseFloat(
          documentPreference.getAttribute('DocumentBleedBottomOffset')!
        ) / PIXEL_SCALE_FACTOR,
      left:
        parseFloat(
          documentPreference.getAttribute('DocumentBleedInsideOrLeftOffset')!
        ) / PIXEL_SCALE_FACTOR,
      right:
        parseFloat(
          documentPreference.getAttribute('DocumentBleedOutsideOrRightOffset')!
        ) / PIXEL_SCALE_FACTOR
    };
    return bleedMargins;
  }
  // generate pages from the spreads in the IDML file
  private async generatePagesFromSpreads() {
    // find the stack block in the scene to append the pages to
    const stack = this.engine.block.findByType(DesignBlockType.Stack)[0];

    const bleedMargin = this.getBleedMargins();
    const hasBleedMargin = Object.values(bleedMargin).some(
      (margin) => margin !== 0
    );

    // iterate over the spreads and generate a page block for each spread
    const pagePromises = this.spreads.map(async (spread) => {
      // find the page element in the spread XML document
      const page = spread.querySelector(SPREAD_ELEMENTS.PAGE);

      if (!page) throw new Error('No page found in the spread');

      // Get the page name and dimensions from the page element
      const pageAttributes = getPageAttributes(page);
      // Create a new page block
      const pageBlock = this.engine.block.create(DesignBlockType.Page);

      // Convert the page dimensions from points to the CESDK design unit
      const width = pageAttributes.width / PIXEL_SCALE_FACTOR;
      const height = pageAttributes.height / PIXEL_SCALE_FACTOR;

      // Set the page name, width, and height
      this.engine.block.setName(pageBlock, pageAttributes.name);
      this.engine.block.setWidth(pageBlock, width);
      this.engine.block.setHeight(pageBlock, height);
      this.engine.block.setClipped(pageBlock, true);
      // Set the bleed margins
      if (hasBleedMargin) {
        this.engine.block.setBool(pageBlock, 'page/marginEnabled', true);
      }
      this.engine.block.setFloat(
        pageBlock,
        'page/margin/bottom',
        bleedMargin.bottom
      );
      this.engine.block.setFloat(
        pageBlock,
        'page/margin/left',
        bleedMargin.left
      );
      this.engine.block.setFloat(
        pageBlock,
        'page/margin/right',
        bleedMargin.right
      );
      this.engine.block.setFloat(pageBlock, 'page/margin/top', bleedMargin.top);

      // Append the page block to the stack block
      this.engine.block.appendChild(stack, pageBlock);

      // Get the spread element from the spread XML document
      const spreadElement = spread.getElementsByTagName('Spread')[0];
      // Render the page elements and append them to the page block
      await this.renderPageElements(spreadElement, page, pageBlock);

      return pageBlock;
    });
    return Promise.all(pagePromises);
  }

  /**
   * Loop over the page elements and render the CESDK blocks based on the element type
   *
   * @param element The page element
   * @param spread The page element's parent page
   * @param pageBlock The page block to append the rendered blocks to
   * @returns An array of the rendered blocks
   */
  private async renderPageElements(
    element: Element,
    spread: Element,
    pageBlock: number
  ): Promise<number[]> {
    // Loop over the page element's children
    const blocks = await Promise.all(
      Array.from(element.children).map(async (element) => {
        // Render the CESDK block based on the element type
        switch (element.tagName) {
          case SPREAD_ELEMENTS.RECTANGLE: {
            // Get the rectangle's transform and dimensions
            const rectAttributes = getTransformAndShapeProperties(
              element,
              spread
            );

            // Get the image URI if available
            const imageURI = getImageURI(element);

            let block: number;

            // If the rectangle has an image URI, create an image block
            if (imageURI) {
              block = this.engine.block.create(DesignBlockType.Image);
              this.engine.block.setString(
                block,
                'image/imageFileURI',
                imageURI
              );
            } else {
              // Otherwise, create a rectangle block
              block = this.engine.block.create(DesignBlockType.RectShape);
            }

            this.applyStroke(block, element);
            this.applyTransparency(block, element);

            this.engine.block.appendChild(pageBlock, block);

            // Convert the rectangle's dimensions from points to the CESDK design unit
            const x = rectAttributes.x / PIXEL_SCALE_FACTOR;
            const y = rectAttributes.y / PIXEL_SCALE_FACTOR;
            const width = rectAttributes.width / PIXEL_SCALE_FACTOR;
            const height = rectAttributes.height / PIXEL_SCALE_FACTOR;

            this.engine.block.setPositionX(block, x);
            this.engine.block.setPositionY(block, y);
            this.engine.block.setWidth(block, width);
            this.engine.block.setHeight(block, height);
            this.engine.block.setRotation(block, rectAttributes.rotation);

            if (
              this.engine.block.getType(block) === DesignBlockType.RectShape
            ) {
              // Fill needs to be applied after setting height and width, because gradient fills need the dimensions
              this.applyFill(block, element);
            }

            return block;
          }

          case SPREAD_ELEMENTS.OVAL: {
            // Get the oval's transform and dimensions
            const ovalAttributes = getTransformAndShapeProperties(
              element,
              spread
            );

            // Create an ellipse block
            const block = this.engine.block.create(
              DesignBlockType.EllipseShape
            );

            this.applyFill(block, element);
            this.applyStroke(block, element);
            this.applyTransparency(block, element);

            this.engine.block.appendChild(pageBlock, block);

            // Convert the oval's dimensions from points to the CESDK design unit
            const x = ovalAttributes.x / PIXEL_SCALE_FACTOR;
            const y = ovalAttributes.y / PIXEL_SCALE_FACTOR;
            const width = ovalAttributes.width / PIXEL_SCALE_FACTOR;
            const height = ovalAttributes.height / PIXEL_SCALE_FACTOR;

            this.engine.block.setPositionX(block, x);
            this.engine.block.setPositionY(block, y);
            this.engine.block.setWidth(block, width);
            this.engine.block.setHeight(block, height);
            this.engine.block.setRotation(block, ovalAttributes.rotation);

            return block;
          }

          case SPREAD_ELEMENTS.POLYGON: {
            // Get the polygon's transform and dimensions
            const polygonAttributes = getTransformAndShapeProperties(
              element,
              spread
            );

            // Create a vector path block
            const block = this.engine.block.create(DesignBlockType.VectorPath);

            // Set the vector path's path data, width, and height
            this.engine.block.setString(
              block,
              'vector_path/path',
              polygonAttributes.pathData
            );
            this.engine.block.setFloat(
              block,
              'vector_path/width',
              polygonAttributes.width
            );
            this.engine.block.setFloat(
              block,
              'vector_path/height',
              polygonAttributes.height
            );

            this.applyFill(block, element);
            this.applyStroke(block, element);
            this.applyTransparency(block, element);

            this.engine.block.appendChild(pageBlock, block);

            // Convert the polygon's dimensions from points to the CESDK design unit
            const x = polygonAttributes.x / PIXEL_SCALE_FACTOR;
            const y = polygonAttributes.y / PIXEL_SCALE_FACTOR;
            const width = polygonAttributes.width / PIXEL_SCALE_FACTOR;
            const height = polygonAttributes.height / PIXEL_SCALE_FACTOR;

            this.engine.block.setPositionX(block, x);
            this.engine.block.setPositionY(block, y);
            this.engine.block.setWidth(block, width);
            this.engine.block.setHeight(block, height);
            this.engine.block.setRotation(block, polygonAttributes.rotation);

            return block;
          }

          case SPREAD_ELEMENTS.GRAPHIC_LINE: {
            // Get the line's transform and dimensions
            const lineAttributes = getTransformAndShapeProperties(
              element,
              spread
            );

            // Create a line block
            const block = this.engine.block.create(DesignBlockType.LineShape);

            this.applyTransparency(block, element);

            this.engine.block.appendChild(pageBlock, block);

            // Get the inherited styles of the element to use as fallback
            const appliedObjectStyle =
              element.getAttribute('AppliedObjectStyle')!;
            const objectStyles = this.idml[
              'Resources/Styles.xml'
            ].querySelector(`ObjectStyle[Self="${appliedObjectStyle}"]`)!;

            // Get the stroke styles from the element or the inherited styles
            const strokeColor =
              element.getAttribute('StrokeColor') ??
              objectStyles.getAttribute('StrokeColor');
            const strokeWeight =
              element.getAttribute('StrokeWeight') ??
              objectStyles.getAttribute('StrokeWeight');

            // Use the stroke style as the line's fill and height
            if (strokeWeight && strokeColor && this.colors.has(strokeColor)) {
              const rgba = this.colors.get(strokeColor)!;
              const fill = this.engine.block.createFill('color');
              this.engine.block.setColorRGBA(fill, 'fill/color/value', ...rgba);

              // Convert the line's height from points to the CESDK design unit
              const height = parseFloat(strokeWeight) / PIXEL_SCALE_FACTOR;

              this.engine.block.setFill(block, fill);
              this.engine.block.setHeight(block, height);
            }

            // Convert the line's dimensions from points to the CESDK design unit
            const x = lineAttributes.x / PIXEL_SCALE_FACTOR;
            const y = lineAttributes.y / PIXEL_SCALE_FACTOR;
            const width = lineAttributes.width / PIXEL_SCALE_FACTOR;

            this.engine.block.setPositionX(block, x);
            this.engine.block.setPositionY(block, y);
            this.engine.block.setWidth(block, width);
            this.engine.block.setRotation(block, lineAttributes.rotation);

            return block;
          }

          case SPREAD_ELEMENTS.TEXT_FRAME: {
            // Get the parent story of the text frame
            const parentStoryId = element.getAttribute('ParentStory');
            const parentStory = this.idml[`Stories/Story_${parentStoryId}.xml`];

            // Create a text block
            const block = this.engine.block.create(DesignBlockType.Text);

            const characterStyleRange = parentStory.querySelectorAll(
              'CharacterStyleRange'
            );

            // extract the text content from the CharacterStyleRange elements
            const content = Array.from(characterStyleRange)
              .map((range) => {
                let rangeContent = '';
                Array.from(range.children).forEach((child) => {
                  switch (child.tagName) {
                    // If the child is a content tag, we append the content to the range content
                    case 'Content':
                      rangeContent += child.innerHTML;
                      break;

                    // If the child is a Br tag, we append a new line to the range content
                    case 'Br':
                      rangeContent += '\n';
                      break;
                  }
                });
                return rangeContent;
              })
              .join('');

            // Disable text clipping outside of the text frame
            // This was necessary because InDesign seems to have a lower threshold
            // for clipping the text than the CESDK Editor, which was causing parts
            // of the text to be clipped in the CESDK Editor
            this.engine.block.setBool(
              block,
              'text/clipLinesOutsideOfFrame',
              false
            );
            // Set the text content
            this.engine.block.setString(block, 'text/text', content);

            // the default font
            let font = DEFAULT_FONT;

            // keep track of the text length to apply the styles to the correct text segment
            let length = 0;
            // apply the text styles for each text segment
            characterStyleRange.forEach((range) => {
              // get the text segment color
              const color = range.getAttribute('FillColor')!;
              const rgba = this.colors.get(color);

              if (rgba) {
                const [r, g, b, a] = rgba;
                this.engine.block.setTextColor(
                  block,
                  { r, g, b, a },
                  length,
                  length + content.length
                );
              }

              // get the text segment font size
              const fontSize = range.getAttribute('PointSize');

              if (fontSize) {
                this.engine.block.setFloat(
                  block,
                  'text/fontSize',
                  parseFloat(fontSize)
                );
              }

              // get the text segment case
              const capitalization = range.getAttribute('Capitalization')!;
              switch (capitalization) {
                case 'AllCaps':
                  this.engine.block.setTextCase(
                    block,
                    'Uppercase',
                    length,
                    length + content.length
                  );
                  break;
              }

              // get the text segment font family and style
              const fontFamily =
                range.querySelector('AppliedFont')?.innerHTML ?? 'Roboto';
              const fontStyle = range.getAttribute('FontStyle') ?? 'Regular';

              font = { name: fontFamily, style: fontStyle };

              length += range.querySelector('Content')?.innerHTML.length ?? 0;
            });

            // get the font URI from the font resolver
            const fontURI = this.fontResolver(font);
            if (fontURI) {
              // Test if the font is loadable by creating a FontFace
              // If the font is loadable, we set the font URI on the text block
              // This was necessary because the CESDK will not render the text
              // if loading the font errors out
              try {
                await new FontFace(font.name, `url(${fontURI})`).load();
                this.engine.block.setString(block, 'text/fontFileUri', fontURI);
              } catch (error) {
                console.error(
                  'Could not load font at ',
                  fontURI,
                  'due to: ',
                  error
                );
              }
            }

            // get the text alignment
            const justification = parentStory
              .querySelector('ParagraphStyleRange')
              ?.getAttribute('Justification');

            // set the text alignment
            switch (justification) {
              case 'LeftAlign':
                this.engine.block.setEnum(
                  block,
                  'text/horizontalAlignment',
                  'Left'
                );
                break;

              case 'CenterAlign':
                this.engine.block.setEnum(
                  block,
                  'text/horizontalAlignment',
                  'Center'
                );
                break;

              case 'RightAlign':
                this.engine.block.setEnum(
                  block,
                  'text/horizontalAlignment',
                  'Right'
                );
                break;
            }

            this.applyTransparency(block, element);

            this.engine.block.appendChild(pageBlock, block);

            // Get the text frame's transform and dimensions
            const textFrameAttributes = getTransformAndShapeProperties(
              element,
              spread
            );

            // Convert the text frame's dimensions from points to the CESDK design unit
            const x = textFrameAttributes.x / PIXEL_SCALE_FACTOR;
            const y = textFrameAttributes.y / PIXEL_SCALE_FACTOR;
            const width = textFrameAttributes.width / PIXEL_SCALE_FACTOR;
            const height = textFrameAttributes.height / PIXEL_SCALE_FACTOR;

            this.engine.block.setPositionX(block, x);
            this.engine.block.setPositionY(block, y);
            this.engine.block.setWidth(block, width);
            this.engine.block.setHeight(block, height);
            this.engine.block.setRotation(block, textFrameAttributes.rotation);

            return block;
          }

          case SPREAD_ELEMENTS.GROUP: {
            // If the element is a group, we render the group's children recursively
            // and then we group the rendered blocks together
            const children = await this.renderPageElements(
              element,
              spread,
              pageBlock
            );
            return this.engine.block.group(children);
          }

          default:
            return null;
        }
      })
    );
    return blocks.filter((block) => block !== null) as number[];
  }

  /**
   * Parses the fill styles of an IDML element and applies them to a CESDK block
   *
   * @param block The CESDK block to apply the fill to
   * @param element The IDML element
   * @returns void
   */
  private applyFill(block: number, element: Element) {
    // Get the inherited styles of the element to use as fallback
    // if the element does not have a fill styles
    const appliedObjectStyle = element.getAttribute('AppliedObjectStyle')!;
    const objectStyles = this.idml['Resources/Styles.xml'].querySelector(
      `ObjectStyle[Self="${appliedObjectStyle}"]`
    )!;

    // Get the fill color from the element or the inherited styles
    const fillColor =
      element.getAttribute('FillColor') ??
      objectStyles.getAttribute('FillColor');

    if (!fillColor) {
      this.engine.block.setFillEnabled(block, false);
      return;
    }
    // if the element has a fill color, we extract the RGBA values
    // from the document colors using the ID and apply the fill to the block
    if (this.colors.has(fillColor)) {
      const rgba = this.colors.get(fillColor)!;
      const fill = this.engine.block.createFill('color');
      this.engine.block.setColorRGBA(fill, 'fill/color/value', ...rgba);
      this.engine.block.setFill(block, fill);
    } else if (this.gradients.has(fillColor)) {
      const gradient = this.gradients.get(fillColor)!;
      const gradientFill = this.engine.block.createFill(gradient.type);
      this.engine.block.setGradientColorStops(
        gradientFill,
        'fill/gradient/colors',
        gradient.stops
      );
      if (gradient.type === '//ly.img.ubq/fill/gradient/linear') {
        const idmlAngle = parseFloat(
          element.getAttribute('GradientFillAngle') ?? '0'
        );
        const blockAspectRatio =
          this.engine.block.getWidth(block) /
          this.engine.block.getHeight(block);
        const controlPoints = angleToGradientControlPoints(
          idmlAngle,
          blockAspectRatio
        );
        this.engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/startPointX',
          controlPoints.start.x
        );
        this.engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/startPointY',
          controlPoints.start.y
        );
        this.engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/endPointX',
          controlPoints.end.x
        );
        this.engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/endPointY',
          controlPoints.end.y
        );
      }
      this.engine.block.setFill(block, gradientFill);
    } else {
      this.engine.block.setFillEnabled(block, false);
      console.log(`Fill color ${fillColor} not found in document colors.`);
    }
  }

  /**
   * Parses the stroke styles of an IDML element and applies them to a CESDK block
   *
   * @param block The CESDK block to apply the stroke to
   * @param element The IDML element
   * @returns void
   */
  private applyStroke(block: number, element: Element) {
    // Get the inherited styles of the element to use as fallback
    const appliedObjectStyle = element.getAttribute('AppliedObjectStyle')!;
    const objectStyles = this.idml['Resources/Styles.xml'].querySelector(
      `ObjectStyle[Self="${appliedObjectStyle}"]`
    )!;

    // Get the stroke styles from the element or the inherited styles
    const strokeColor =
      element.getAttribute('StrokeColor') ??
      objectStyles.getAttribute('StrokeColor');
    const strokeWeight =
      element.getAttribute('StrokeWeight') ??
      objectStyles.getAttribute('StrokeWeight');
    const strokeAlignment =
      element.getAttribute('StrokeAlignment') ??
      objectStyles.getAttribute('StrokeAlignment');

    // If the element has a stroke color, we extract the RGBA values
    // from the document colors using the ID and apply the stroke to the block
    if (strokeWeight && strokeColor && this.colors.has(strokeColor)) {
      const rgba = this.colors.get(strokeColor)!;
      const width = parseFloat(strokeWeight) / PIXEL_SCALE_FACTOR;
      this.engine.block.setStrokeWidth(block, width);
      this.engine.block.setStrokeColorRGBA(block, ...rgba);

      // Set the stroke alignment
      switch (strokeAlignment) {
        case 'CenterAlignment':
          this.engine.block.setStrokePosition(block, 'Center');
          break;

        case 'InsideAlignment':
          this.engine.block.setStrokePosition(block, 'Inner');
          break;

        case 'OutsideAlignment':
          this.engine.block.setStrokePosition(block, 'Outer');
          break;
      }

      this.engine.block.setStrokeEnabled(block, true);
    }
  }

  /**
   * Parses the transparency styles of an IDML element and applies them to a CESDK block
   *
   * @param block The CESDK block to apply the transparency to
   * @param element The IDML element
   * @returns void
   */
  private applyTransparency(block: number, element: Element) {
    // Get the transparency settings from the element
    const transparencySetting = element.querySelector('TransparencySetting');
    if (!transparencySetting) return;

    // Get the opacity from the transparency settings
    const opacity = parseFloat(
      transparencySetting
        .querySelector('BlendingSetting')
        ?.getAttribute('Opacity') ?? '100'
    );
    this.engine.block.setOpacity(block, opacity / 100);
  }
}
