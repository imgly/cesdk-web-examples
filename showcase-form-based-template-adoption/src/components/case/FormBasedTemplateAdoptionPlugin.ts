import { EditorPlugin } from '@cesdk/cesdk-js';
import CreativeEngine, {
  isRGBAColor,
  type Color,
  type RGBAColor
} from '@cesdk/engine';
const SCENE_PADDING = 60;

export const FormBasedTemplateAdoptionPlugin = (): EditorPlugin => ({
  name: 'ly.img.form-based-template-adoption',
  version: '1.0.0',
  initialize: async ({ cesdk }) => {
    if (cesdk == null) return;

    const engine = cesdk.engine;

    engine.editor.setSettingBool('page/title/show', false);
    engine.editor.setSettingBool('mouse/enableScroll', false);
    engine.editor.setSettingBool('mouse/enableZoom', false);

    // Hide all UI elements
    cesdk.ui.setInspectorBarOrder([]);
    cesdk.ui.setDockOrder([]);
    cesdk.ui.setCanvasBarOrder([], 'bottom');
    cesdk.ui.setNavigationBarOrder([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.actions.navigationBar'
    ]);
    // Hide 'Resize' button on the navigation bar
    cesdk.feature.enable('ly.img.page.resize', false);

    cesdk.setTranslations({
      en: {
        'panel.form-based-adaption': 'Edit Template'
      },
      de: {
        'panel.form-based-adaption': 'Template bearbeiten'
      }
    });

    engine.editor.setGlobalScope('editor/select', 'Deny');

    let imageBlocks: number[] = [];
    let editableImageTemplateBlocks: EditableProperty[] = [];
    let textBlocks = [];
    let editableTextTemplateBlocks: EditableProperty[] = [];

    let colors: Record<
      string,
      | {
          id: number;
          color: RGBAColor;
          initialOpacity: number;
          type: 'fill' | 'stroke' | 'text';
        }[]
      | undefined
    > = {};

    // Whenever the element size changes, we want to zoom to the canvas
    const resizeObserver = new ResizeObserver(() => {
      const scene = engine.scene?.get();
      if (!engine.scene) {
        resizeObserver.disconnect();
        return;
      }
      if (scene === null) return;
      engine.scene.zoomToBlock(
        scene!,
        SCENE_PADDING,
        SCENE_PADDING,
        SCENE_PADDING,
        SCENE_PADDING
      );
    });
    resizeObserver.observe(engine.element!);

    // On scene change/load:
    engine.scene.onActiveChanged(() => {
      async function setupScene() {
        const engine = cesdk!.engine;
        // Relocate all transient resources to blob and blob urls.
        // This is important to be able to show image previews in the UI
        relocateResourcesToBlobURLs(engine);
        // Deselect all blocks
        engine.block.findAllSelected().forEach((block) => {
          engine.block.setSelected(block, false);
        });

        imageBlocks = getTemplateImageBlocks(engine);
        editableImageTemplateBlocks = BlocksToEditableProperties(
          engine,
          imageBlocks
        );

        textBlocks = getTemplateTextBlocks(engine);
        editableTextTemplateBlocks = BlocksToEditableProperties(
          engine,
          textBlocks,
          (block) => {
            const text = engine.block.getString(block, 'text/text');
            return {
              expanded: text.includes('\n')
            };
          }
        );

        colors = getAllColors(engine);

        await waitUntilLoaded(engine);
        engine.scene.zoomToBlock(
          engine.scene.get()!,
          SCENE_PADDING,
          SCENE_PADDING,
          SCENE_PADDING,
          SCENE_PADDING
        );
        // reset history, e.g to include selection changes made above
        let oldHistory = engine.editor.getActiveHistory();
        let newHistory = engine.editor.createHistory();
        engine.editor.setActiveHistory(newHistory);
        engine.editor.destroyHistory(oldHistory);
        engine.editor.addUndoStep();
      }
      setupScene();
    });

    cesdk.ui.registerPanel(
      'form-based-adaption',
      ({ builder, engine, state }) => {
        const pages = engine.block.findByType('page');
        if (pages.length === 0) return;

        if (imageBlocks.length > 0) {
          builder.Section('form-based-adaption.image', {
            title: 'Image',
            children: () => {
              editableImageTemplateBlocks.forEach(({ blocks }) => {
                const block = blocks[0];
                const fillBlock = engine.block.getFill(block);
                const uri =
                  engine.block.getSourceSet(
                    fillBlock,
                    'fill/image/sourceSet'
                  )?.[0]?.uri ??
                  engine.block.getString(fillBlock, 'fill/image/imageFileURI');

                const uploadState = state(`imageUpload-${block}`, false);

                const blockName = engine.block.getName(block);

                builder.MediaPreview(`imagePreview-${block}`, {
                  size: 'small',
                  preview: {
                    type: 'image',
                    uri
                  },
                  action: {
                    label: `Change ${blockName || 'Image'}`,
                    isLoading: uploadState.value,
                    onClick: () => {
                      uploadFile({
                        supportedMimeTypes: ['image/*']
                      }).then((files) => {
                        const [file] = files;
                        if (file != null) {
                          const url = URL.createObjectURL(file);
                          blocks.map((blockToChange) => {
                            const fillToChange =
                              engine.block.getFill(blockToChange);
                            engine.block.setString(
                              fillToChange,
                              'fill/image/imageFileURI',
                              ''
                            );
                            engine.block.setSourceSet(
                              fillToChange,
                              'fill/image/sourceSet',
                              []
                            );
                            return engine.block
                              .addImageFileURIToSourceSet(
                                fillToChange,
                                'fill/image/sourceSet',
                                url
                              )
                              .then(() => {
                                uploadState.setValue(false);
                                engine.editor.addUndoStep();
                              })
                              .catch(() => {
                                console.error('Error uploading image');
                                uploadState.setValue(false);
                              });
                          });
                        }
                      });
                    }
                  }
                });
              });
            }
          });
        }

        if (textBlocks.length > 0) {
          // state of the text block, if they are expanded or not:
          const textBlockState = state<Map<string, TextEditingOptions>>(
            'textBlockState',
            new Map(
              editableTextTemplateBlocks.map(({ name, options }) => [
                name,
                options
              ])
            )
          );
          builder.Section('form-based-adaption.text', {
            title: 'Text',
            children: () => {
              editableTextTemplateBlocks.forEach(({ blocks, name }) => {
                const value = engine.block.getString(blocks[0], 'text/text');
                const setValue = (newValue: string) => {
                  blocks.forEach((block) => {
                    engine.block.replaceText(block, newValue);
                  });
                  cesdk.engine.editor.addUndoStep();
                };
                const expanded =
                  textBlockState.value.get(name)!.expanded ?? false;
                if (expanded) {
                  builder.TextArea(`text-${name}`, {
                    inputLabel: name,
                    value,
                    setValue
                  });
                } else {
                  builder.TextInput(`text-${name}`, {
                    inputLabel: name,
                    value,
                    setValue
                  });
                }
              });
            }
          });
        }

        builder.Section('form-based-adaption.color', {
          title: 'Color',
          children: () => {
            Object.keys(colors).forEach((colorId, i) => {
              const color = JSON.parse(colorId) as Color;
              const colorState = state(`color-${colorId}`, color);

              const foundsColors = colors[colorId];

              builder.ColorInput(`color-${colorId}`, {
                inputLabel: `Color ${i + 1}`,
                value: colorState.value,

                setValue: (newValue) => {
                  colorState.setValue(newValue);

                  foundsColors!.forEach((foundColor) => {
                    if (foundColor.type === 'fill') {
                      const fill = engine.block.getFill(foundColor.id);
                      engine.block.setColor(fill, 'fill/color/value', {
                        ...newValue,
                        a: foundColor.initialOpacity
                      });
                    } else if (foundColor.type === 'stroke') {
                      engine.block.setStrokeColor(foundColor.id, {
                        ...newValue,
                        a: foundColor.initialOpacity
                      });
                    } else if (foundColor.type === 'text') {
                      engine.block.setTextColor(foundColor.id, {
                        ...newValue,
                        a: foundColor.initialOpacity
                      });
                    }
                  });
                }
              });
            });
            cesdk.engine.editor.addUndoStep();
          }
        });
      }
    );

    cesdk.ui.openPanel('form-based-adaption', { closableByUser: false });

    return cesdk;
  }
});

