'use client';

import classNames from 'classnames';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import { SegmentedControl } from './components/SegmentedControl';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const [selectedImage, setSelectedImage] = useState(IMAGE_URLS[0]);
  const [selectedCropPreset, setSelectedCropPreset] = useState(CROP_PRESETS[0]);
  const [selectedCropMode, setSelectedCropMode] = useState(CROP_MODES[0]);
  const [appliedButtonClickCount, setAppliedButtonClickCount] = useState(1);

  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'light',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png']
              }
            }
          }
        }
      },
      license: process.env.NEXT_PUBLIC_LICENSE
    }),
    []
  );

  const configure = useConfigure(
    async (instance) => {
      instance.i18n.setTranslations({
        en: {
          'component.fileOperation.exportImage': 'Export Image'
        }
      });

      await instance.addDefaultAssetSources();
      await instance.addDemoAssetSources({ sceneMode: 'Design' });
      const engine = instance.engine;
      setupDock(instance);
      const unsubscribeInspectorSetup = setupInspectorBar(instance);
      const unsubscribeSceneSetup = await setupPhotoEditingScene(
        instance,
        selectedImage
      );
      const unsubscribeStateChange = instance.engine.editor.onStateChanged(
        () => {
          const page = instance.engine.scene.getCurrentPage();
          if (page == null) return;

          const editMode = instance.engine.editor.getEditMode();
          if (editMode === 'Crop') {
            instance.engine.editor.setHighlightingEnabled(page, true);
          } else {
            instance.engine.editor.setHighlightingEnabled(page, false);
          }
        }
      );
      // Hide 'Crop Area' Inputs on Silent mode
      instance.feature.enable('ly.img.crop.size', false);
      // Remove all existing crop presets
      engine.asset.removeSource('ly.img.page.presets');
      engine.asset.addLocalSource('ly.img.page.presets');
      engine.asset.addAssetToSource('ly.img.page.presets', selectedCropPreset);
      const page = engine.scene.getCurrentPage();
      instance.ui.applyForceCrop(page, {
        mode: selectedCropMode.id,
        presetId: selectedCropPreset.id,
        sourceId: 'ly.img.page.presets'
      });

      return () => {
        unsubscribeInspectorSetup();
        unsubscribeSceneSetup();
        unsubscribeStateChange();
      };
    },
    [appliedButtonClickCount]
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.sidebarWrapper}>
        {/* Select Image */}
        <div className={classes.optionWrapper}>
          <h5 className={classNames('h5', classes.h5)}>Select Image</h5>
          <div className={classes.imagesWrapper}>
            {IMAGE_URLS.map((image, index) => (
              <button
                onClick={() => setSelectedImage(image)}
                className={classes.imageButton}
                key={image.full}
                data-cy={`image-${index}`}
              >
                <img
                  src={image.thumb}
                  className={classNames(classes.image, {
                    [classes.selected]: selectedImage === image
                  })}
                  alt={image.alt}
                />
              </button>
            ))}
          </div>
        </div>
        {/* Select Crop Preset */}
        <div className={classes.optionWrapper}>
          <h5 className={classNames('h5', classes.h5)}>Select Crop Preset</h5>
          <div className={classes.presetsWrapper}>
            {CROP_PRESETS.map((preset) => (
              <div className={classes.presetWrapper} key={preset.id}>
                <button
                  className={classNames(classes.presetButton, {
                    [classes.selected]: selectedCropPreset === preset
                  })}
                  onClick={() => setSelectedCropPreset(preset)}
                  data-cy={`crop-preset-${preset.label.en}`}
                >
                  <div
                    className={classes.presetLogoWrapper}
                    style={{
                      aspectRatio:
                        preset.payload.transformPreset.width /
                        preset.payload.transformPreset.height,
                      width:
                        preset.payload.transformPreset.height >
                        preset.payload.transformPreset.width
                          ? 'auto'
                          : preset.payload.transformPreset.height <
                              preset.payload.transformPreset.width
                            ? '100%'
                            : '42.222px',
                      height:
                        preset.payload.transformPreset.height >
                        preset.payload.transformPreset.width
                          ? '100%'
                          : preset.payload.transformPreset.height <
                              preset.payload.transformPreset.width
                            ? 'auto'
                            : '42.222px'
                    }}
                  >
                    <img
                      src={preset.meta.icon}
                      className={classes.presetLogo}
                      alt={preset.meta.thumbAlt}
                    />
                  </div>
                </button>
                <div className={classes.presetContent}>
                  <span
                    className={classNames(classes.presetLabel, {
                      [classes.selectedLabel]: selectedCropPreset === preset
                    })}
                  >
                    {preset.label.en}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Select Mode */}
        <div className={classes.optionWrapper}>
          <h5 className={classNames('h5', classes.h5)}>Select Mode</h5>
          <SegmentedControl
            options={CROP_MODES}
            onChange={(value) => setSelectedCropMode(value)}
            value={selectedCropMode}
          />
          <p className={classes.modeDescription}>
            {selectedCropMode.description}
          </p>
        </div>
        <button
          className="button button--primary"
          onClick={() => {
            setAppliedButtonClickCount(appliedButtonClickCount + 1);
          }}
          data-cy="applyButton"
        >
          <span>Apply</span>
        </button>
      </div>

      <div
        className={classNames('cesdkWrapperStyle', {
          [classes.cesdkWrapperActive]: !setSelectedImage
        })}
      >
        {appliedButtonClickCount > 0 && (
          <CreativeEditor
            className="cesdkStyle"
            style={{
              // Hide the inspector bar
              '--ubq-InspectorBar-background': 'var(--ubq-canvas)'
            }}
            config={config}
            configure={configure}
          />
        )}
      </div>
    </div>
  );
};

