import {
  BlurAssetSource,
  ColorPaletteAssetSource,
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
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { DesignEditorConfig } from '../lib/design-editor/plugin';

import { useEffect, useRef, useState } from 'react';
import classes from './CreativeEditor.module.css';

const CreativeEditor = ({ preset, cropMode, image, closeEditor }) => {
  const cesdkContainer = useRef(null);
  const overlayContainer = useRef(null);
  const [cesdkInstance, setCesdkInstance] = useState(null);

  useEffect(() => {
    const config = {
      license: process.env.NEXT_PUBLIC_LICENSE
    };
    let unsubscribeInspectorSetup = null;
    let unsubscribeSceneSetup = null;
    let unsubscribeStateChange = null;
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          setCesdkInstance(instance);

          // Add the design editor configuration plugin first
          await instance.addPlugin(new DesignEditorConfig());

          // Asset Source Plugins (replaces addDefaultAssetSources)
          await instance.addPlugin(new ColorPaletteAssetSource());
          await instance.addPlugin(new TypefaceAssetSource());
          await instance.addPlugin(new TextAssetSource());
          await instance.addPlugin(new TextComponentAssetSource());
          await instance.addPlugin(new VectorShapeAssetSource());
          await instance.addPlugin(new StickerAssetSource());
          await instance.addPlugin(new EffectsAssetSource());
          await instance.addPlugin(new FiltersAssetSource());
          await instance.addPlugin(new BlurAssetSource());
          await instance.addPlugin(new PagePresetsAssetSource());
          await instance.addPlugin(
            new UploadAssetSources({
              include: ['ly.img.image.upload']
            })
          );

          // Demo assets (replaces addDemoAssetSources)
          await instance.addPlugin(
            new DemoAssetSources({
              include: ['ly.img.image.*', 'ly.img.templates.blank.*']
            })
          );

          const engine = instance.engine;
          engine.editor.setRole('Adopter');
          // change the position of the close button to the left
          instance.ui.insertNavigationBarOrderComponent(
            'first',
            {
              id: 'ly.img.close.navigationBar',
              onClick: () => closeEditor()
            },
            'before'
          );
          // Add 'Export Image' button at the right side of the navigation bar
          instance.ui.insertNavigationBarOrderComponent('last', {
            id: 'ly.img.actions.navigationBar',
            children: [
              {
                id: 'ly.img.exportImage.navigationBar',
                label: 'Export Image'
              }
            ]
          });
          setupDock(instance);
          unsubscribeInspectorSetup = setupInspectorBar(instance);
          unsubscribeSceneSetup = await setupPhotoEditingScene(instance, image);
          unsubscribeStateChange = instance.engine.editor.onStateChanged(() => {
            const page = instance.engine.scene.getCurrentPage();
            if (page == null) return;
            const editMode = instance.engine.editor.getEditMode();
            if (editMode === 'Crop') {
              instance.engine.editor.setHighlightingEnabled(page, true);
            } else {
              instance.engine.editor.setHighlightingEnabled(page, false);
            }
          });
          // Hide 'Crop Area' Inputs on Silent mode
          instance.feature.enable('ly.img.crop.size', false);
          // Remove all existing crop presets
          engine.asset.removeSource('ly.img.page.presets');
          engine.asset.addLocalSource('ly.img.page.presets');
          engine.asset.addAssetToSource('ly.img.page.presets', preset);
          const page = engine.scene.getCurrentPage();
          instance.ui.applyForceCrop(page, {
            mode: cropMode.id,
            presetId: preset.id,
            sourceId: 'ly.img.page.presets'
          });
        }
      );
    }
    return () => {
      if (cesdkInstance) {
        unsubscribeInspectorSetup();
        unsubscribeSceneSetup();
        unsubscribeStateChange();
        cesdkInstance.dispose();
      }
    };
  }, [cesdkContainer, closeEditor]);

  return (
    <div
      className={classes.overlay}
      ref={overlayContainer}
      style={{
        // Hide the inspector bar
        '--ubq-InspectorBar-background': 'var(--ubq-canvas)'
      }}
      // Let the editor close when clicking outside the modal
      onClick={(event) => {
        if (
          overlayContainer.current &&
          overlayContainer.current === event.target
        ) {
          closeEditor();
        }
      }}
    >
      <div className={classes.modal}>
        <div ref={cesdkContainer} className={classes.cesdkContainer}></div>
      </div>
    </div>
  );
};

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
        entries: ['ly.img.vector.shape'],
        title: 'libraries.ly.img.vector.shape.label'
      };
      const isVectorPathAssetLibraryOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/assetLibrary',
        { payload: vectorPathLibraryPayload }
      );
      Button('open-vectorpath', {
        label: 'libraries.ly.img.vector.shape.label',
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
      isPage && 'ly.img.appearance.inspectorBar',
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
  engine.editor.setSetting('page/title/show', false);
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
  // Create image fill
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
  engine.editor.setSetting('page/moveChildrenWhenCroppingFill', true);
  engine.block.setClipped(page, true);

  // Zoom auto-fit to page
  instance.actions.run('zoom.toPage', {
    autoFit: true
  });

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
  return unsubscribeSelectionChange;
}

function closeAllPanels(instance) {
  instance.ui.findAllPanels({ open: true }).forEach((panel) => {
    instance.ui.closePanel(panel);
  });
}

export default CreativeEditor;