// Currently we do not have a proper way to wait until the editor is fully loaded
const waitUntilLoaded = async (engine: CreativeEngine): Promise<void> => {
  await engine.block.forceLoadResources([engine.scene.get()!]);
};

const getAllColors = (engine: CreativeEngine) => {
  const allElements = engine.block.findAll();
  const elementsWithFillColor: number[] = [];
  const elementsWithStroke: number[] = [];
  const elementsWithTextColor: number[] = [];

  allElements.forEach((element) => {
    const withFillColor =
      engine.block.supportsFill(element) &&
      engine.block.isValid(engine.block.getFill(element)) &&
      engine.block.getType(engine.block.getFill(element)) ===
        '//ly.img.ubq/fill/color' &&
      engine.block.isFillEnabled(element) &&
      !(engine.block.getType(element) === '//ly.img.ubq/text');

    if (withFillColor) {
      engine.block.isScopeEnabled(element, 'fill/change');
      elementsWithFillColor.push(element);
    }

    const withStroke =
      engine.block.supportsStroke(element) &&
      engine.block.isStrokeEnabled(element);

    if (withStroke) {
      engine.block.isScopeEnabled(element, 'stroke/change');
      elementsWithStroke.push(element);
    }

    const withTextColor = engine.block.getType(element) === '//ly.img.ubq/text';
    if (withTextColor) {
      elementsWithTextColor.push(element);
    }
  });

  const blocksByColors: Record<
    string,
    {
      id: number;
      color: RGBAColor;
      initialOpacity: number;
      type: 'fill' | 'stroke' | 'text';
    }[]
  > = {};

  elementsWithFillColor.forEach((element) => {
    const fill = engine.block.getFill(element);
    const color = engine.block.getColor(fill, 'fill/color/value');
    if (!isRGBAColor(color)) return;

    const initialOpacity = color.a;
    color.a = 1;

    const colorId = JSON.stringify(color);
    blocksByColors[colorId] = blocksByColors[colorId] || [];
    blocksByColors[colorId].push({
      id: element,
      color,
      initialOpacity,
      type: 'fill'
    });
  });

  elementsWithStroke.forEach((element) => {
    const color = engine.block.getStrokeColor(element);
    if (!isRGBAColor(color)) return;

    const initialOpacity = color.a;
    color.a = 1;

    const colorId = JSON.stringify(color);
    blocksByColors[colorId] = blocksByColors[colorId] || [];
    blocksByColors[colorId].push({
      id: element,
      color,
      initialOpacity,
      type: 'stroke'
    });
  });

  elementsWithTextColor.forEach((element) => {
    const textColors = engine.block.getTextColors(element);
    if (textColors.length === 1) {
      const color = textColors[0];

      if (!isRGBAColor(color)) return;

      const initialOpacity = color.a;
      color.a = 1;

      const colorId = JSON.stringify(color);
      blocksByColors[colorId] = blocksByColors[colorId] || [];
      blocksByColors[colorId].push({
        id: element,
        color,
        initialOpacity,
        type: 'text'
      });
    }
  });

  return blocksByColors;
};