const caseAssetPath = (path, caseId = 'force-crop') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;
const IMAGE_URLS = [
  {
    full: caseAssetPath('/image-1.png'),
    thumb: caseAssetPath('/image-1.png'),
    width: 800,
    height: 1200,
    alt: 'man'
  },
  {
    full: caseAssetPath('/image-2.png'),
    thumb: caseAssetPath('/image-2.png'),
    width: 1200,
    height: 800,
    alt: 'mountain'
  },
  {
    full: caseAssetPath('/image-3.png'),
    thumb: caseAssetPath('/image-3.png'),
    width: 1200,
    height: 1200,
    alt: 'bowl'
  }
];

const CROP_PRESETS = [
  {
    id: 'custom-portrait-post',
    label: {
      en: 'Portrait Post (4:5)'
    },
    meta: {
      thumbUri: caseAssetPath('/thumb-instagram.png'),
      icon: caseAssetPath('/logo-instagram.svg'),
      thumbAlt: 'Instagram Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 4,
        height: 5,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-profile-photo',
    label: {
      en: 'Profile Photo (1:1)'
    },
    meta: {
      thumbUri: caseAssetPath('/thumb-linkedin.png'),
      icon: caseAssetPath('/logo-linkedin.svg'),
      thumbAlt: 'LinkedIn Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-shared-image',
    label: {
      en: 'Shared Image (1.91:1)'
    },
    meta: {
      thumbUri: caseAssetPath('/thumb-facebook.png'),
      icon: caseAssetPath('/logo-facebook.svg'),
      thumbAlt: 'Facebook Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1.91,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  }
];

const CROP_MODES = [
  {
    id: 'always',
    label: 'Always',
    description: 'This mode opens the Crop Mode always.'
  },
  {
    id: 'ifNeeded',
    label: 'If Needed',
    description:
      'This mode opens the Crop Mode only if the media does not match the required size or aspect ratio.'
  },
  {
    id: 'silent',
    label: 'Silent',
    description: 'This mode applies cropping without showing Crop Mode.'
  }
];

// Find out more about changing the Dock in the documentation:
// https://img.ly/docs/cesdk/js/user-interface/customization/dock-cb916c/
function setupDock(instance) {
  // crop button, should open the crop asset lib panel but also enter crop mode
  instance.ui.registerComponent(
    'ly.img.crop.dock',
    ({ builder: { Button } }) => {
      const isCropPanelOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/inspector/crop'
      );
      Button('open-crop', {
        label: 'Crop',
        icon: '@imgly/Crop',
        isSelected: isCropPanelOpen,
        onClick: async () => {
          if (isCropPanelOpen) {
            instance.ui.closePanel('//ly.img.panel/inspector/crop');
            return;
          }
          closeAllPanels(instance);
          // make sure only page is selected
          instance.engine.block.findAllSelected().forEach((block) => {
            if (instance.engine.block.getKind(block) !== 'page') {
              instance.engine.block.setSelected(block, false);
            }
          });
          const page = instance.engine.scene.getCurrentPage();
          instance.engine.block.select(page);
          // ensure update has occurred before opening the crop panel
          await new Promise((resolve) => setTimeout(resolve, 100));
          instance.ui.openPanel('//ly.img.panel/inspector/crop');
        }
      });
    }
  );
  instance.ui.registerComponent(
    'ly.img.adjustment.dock',
    ({ builder: { Button } }) => {
      const inspectorOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/inspector/adjustments'
      );
      Button('open-adjustments', {
        label: 'Adjust',
        icon: '@imgly/Adjustments',
        isSelected: inspectorOpen,
        onClick: () => {
          if (inspectorOpen) {
            instance.ui.closePanel('//ly.img.panel/inspector/adjustments');
          } else {
            closeAllPanels(instance);
            const page = instance.engine.scene.getCurrentPage();
            instance.engine.block.select(page);
            instance.ui.openPanel('//ly.img.panel/inspector/adjustments', {
              floating: true
            });
          }
        }
      });
    }
  );
  instance.ui.registerComponent(
    'ly.img.filter.dock',
    ({ builder: { Button } }) => {
      const inspectorOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/inspector/filters'
      );
      Button('open-filters', {
        label: 'Filter',
        icon: '@imgly/Filter',
        isSelected: inspectorOpen,
        onClick: () => {
          if (inspectorOpen) {
            instance.ui.closePanel('//ly.img.panel/inspector/filters');
          } else {
            closeAllPanels(instance);
            const page = instance.engine.scene.getCurrentPage();
            instance.engine.block.select(page);
            instance.ui.openPanel('//ly.img.panel/inspector/filters', {
              floating: true
            });
          }
        }
      });
    }
  );
  // create a custom button for the vector path asset library entry
  instance.ui.registerComponent(
    'ly.img.vectorpath.dock',
    ({ builder: { Button } }) => {
      const vectorPathLibraryPayload = {
        entries: ['ly.img.vectorpath'],
        title: 'libraries.ly.img.vectorpath.label'
      };
      const isVectorPathAssetLibraryOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/assetLibrary',
        { payload: vectorPathLibraryPayload }
      );
      Button('open-vectorpath', {
        label: 'libraries.ly.img.vectorpath.label',
        icon: '@imgly/Shapes',
        isSelected: isVectorPathAssetLibraryOpen,
        onClick: () => {
          if (isVectorPathAssetLibraryOpen) {
            instance.ui.closePanel('//ly.img.panel/assetLibrary');
          } else {
            closeAllPanels(instance);
            instance.ui.openPanel('//ly.img.panel/assetLibrary', {
              payload: vectorPathLibraryPayload
            });
          }
        }
      });
    }
  );
  instance.ui.setDockOrder([
    'ly.img.spacer',
    'ly.img.crop.dock',
    'ly.img.adjustment.dock',
    'ly.img.filter.dock',
    'ly.img.vectorpath.dock',
    'ly.img.spacer'
  ]);
}

