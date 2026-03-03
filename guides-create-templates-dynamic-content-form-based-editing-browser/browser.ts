import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());


    await cesdk.actions.run('scene.create', {
      page: { width: 600, height: 800, unit: 'Pixel' }
    });
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    await this.createTemplate(engine, page);

    const variables = engine.variable.findAll();
    const placeholders = engine.block
      .findByType('graphic')
      .filter((id) => engine.block.isPlaceholderEnabled(id));

    cesdk.ui.registerComponent(
      'template-form-panel-btn-component',
      ({ builder }) => {
        const isPanelOpen = cesdk.ui.isPanelOpen('template-form');
        builder.Button('template-form-panel-btn', {
          label: 'Custom Form',
          isActive: isPanelOpen,
          onClick: () =>
            isPanelOpen
              ? cesdk.ui.closePanel('template-form')
              : cesdk.ui.openPanel('template-form')
        });
      }
    );

    cesdk.ui.registerPanel('template-form', ({ builder }) => {
      if (variables.length > 0) {
        builder.Section('variables-section', {
          title: 'Text Fields',
          children: () => {
            variables.forEach((key) => {
              builder.TextInput(`variable-${key}`, {
                inputLabel: key,
                value: engine.variable.getString(key),
                setValue: (newValue) => {
                  engine.variable.setString(key, newValue);
                }
              });
            });
          }
        });
      }

      if (placeholders.length > 0) {
        builder.Section('placeholders-section', {
          title: 'Images',
          children: () => {
            placeholders.forEach((blockId, index) => {
              const fill = engine.block.getFill(blockId);
              const uri = engine.block.getString(
                fill,
                'fill/image/imageFileURI'
              );

              builder.MediaPreview(`placeholder-${blockId}`, {
                size: 'small',
                preview: { type: 'image', uri },
                action: {
                  label: `Change Image ${index + 1}`,
                  onClick: () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          engine.block.setString(
                            fill,
                            'fill/image/imageFileURI',
                            reader.result as string
                          );
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }
                }
              });
            });
          }
        });
      }

      builder.Section('export-section', {
        title: 'Export',
        children: () => {
          builder.Button('export-button', {
            label: 'Export Template',
            size: 'large',
            onClick: () => {
              const emptyVariables = variables.filter((key) => {
                return !engine.variable.getString(key).trim();
              });

              if (emptyVariables.length > 0) {
                alert(`Required fields: ${emptyVariables.join(', ')}`);
                return;
              }

              this.exportTemplate(engine, page);
            }
          });
        }
      });
    });

    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      'template-form-panel-btn-component'
    ]);
    cesdk.i18n.setTranslations({
      en: {
        'panel.template-form': 'Welcome Form'
      }
    });
    cesdk.ui.openPanel('template-form');
  }

  private async createTemplate(engine: any, page: number): Promise<void> {
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    const title = engine.block.create('text');
    engine.block.setWidth(title, 500);
    engine.block.setHeight(title, 80);
    engine.block.setPositionX(title, 50);
    engine.block.setPositionY(title, 50);
    engine.block.setString(title, 'text/text', '{{tag}}!');
    engine.block.setFloat(title, 'text/fontSize', 64);
    engine.block.setEnum(title, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, title);

    const subtitle = engine.block.create('text');
    engine.block.setWidth(subtitle, 500);
    engine.block.setHeight(subtitle, 60);
    engine.block.setPositionX(subtitle, 50);
    engine.block.setPositionY(subtitle, 140);
    engine.block.setString(subtitle, 'text/text', '{{tagline}}');
    engine.block.setFloat(subtitle, 'text/fontSize', 52);
    engine.block.setEnum(subtitle, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, subtitle);

    const image = engine.block.create('graphic');
    const shape = engine.block.createShape('rect');
    engine.block.setShape(image, shape);
    engine.block.setWidth(image, 500);
    engine.block.setHeight(image, 400);
    engine.block.setPositionX(image, 50);
    engine.block.setPositionY(image, 250);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(image, imageFill);
    engine.block.setPlaceholderEnabled(image, true);
    engine.block.appendChild(page, image);

    engine.variable.setString('tag', 'Welcome');
    engine.variable.setString('tagline', 'Your personalized design');
  }

  private async exportTemplate(engine: any, page: number): Promise<void> {
    try {
      const blob = await engine.block.export(page, 'image/png');
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'template.png';
      link.click();

      URL.revokeObjectURL(url);
      alert('Template exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Check console for details.');
    }
  }
}

export default Example;
