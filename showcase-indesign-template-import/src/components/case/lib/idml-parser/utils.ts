import { GradientColorStop, RGBAColor } from '@cesdk/cesdk-js';
import JSZip from 'jszip';
import type { CMYK, Gradient, IDML, RGBA, Vector2 } from './types';

/**
 * Extracts the contents of an IDML file into a map of filenames to XML documents
 *
 * @param file The IDML file to extract
 * @returns A map of filenames to XML documents
 */
export async function unzipIdmlFile(file: File | Blob) {
  // Load the IDML file into JSZip
  const { files } = await new JSZip().loadAsync(file);

  const extractedFiles: IDML = {};

  for (const filename in files) {
    if (!filename.endsWith('.xml')) continue;

    const file = files[filename];
    const content = await file.async('string');
    extractedFiles[filename] = new DOMParser().parseFromString(
      content,
      'text/xml'
    );
  }

  return extractedFiles;
}

/**
 * Extracts the page name and dimensions from an IDML page element
 *
 * @param page The IDML page element
 * @returns The page name, width, and height
 */
export function getPageAttributes(page: Element) {
  // Get the page name from the Name attribute
  const name = page.getAttribute('Name') ?? '';
  // Get the page geometric bounds from the GeometricBounds attribute
  const [top, left, bottom, right] = page
    .getAttribute('GeometricBounds')!
    .split(' ')
    .map(parseFloat);

  // Calculate the width and height of the page
  const width = right - left;
  const height = bottom - top;

  return {
    name,
    width,
    height
  };
}

/**
 * Extracts the x and y translations and the rotation from a 2x3 transformation
 * matrix to represent linear transformations and translations in 2D space.
 *
 * @param transform - The 2x3 transformation matrix array.
 * @returns An object with x and y translations and the rotation (in radians).
 */
function parseTransformMatrix(transform: number[]) {
  // Destructure the 2x3 matrix elements. The format is [a, b, c, d, e, f], where
  // a and d represent scaling, b and c represent rotation, and e and f represent translation.
  const [a, b, c, d, e, f] = transform;

  // The last column of the matrix represents the translation along x (e) and y (f) axes.
  const x = e;
  const y = f;

  // The rotation is calculated by taking the arctangent of the second row.
  // This provides the rotation in radians. The added 2*PI is to ensure a positive angle.
  const rotation = Math.atan2(b, a) + 2 * Math.PI;

  return {
    x,
    y,
    rotation
  };
}

/**
 * Parses the path geometry of an item, extracting the minimum x and y, width, height,
 * center coordinates, and path data. The path data describes the shape.
 *
 * @param pathGeometry - The XML element representing the path geometry of an item.
 * @returns An object with x, y, width, height, centerX, centerY and pathData.
 */
