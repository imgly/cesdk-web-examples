import CreativeEditorSDK, {
  AssetResult,
  CreativeEngine
} from '@cesdk/cesdk-js';
import { removeBackground } from '@imgly/background-removal';
import APP_ASSETS from '../assets/Apps.json';
import { caseAssetPath } from '../util/photo-util';
import { getImageSize } from './CreativeEngineUtils';
import loadAssetSourceFromContentJSON from './loadAssetSourceFromContentJSON';

export async function initPhotoEditorUIConfig(
  instance: CreativeEditorSDK,
  photoUri: string
) {
  setupDock(instance);
  // Hide 'Resize' button on the navigation bar
  instance.feature.enable('ly.img.page.resize', false);
  const unsubscribeInspectorSetup = setupInspectorBar(instance);
  loadAssetSourceFromContentJSON(
    instance.engine,
    APP_ASSETS,
    caseAssetPath(''),
    createApplyAppAsset(instance)
  );
  // setup translation for apps
  instance.i18n.setTranslations({
    en: {
      'libraries.ly.img.apps.label': 'Apps'
    }
  });

  const unsubscribeSceneSetup = await setupPhotoEditingScene(
    instance,
    photoUri
  );

  instance.i18n.setTranslations({
    en: {
      'panel.ly.img.page-crop': 'Crop'
    }
  });

  const unsubscribeStateChange = instance.engine.editor.onStateChanged(() => {
    const page = instance.engine.scene.getCurrentPage();
    if (page == null) return;

    const editMode = instance.engine.editor.getEditMode();
    if (editMode === 'Crop') {
      instance.engine.editor.setHighlightingEnabled(page, true);
    } else {
      instance.engine.editor.setHighlightingEnabled(page, false);
    }
  });

  return () => {
    unsubscribeInspectorSetup();
    unsubscribeSceneSetup();
    unsubscribeStateChange();
  };
}

// Find out more about changing the Inspector Bar in the documentation:
// https://img.ly/docs/cesdk/ui/customization/api/inspectorBar/
function setupInspectorBar(instance: CreativeEditorSDK) {
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
      // Hide fill inspector if page is selected
      isPage && 'ly.img.fill.inspectorBar',
      'ly.img.options.inspectorBar'
    ].filter(Boolean);
    instance.ui.setInspectorBarOrder([
      ...inspectorBarOrder.filter(
        (item) => !hiddenInspectorBarItems.includes(item.id)
      )
    ]);
  });
  return unsubscribe;
}