export const uploadFile = (() => {
  let element: HTMLInputElement | undefined;

  element = document.createElement('input');
  element.setAttribute('type', 'file');
  element.style.display = 'none';
  document.body.appendChild(element);

  return ({ supportedMimeTypes, multiple = true }: any) => {
    const accept = supportedMimeTypes.join(',');

    if (element == null) {
      return Promise.reject(new Error('No valid upload element created'));
    }
    const element_ = element;
    return new Promise<File[]>((resolve, reject) => {
      if (accept) {
        element_.setAttribute('accept', accept);
      }
      if (multiple) {
        element_.setAttribute('multiple', String(multiple));
      }
      element_.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const files = Object.values(target.files);
          resolve(files);
        } else {
          reject(new Error('No files selected'));
        }
        element_.onchange = null;
        element_.value = '';
      };
      element_.click();
    });
  };
})();

function relocateResourcesToBlobURLs(engine: CreativeEngine) {
  engine.editor.findAllTransientResources().forEach((resource) => {
    // @ts-ignore
    const uri = resource.URL;
    if (uri.includes('bundle://ly.img.cesdk/')) return;

    const length = engine.editor.getBufferLength(uri);
    const data = engine.editor.getBufferData(uri, 0, length);

    const blob = new Blob([data as BlobPart]);
    const blobURL = URL.createObjectURL(blob);
    engine.editor.relocateResource(uri, blobURL);
  });
}