export function parsePathGeometry(pathGeometry: Element) {
  // Extracts all PathPointType elements within pathGeometry. Each PathPointType contains data for
  // a control point in the item's path, including its position (Anchor), and the positions of
  // the Bézier control points (LeftDirection and RightDirection) if the path is curved.
  const points = pathGeometry.getElementsByTagName('PathPointType');

  // These arrays will store all the x and y values from the path points, which will then be
  // used to determine the bounding box of the shape.
  let xValues: number[] = [];
  let yValues: number[] = [];

  // Iterates over each PathPointType to extract x and y coordinates
  Array.from(points).forEach((point) => {
    // The Anchor attribute contains the x and y coordinates of the point, separated by a space.
    let anchorAttr = point.getAttribute('Anchor')!;
    let [x, y] = anchorAttr.split(' ');
    xValues.push(parseFloat(x));
    yValues.push(parseFloat(y));
  });

  // Determines the minimum and maximum x and y values, which are then used to calculate the width
  // and height of the bounding box around the item's path.
  let x = Math.min(...xValues);
  let y = Math.min(...yValues);
  let width = Math.max(...xValues) - x;
  let height = Math.max(...yValues) - y;

  // Calculates the center of the shape by averaging the minimum and maximum x and y values.
  let centerX = x + width / 2;
  let centerY = y + height / 2;

  // Gets all GeometryPathType elements, which contain the actual path data that describes the shape.
  const geometryTypes = pathGeometry.getElementsByTagName('GeometryPathType');

  // This array will hold all the path data, which will be combined into one string at the end.
  let allPathData: string[] = [];

  // Extracts all PathPointArrays within each GeometryPathType. Each PathPointArray represents a
  // sub-path, which is a series of connected points. The sub-paths together make up the full path.
  Array.from(geometryTypes).forEach((geometryType) => {
    Array.from(geometryType.getElementsByTagName('PathPointArray')).forEach(
      (pointArray) => {
        // The string that will hold the path data for this sub-path.
        let pathData = '';

        // Iterates over each PathPointType to construct the path data
        Array.from(pointArray.getElementsByTagName('PathPointType')).forEach(
          (point, i) => {
            // Extracts anchor, left and right coordinates. These are used to define the position of
            // the point and the positions of the Bézier control points for this point in the path.
            let anchor = point.getAttribute('Anchor')!.split(' ').map(Number);
            let left = point
              .getAttribute('LeftDirection')!
              .split(' ')
              .map(Number);
            let right = point
              .getAttribute('RightDirection')!
              .split(' ')
              .map(Number);

            // Adjusts the x and y values based on the minimum x and y values so the path data is
            // relative to the bounding box of the shape.
            const anchorX = anchor[0] - x;
            const anchorY = anchor[1] - y;
            const leftX = left[0] - x;
            const leftY = left[1] - y;
            const rightX = right[0] - x;
            const rightY = right[1] - y;

            if (i === 0) {
              // Moves to the first anchor point with a "Move" command. This starts a new sub-path at
              // the specified coordinates.
              pathData += `M ${anchorX},${anchorY} `;
            }

            // Creates a curve to the next anchor point with a "Cubic Bézier Curve" command.
            // The coordinates for the Bézier control points (left and right)
            // and the next anchor point are included.
            pathData += `C ${leftX},${leftY} ${rightX},${rightY} ${anchorX},${anchorY} `;
          }
        );

        // Closes the path if it's not open by appending a "Close Path" command. This creates a
        // straight line from the current point to the start of the current sub-path.
        if (geometryType.getAttribute('PathOpen') === 'false') {
          pathData += 'Z';
        }

        // Appends the path data for this sub-path to the array of all path data.
        allPathData.push(pathData);
      }
    );
  });

  return {
    x,
    y,
    width,
    height,
    centerX,
    centerY,
    // Joins all the path data into one string, separated by spaces.
    pathData: allPathData.join(' ')
  };
}

/**
 * Extracts transformation and dimension information from an element and the page it belongs to.
 * The element's position and dimensions are adjusted based on its transformation and the page's transformation.
 * This is necessary because the position and dimensions in the original data are not always relative to the page,
 * but the transformation in the CESDK is applied relative to the page.
 *
 * @param element - The XML element to extract the transformation and dimension information from.
 * @param page - The page the XML element belongs to.
 * @returns An object with the dimensions and transformations, as well as x and y coordinates.
 */
export function getTransformAndShapeProperties(
  element: Element,
  page: Element
) {
  // Get the 2x3 transformation matrix of the page
  const pageItemTransform = page
    .getAttribute('ItemTransform')!
    .split(' ')
    .map(parseFloat);
  // Get the 2x3 transformation matrix of the element
  const elementItemTransform = element
    .getAttribute('ItemTransform')!
    .split(' ')
    .map(parseFloat);
  // Get the path geometry of the element.
  const elementPathGeometry = element.querySelector('PathGeometry')!;

  // Extracts the transformations and dimensions.
  const pageTransform = parseTransformMatrix(pageItemTransform);
  const elementTransform = parseTransformMatrix(elementItemTransform);
  const shapeGeometry = parsePathGeometry(elementPathGeometry);

  // Calculates offsets between the page and the shape.
  // These offsets are used to adjust the element's position
  // to be relative to the page instead of the original coordinates.
  const xOffset = pageTransform.x - shapeGeometry.x;
  const yOffset = pageTransform.y - shapeGeometry.y;

  // Adjusts the element's transformation for the offsets.
  // This makes the element's position relative to the page.
  const elementX = elementTransform.x - xOffset;
  const elementY = elementTransform.y - yOffset;

  // Calculates the new coordinates of the shape's center after rotation. The "centerX" and "centerY" variables
  // are the result of applying the rotation matrix to the original center coordinates of the shape.
  // The rotation matrix formula is [cos(theta) -sin(theta); sin(theta) cos(theta)] where theta is the rotation angle.
  const centerX =
    shapeGeometry.centerX * Math.cos(elementTransform.rotation) -
    shapeGeometry.centerY * Math.sin(elementTransform.rotation);
  const centerY =
    shapeGeometry.centerX * Math.sin(elementTransform.rotation) +
    shapeGeometry.centerY * Math.cos(elementTransform.rotation);

  // Adjusts the unrotated element's position by adding the "rotatedX" and "rotatedY". These additions take into account
  // the changes in the position of the shape's center due to rotation. The results are the final coordinates of the shape
  // after rotation has been applied.
  const x = elementX + centerX - shapeGeometry.centerX;
  const y = elementY + centerY - shapeGeometry.centerY;

  return {
    ...shapeGeometry,
    ...elementTransform,
    x,
    y
  };
}