// Find out more about changing the Dock in the documentation:
// https://img.ly/docs/cesdk/ui/customization/api/dock/
function setupDock(instance: CreativeEditorSDK) {
  // crop button, should open the crop asset lib panel but also enter crop mode
  instance.ui.registerComponent(
    'ly.img.crop.dock',
    ({ builder: { Button } }) => {
      const isCropPanelOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/inspector/crop'
      );
      Button('open-crop', {
        label: 'Crop',
        icon: ({ theme }) => caseAssetPath(`/crop-large-${theme}.svg`),
        isSelected: isCropPanelOpen,
        onClick: async () => {
          if (isCropPanelOpen) {
            instance.ui.closePanel('//ly.img.panel/inspector/crop');
            return;
          }

          // make sure only page is selected
          const allSelectedBlocks = instance.engine.block.findAllSelected();
          allSelectedBlocks.forEach((block) => {
            if (instance.engine.block.getType(block) !== '//ly.img.ubq/page') {
              instance.engine.block.setSelected(block, false);
            }
          });

          closeAllPanels(instance);

          // ensure update has occurred before opening the crop panel
          await new Promise((resolve) => setTimeout(resolve, 100));
          instance.ui.openPanel('//ly.img.panel/inspector/crop');
        }
      });
    }
  );
  // create a custom button for the text asset library entry
  instance.ui.registerComponent(
    'ly.img.text.dock',
    ({ builder: { Button } }) => {
      const textLibraryPayload = {
        entries: ['ly.img.text'],
        title: 'libraries.ly.img.text.label'
      };
      const isTextAssetLibraryOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/assetLibrary',
        { payload: textLibraryPayload }
      );
      Button('open-text', {
        label: 'Text',
        icon: '@imgly/Text',
        isSelected: isTextAssetLibraryOpen,
        onClick: () => {
          if (isTextAssetLibraryOpen) {
            instance.ui.closePanel('//ly.img.panel/assetLibrary');
          } else {
            closeAllPanels(instance);
            instance.ui.openPanel('//ly.img.panel/assetLibrary', {
              payload: textLibraryPayload
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
  // create a custom button for the apps asset library entry
  instance.ui.registerComponent(
    'ly.img.apps.dock',
    ({ builder: { Button } }) => {
      const appsLibraryPayload = {
        entries: ['ly.img.apps'],
        title: 'libraries.ly.img.apps.label'
      };
      const isAppsAssetLibraryOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/assetLibrary',
        { payload: appsLibraryPayload }
      );
      Button('open-apps', {
        label: 'Apps',
        icon: ({ theme }) => caseAssetPath(`/apps-sizes-large-${theme}.svg`),
        isSelected: isAppsAssetLibraryOpen,
        onClick: () => {
          if (isAppsAssetLibraryOpen) {
            instance.ui.closePanel('//ly.img.panel/assetLibrary');
          } else {
            closeAllPanels(instance);
            instance.ui.openPanel('//ly.img.panel/assetLibrary', {
              payload: appsLibraryPayload
            });
          }
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
        icon: ({ theme }) => caseAssetPath(`/adjustment-large-${theme}.svg`),
        isSelected: inspectorOpen,
        onClick: () => {
          if (inspectorOpen) {
            instance.ui.closePanel('//ly.img.panel/inspector/adjustments');
          } else {
            closeAllPanels(instance);
            const page = instance.engine.scene.getCurrentPage();
            instance.engine.block.select(page!);
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
        icon: ({ theme }) => caseAssetPath(`/filter-large-${theme}.svg`),
        isSelected: inspectorOpen,
        onClick: () => {
          if (inspectorOpen) {
            instance.ui.closePanel('//ly.img.panel/inspector/filters');
          } else {
            closeAllPanels(instance);
            const page = instance.engine.scene.getCurrentPage();
            instance.engine.block.select(page!);
            instance.ui.openPanel('//ly.img.panel/inspector/filters', {
              floating: true
            });
          }
        }
      });
    }
  );

  instance.ui.addAssetLibraryEntry({
    id: 'ly.img.apps',
    sourceIds: ['ly.img.apps'],
    previewLength: 3,
    gridColumns: 3,
    gridItemHeight: 'auto',
    previewBackgroundType: 'contain',
    gridBackgroundType: 'cover',
    cardLabel: (assetResult) => assetResult.label,
    cardLabelPosition: () => 'below'
  });
  instance.ui.addAssetLibraryEntry({
    id: 'ly.img.formats',
    sourceIds: ['ly.img.formats'],
    previewLength: 3,
    gridColumns: 3,
    gridItemHeight: 'auto',
    previewBackgroundType: 'contain',
    gridBackgroundType: 'cover',
    cardLabel: (assetResult) => assetResult.label,
    cardLabelPosition: () => 'below'
  });

  instance.ui.setDockOrder([
    'ly.img.spacer',
    'ly.img.crop.dock',
    'ly.img.adjustment.dock',
    'ly.img.filter.dock',
    'ly.img.separator',
    // We use a custom button for the text asset library entry instead of the default one
    // This way we can ensure to close the other panels when opening the text asset library
    'ly.img.text.dock',
    'ly.img.vectorpath.dock',
    'ly.img.spacer',
    'ly.img.apps.dock'
  ]);
}

async function setupPhotoEditingScene(
  instance: CreativeEditorSDK,
  uri: string
) {
  const engine = instance.engine;
  const size = await getImageSize(uri);
  if (!size || !size.width || !size.height) {
    throw new Error('Could not get image size');
  }
  const { width, height } = size;
  // hide page title:
  engine.editor.setSetting('page/title/show', false);

  const scene = engine.scene.create('Free');
  engine.scene.setDesignUnit('Pixel');
  const page = engine.block.create('page');
  // Add page to scene:
  engine.block.appendChild(scene, page);
  // Set page size:
  engine.block.setWidth(page, width);
  engine.block.setHeight(page, height);
  // Create image fill"
  const fill = engine.block.createFill('image');
  // Set fill url:
  engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
    { uri, width, height }
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
      engine.block.select(page!);
    }
  });

  // Initially select the page
  engine.block.select(page);
  return () => {
    unsubscribeSelectionChange();
  };
}

function createApplyAppAsset(
  instance: CreativeEditorSDK
): (asset: AssetResult) => Promise<number | undefined> {
  return async (asset) => {
    const engine = instance.engine;
    if (asset.id === 'remove-bg') {
      await applyRemoveBackground(engine);
    }
    return undefined;
  };
}

async function applyRemoveBackground(engine: CreativeEngine) {
  const page = engine.scene.getCurrentPage()!;
  const fill = engine.block.getFill(page);
  const sourceSet = engine.block.getSourceSet(fill, 'fill/image/sourceSet');
  const imageSource = sourceSet[0];
  const oldImageUri = imageSource.uri;
  engine.block.setState(page, { type: 'Pending', progress: 0 });
  const removedBackgroundBlob = await removeBackground(oldImageUri);
  const newImageUri = URL.createObjectURL(removedBackgroundBlob);
  engine.block.setState(page, { type: 'Ready' });
  // update image file URI
  engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
    { ...imageSource, uri: newImageUri }
  ]);
  engine.editor.addUndoStep();
}

function closeAllPanels(instance: CreativeEditorSDK) {
  // close crop:
  instance.ui.closePanel('ly.img.page-crop');
  // exit crop mode:
  if (instance.engine.editor.getEditMode() === 'Crop') {
    instance.engine.editor.setEditMode('Transform');
  }
  // close asset library panels:
  instance.ui.closePanel('//ly.img.panel/assetLibrary');
  // close inspector panels:
  instance.ui.closePanel('//ly.img.panel/inspector/adjustments');
  instance.ui.closePanel('//ly.img.panel/inspector/filters');
  instance.ui.closePanel('//ly.img.panel/inspector/fill');
}