function orderBlocksByDistanceToTopLeft(
  engine: CreativeEngine,
  blocks: number[]
): number[] {
  const topLeft = { x: 0, y: 0 };
  return blocks.sort((a, b) => {
    const aPos = {
      x: engine.block.getPositionX(a),
      y: engine.block.getPositionY(a)
    };
    const bPos = {
      x: engine.block.getPositionX(b),
      y: engine.block.getPositionY(b)
    };

    const aDistance = Math.sqrt(
      Math.pow(aPos.x - topLeft.x, 2) + Math.pow(aPos.y - topLeft.y, 2)
    );
    const bDistance = Math.sqrt(
      Math.pow(bPos.x - topLeft.x, 2) + Math.pow(bPos.y - topLeft.y, 2)
    );

    return aDistance - bDistance;
  });
}

function getTemplateTextBlocks(engine: CreativeEngine): number[] {
  return orderBlocksByDistanceToTopLeft(
    engine,
    engine.block.findByType('text').filter((block) => {
      return engine.block.isScopeEnabled(block, 'text/edit');
    })
  );
}

function getTemplateImageBlocks(engine: CreativeEngine): number[] {
  return orderBlocksByDistanceToTopLeft(
    engine,
    engine.block.findByType('graphic').filter((block) => {
      if (!engine.block.supportsFill(block)) return false;

      const fillBlock = engine.block.getFill(block);
      const fillType = engine.block.getType(fillBlock);
      if (fillType !== '//ly.img.ubq/fill/image') return false;

      const scopeEnabled = engine.block.isScopeEnabled(block, 'fill/change');
      if (!scopeEnabled) return false;

      return true;
    })
  );
}

interface EditableProperty {
  name: string;
  blocks: number[];
  options: EditingOptions;
}
interface EditingOptions extends ImageEditingOptions, TextEditingOptions {}

interface ImageEditingOptions {}
interface TextEditingOptions {
  expanded: boolean;
}

function BlocksToEditableProperties(
  engine: CreativeEngine,
  blocks: number[],
  defaultOptions?: (block: number) => EditingOptions
): EditableProperty[] {
  return blocks
    .map((block) => {
      const name = engine.block.getName(block) || block.toString();
      return {
        name,
        blocks: [block],
        options: defaultOptions?.(block) ?? ({} as EditingOptions)
      };
    })
    .reduce<EditableProperty[]>((acc, block) => {
      const name = block.name;
      const existing = acc.find((existing) => existing.name === name);
      if (existing) {
        existing.blocks.push(...block.blocks);
      } else {
        acc.push(block);
      }
      return acc;
    }, []);
}