/**
 * Extracts the image URI from an IDML element
 * Note: At the moment we are only supporting Embedded Images
 */
export function getImageURI(element: Element) {
  const contentType = element.getAttribute('ContentType');

  // If the element is not an image, return null
  if (contentType !== 'GraphicType') return null;

  // Get the image element
  const image = element.querySelector('Image') ?? element.querySelector('SVG');

  if (!image) return null;

  // Get the base64 string from the CDATA elements and join them together
  const BASE64_STRING_REGEX = /<!\[CDATA\[(?<base64>.*?)\]\]>/gs;
  const contents = image
    .querySelector('Contents')!
    .innerHTML.replaceAll('\n', '');
  const matches = contents.matchAll(BASE64_STRING_REGEX);
  const cdata = Array.from(matches)
    .map((s) => s.groups?.base64 ?? '')
    .join('');

  // Get the image type
  const imageType = image.getAttribute('ImageTypeName');

  let type = '';

  switch (true) {
    case image.tagName === 'Image' &&
      (imageType?.includes('JPEG') || imageType?.includes('JPG')):
      type = 'image/jpeg';
      break;

    case image.tagName === 'Image' && imageType?.includes('PNG'):
      type = 'image/png';
      break;

    case image.tagName === 'SVG':
      type = 'image/svg+xml';
  }

  // Return the image URI as a base64 data URI
  if (cdata) {
    return `data:${type};base64,${cdata}`;
  }

  // Return null if the image URI could not be extracted
  return null;
}

/**
 * Extracts the colors from an IDML graphic resources file
 * These are the colors that are used in the IDML document
 *
 * @param graphicResources The IDML graphic resources file
 * @returns A map of color IDs to RGBA colors
 */
export function extractColors(graphicResources: Document) {
  return new Map(
    Array.from(graphicResources.querySelectorAll('Color')).map((colorTag) => {
      // Get the color ID
      const key = colorTag.getAttribute('Self')!;
      // Get the color space
      const space = colorTag.getAttribute('Space')!;
      // Get the color value
      const colorValue = colorTag.getAttribute('ColorValue')!;

      // If it's a CMYK color, convert it to RGBA
      if (space === 'CMYK') {
        const CMYK = colorValue.split(' ').map(parseFloat) as CMYK;
        return [key, CMYKtoRGBA(CMYK)];
      }

      // If it's an RGB color, convert it to RGBA and normalize the values
      if (space === 'RGB') {
        const [r, g, b] = colorValue.split(' ').map(parseFloat);
        return [key, [r / 255, g / 255, b / 255, 1]];
      }

      // Return black if the color space is unsupported
      return [key, [0, 0, 0, 1]];
    }) as [string, RGBA][]
  );
}

/**
 * Extracts the Gradients from an IDML graphic resources file
 * These are the Gradients that are used in the IDML document
 *
 * @param graphicResources The IDML graphic resources file
 * @returns A map of gradient IDs to CE.SDK GradientColorStops
 */