function closeAllPanels(instance) {
  instance.ui.findAllPanels({ open: true }).forEach((panel) => {
    instance.ui.closePanel(panel);
  });
}

// Find out more about changing the Inspector Bar in the documentation:
// https://img.ly/docs/cesdk/js/user-interface/customization/inspector-bar-8ca1cd/
function setupInspectorBar(instance) {
  const inspectorBarOrder = instance.ui.getInspectorBarOrder();
  // on selection change:
  const unsubscribe = instance.engine.block.onSelectionChanged(() => {
    const selection = instance.engine.block.findAllSelected();
    const page = instance.engine.scene.getCurrentPage();
    const selectedBlock = selection[0] ?? page;
    // if selected block is page, hide fill inspector bar
    const isPage = instance.engine.block
      .getType(selectedBlock)
      .includes('page');
    const hiddenInspectorBarItems = [
      'ly.img.crop.inspectorBar',
      // Hide adjustments inspector if page is selected
      isPage && 'ly.img.adjustment.inspectorBar',
      isPage && 'ly.img.filter.inspectorBar',
      isPage && 'ly.img.effect.inspectorBar',
      isPage && 'ly.img.blur.inspectorBar',
      // Hide fill inspector if page is selected
      isPage && 'ly.img.fill.inspectorBar',
      'ly.img.options.inspectorBar',
      'ly.img.inspectorToggle.inspectorBar'
    ].filter(Boolean);
    instance.ui.setInspectorBarOrder([
      ...inspectorBarOrder.filter(
        (item) => !hiddenInspectorBarItems.includes(item.id)
      )
    ]);
  });
  return unsubscribe;
}

async function setupPhotoEditingScene(instance, image) {
  const engine = instance.engine;
  // Hide page title
  engine.editor.setSettingBool('page/title/show', false);
  // Disable placeholder and preview features
  instance.feature.enable('ly.img.placeholder', false);
  instance.feature.enable('ly.img.preview', false);
  // Hide 'Resize' button on the navigation bar
  instance.feature.enable('ly.img.page.resize', false);
  const scene = engine.scene.create('Free');
  engine.scene.setDesignUnit('Pixel');
  const page = engine.block.create('page');
  // Add page to scene
  engine.block.appendChild(scene, page);
  // Set page size
  engine.block.setWidth(page, image.width);
  engine.block.setHeight(page, image.height);
  // Create image fill"
  const fill = engine.block.createFill('image');
  // Set fill url
  engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
    { uri: image.full, width: image.width, height: image.height }
  ]);
  engine.block.setFill(page, fill);
  // Set content fill mode to cover:
  engine.block.setContentFillMode(page, 'Cover');
  // Disable changing fill of page, hides e.g also the "replace" button
  engine.block.setScopeEnabled(page, 'fill/change', false);
  engine.block.setScopeEnabled(page, 'fill/changeType', false);
  // Disable stroke of page, since it does not make sense with current wording and takes up to much space
  engine.block.setScopeEnabled(page, 'stroke/change', false);
  engine.editor.setSettingBool('page/moveChildrenWhenCroppingFill', true);
  engine.block.setClipped(page, true);

  // If nothing is selected: select page by listening to selection changes
  const unsubscribeSelectionChange = engine.block.onSelectionChanged(() => {
    const selection = engine.block.findAllSelected();
    if (selection.length === 0) {
      const page = engine.scene.getCurrentPage();
      engine.block.select(page);
    }
  });

  // Initially select the page
  engine.block.select(page);
  return () => {
    unsubscribeSelectionChange();
  };
}

export default CaseComponent;