export function extractGradients(
  graphicResources: Document
): Map<string, Gradient> {
  return new Map(
    Array.from(graphicResources.querySelectorAll('Gradient')).map(
      (gradientTag) => {
        // Get the gradient ID
        const key = gradientTag.getAttribute('Self')!;
        // Get the gradient stop
        const GradientStops = gradientTag.querySelectorAll('GradientStop');

        const gradientStops = Array.from(GradientStops).map(
          (GradientStop, index) => {
            const stop: GradientColorStop = {
              color: rgbaArrayToObject(getGradientStopColor(GradientStop)),

              stop: index
            };
            return stop;
          }
        );

        const idmlGradientType = gradientTag.getAttribute('Type')! as
          | 'Linear'
          | 'Radial';
        const gradientTypeMap = {
          Linear: '//ly.img.ubq/fill/gradient/linear',
          Radial: '//ly.img.ubq/fill/gradient/radial'
        } as const;

        return [
          key,
          {
            type: gradientTypeMap[idmlGradientType],
            stops: gradientStops
          }
        ];
      }
    )
  );
}

/**
 * Extracts the color of a gradient stop from an IDML GradientStop element
 * @param gradientStop The IDML GradientStop element
 * @returns The color of the gradient stop as an RGBA color array
 */
function getGradientStopColor(gradientStop: Element): RGBA {
  const color = gradientStop.getAttribute('StopColor')!;
  // Example regex: "Color/R=245 G=225 B=216"
  const colorRegex = /Color\/R=(?<r>\d+) G=(?<g>\d+) B=(?<b>\d+)/;
  const colorMatches = color.match(colorRegex);
  if (colorMatches) {
    const { r, g, b } = colorMatches.groups!;
    return [r, g, b, '255'].map(parseFloat).map(normalizeHexColor) as RGBA;
  }
  console.error('Unknown Gradient Stop Color Format found: ', color);
  return [0, 0, 0, 0];
}
/**
 * Normalizes a hex color value to a value between 0 and 1
 * @param color The color value to normalize
 * @returns The normalized color value
 */
function normalizeHexColor(color: number) {
  return color / 255;
}

/**
 * Converts an RGBA color array to an object
 * @param rgba The RGBA color array to convert
 * @returns The RGBA color object
 */
function rgbaArrayToObject(rgba: RGBA): RGBAColor {
  return {
    r: rgba[0],
    g: rgba[1],
    b: rgba[2],
    a: rgba[3]
  };
}

/**
 * Converts a CMYK color to RGBA
 *
 * @param CMYK The CMYK color to convert
 * @returns The RGBA color
 */
export function CMYKtoRGBA(CMYK: CMYK): RGBA {
  // Normalize the input color components to the range of [0,1]
  const c = CMYK[0] / 100;
  const m = CMYK[1] / 100;
  const y = CMYK[2] / 100;
  const k = CMYK[3] / 100;

  // Convert the normalized CMYK color into RGB components
  // Formula: new_color = 1 - min(1, input_color * (1 - K) + K)
  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);

  return [r, g, b, 1];
}

/**
 * This scales and translates any vector
 * so that it sits on the circumference of
 * a unit rectangle centered at [0.5, 0.5].
 * Used to position gradient control points.
 */
export const scaleAndTranslateToUnitRect = (value: Vector2): Vector2 => {
  const longSide = Math.max(Math.abs(value.x), Math.abs(value.y));
  if (longSide === 0) return { x: 0.5, y: 0.5 };
  return {
    x: (value.x / longSide) * 0.5 + 0.5,
    y: (value.y / longSide) * 0.5 + 0.5
  };
};

const sqrtOfTwo = Math.sqrt(2);
/**
 * Creates `Start` and `End` gradient control points
 * that lie on opposite sides of a unit rectangle.
 * This is our method of placing control points using
 * only an 'angle' input from the User.
 * A line connecting them would sit at an angle of `angleInDegrees`,
 * with 0 pointing upwards and positive values rotating clockwise.
 */
export const angleToGradientControlPoints = (
  angleInDegrees: number,
  aspectRatio: number
) => {
  const rad = ((angleInDegrees + 90) / 180) * Math.PI;
  const start: Vector2 = {
    x: (Math.cos(rad + Math.PI) / aspectRatio) * sqrtOfTwo,
    y: Math.sin(rad + Math.PI) * sqrtOfTwo
  };
  const end: Vector2 = {
    x: (Math.cos(rad) / aspectRatio) * sqrtOfTwo,
    y: Math.sin(rad) * sqrtOfTwo
  };
  return {
    start: scaleAndTranslateToUnitRect(start),
    end: scaleAndTranslateToUnitRect(end)
  };
};
