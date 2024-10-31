import CreativeEditorSDK, {
  AssetResult,
  CreativeEngine,
  DesignUnit,
  SettingsBool
} from '@cesdk/cesdk-js';
import { removeBackground } from '@imgly/background-removal';
import APP_ASSETS from './Apps.json';
import FORMAT_ASSETS from './CustomFormats.json';
import PageCropPanel, { setTempSizeInMetadata } from './PageCropPanel';
import { getImageSize } from './lib/CreativeEngineUtils';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

export async function initPhotoEditorUIConfig(
  instance: CreativeEditorSDK,
  photoUri: string
) {
  setupDock(instance);
  const unsubscribeInspectorSetup = setupInspectorBar(instance);
  loadAssetSourceFromContentJSON(
    instance.engine,
    FORMAT_ASSETS,
    caseAssetPath(''),
    createApplyFormatAsset(instance)
  );
  // setup translation for formats
  instance.setTranslations({
    en: {
      'libraries.ly.img.formats.label': 'Size',
      'libraries.ly.img.formats.custom.label': 'Custom',
      'libraries.ly.img.formats.social.label': 'Social',
      'libraries.ly.img.formats.print.label': 'Print'
    }
  });
  loadAssetSourceFromContentJSON(
    instance.engine,
    APP_ASSETS,
    caseAssetPath(''),
    createApplyAppAsset(instance)
  );
  // setup translation for apps
  instance.setTranslations({
    en: {
      'libraries.ly.img.apps.label': 'Apps'
    }
  });

  const unsubscribeSceneSetup = await setupPhotoEditingScene(
    instance,
    photoUri
  );

  instance.ui.registerPanel('ly.img.page-crop', (context) =>
    PageCropPanel({ ...context, ui: instance.ui })
  );
  instance.setTranslations({
    en: {
      'panel.ly.img.page-crop': 'Crop'
    }
  });
  instance.ui.openPanel('ly.img.page-crop');

  return () => {
    unsubscribeInspectorSetup();
    unsubscribeSceneSetup();
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
      isPage && 'ly.img.adjustment.inspectorBar',
      isPage && 'ly.img.filter.inspectorBar',
      isPage && 'ly.img.effect.inspectorBar',
      isPage && 'ly.img.blur.inspectorBar',
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
      const isFormatAssetLibraryOpen =
        instance.ui.isPanelOpen('ly.img.page-crop');
      Button('open-crop', {
        label: 'Crop',
        icon: ({ theme }) => caseAssetPath(`/crop-large-${theme}.svg`),
        isSelected: isFormatAssetLibraryOpen,
        onClick: async () => {
          if (isFormatAssetLibraryOpen) {
            instance.ui.closePanel('ly.img.page-crop');
            instance.engine.editor.setEditMode('Transform');
            return;
          }
          closeAllPanels(instance);
          const page = instance.engine.scene.getCurrentPage();
          instance.engine.block.select(page!);
          await new Promise((resolve) => setTimeout(resolve, 100));
          instance.ui.openPanel('ly.img.page-crop');
          instance.engine.editor.setEditMode('Crop');
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
  // create a custom button for the sticker asset library entry
  instance.ui.registerComponent(
    'ly.img.sticker.dock',
    ({ builder: { Button } }) => {
      const stickerLibraryPayload = {
        entries: ['ly.img.sticker'],
        title: 'libraries.ly.img.sticker.label'
      };
      const isStickerAssetLibraryOpen = instance.ui.isPanelOpen(
        '//ly.img.panel/assetLibrary',
        { payload: stickerLibraryPayload }
      );
      Button('open-sticker', {
        label: 'Sticker',
        icon: '@imgly/Sticker',
        isSelected: isStickerAssetLibraryOpen,
        onClick: () => {
          if (isStickerAssetLibraryOpen) {
            instance.ui.closePanel('//ly.img.panel/assetLibrary');
          } else {
            closeAllPanels(instance);
            instance.ui.openPanel('//ly.img.panel/assetLibrary', {
              payload: stickerLibraryPayload
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
    'ly.img.sticker.dock',
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
  engine.editor.setSettingBool('page/title/show', false);

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

  // only allow resizing and moving of page in crop mode
  const unsubscribeStateChange = engine.editor.onStateChanged(() => {
    const editMode = engine.editor.getEditMode();
    const cropConstraint = getCropConstraintMetadata(engine);
    if (editMode !== 'Crop') {
      // close size preset panel
      instance.ui.closePanel('ly.img.page-crop');
      engine.editor.setSettingBool(
        'ubq://page/allowResizeInteraction' as SettingsBool,
        false
      );
      return;
    }
    if (cropConstraint === 'none') {
      engine.editor.setSettingBool(
        'ubq://page/restrictResizeInteractionToFixedAspectRatio' as SettingsBool,
        false
      );
      engine.editor.setSettingBool(
        'ubq://page/allowResizeInteraction' as SettingsBool,
        true
      );
    } else if (cropConstraint === 'aspect-ratio') {
      engine.editor.setSettingBool(
        'ubq://page/restrictResizeInteractionToFixedAspectRatio' as SettingsBool,
        true
      );
      engine.editor.setSettingBool(
        'ubq://page/allowResizeInteraction' as SettingsBool,
        true
      );
    } else if (cropConstraint === 'resolution') {
      engine.editor.setSettingBool(
        'ubq://page/allowResizeInteraction' as SettingsBool,
        false
      );
      engine.editor.setSettingBool(
        'ubq://page/restrictResizeInteractionToFixedAspectRatio' as SettingsBool,
        false
      );
    }
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
    unsubscribeStateChange();
  };
}

function createApplyFormatAsset(
  instance: CreativeEditorSDK
): (asset: AssetResult) => Promise<number | undefined> {
  return async (asset) => {
    const engine = instance.engine;
    const page = engine.scene.getCurrentPage()!;
    // Set fill mode to cover:
    engine.block.setContentFillMode(page, 'Cover');
    // Select it:
    let newDesignUnit: DesignUnit | null = null;
    let newWidth: number | null = null;
    let newHeight: number | null = null;
    // reset temp size in metadata
    setTempSizeInMetadata(engine, page, null);
    if (asset.id === 'page-sizes-custom') {
      // Reset Page Size to original:
      setCropConstraintMetadata(engine, 'none');
      const originalSize = getOriginalSize(engine);
      newWidth = originalSize.width;
      newHeight = originalSize.height;
      newDesignUnit = originalSize.designUnit;
    } else if (asset.meta!.fixedResolution === 'true') {
      if (!asset.meta?.formatWidth || !asset.meta?.formatHeight) {
        console.error(
          'Asset is missing properties meta.formatWidth or meta.formatHeight'
        );
        return;
      }
      newWidth = parseInt(asset.meta.formatWidth as string, 10);
      newHeight = parseInt(asset.meta.formatHeight as string, 10);
      newDesignUnit = asset.meta.designUnit as DesignUnit;
      setCropConstraintMetadata(engine, 'resolution');
    } else if (asset.meta?.aspectRatio) {
      const aspectRatio = asset.meta.aspectRatio as string;
      const [width, height] = aspectRatio.split(':').map(Number);
      // adjust size to match aspect ratio
      const { width: originalWidth, height: originalHeight } =
        getOriginalSize(engine);
      const originalAspectRatio = originalWidth / originalHeight;
      const newAspectRatio = width / height;
      if (originalAspectRatio > newAspectRatio) {
        newWidth = originalHeight * newAspectRatio;
        newHeight = originalHeight;
      } else {
        newWidth = originalWidth;
        newHeight = originalWidth / newAspectRatio;
      }
      setCropConstraintMetadata(engine, 'aspect-ratio');
    }
    if (newDesignUnit) {
      engine.scene.setDesignUnit(newDesignUnit);
    }
    if (newWidth && newHeight) {
      engine.block.resizeContentAware([page], newWidth, newHeight);
    }
    // enter crop:
    engine.editor.setEditMode('Crop');
    return page;
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
}

const ALL_CROP_CONSTRAINTS = ['none', 'aspect-ratio', 'resolution'] as const;
type CropConstraint = (typeof ALL_CROP_CONSTRAINTS)[number];
// We use custom metadata to store the currently active crop constraints
export function setCropConstraintMetadata(
  engine: CreativeEngine,
  constraint: CropConstraint = 'none'
) {
  const page = engine.scene.getCurrentPage()!;
  if (constraint === 'none') {
    engine.block.setMetadata(page, 'cropConstraint', 'none');
  } else if (constraint === 'aspect-ratio') {
    engine.block.setMetadata(page, 'cropConstraint', 'aspect-ratio');
  } else if (constraint === 'resolution') {
    engine.block.setMetadata(page, 'cropConstraint', 'resolution');
  }
}
export function getCropConstraintMetadata(
  engine: CreativeEngine
): CropConstraint {
  const page = engine.scene.getCurrentPage();
  if (!page || !engine.block.findAllMetadata(page).includes('cropConstraint')) {
    return 'none';
  }
  return engine.block.getMetadata(page, 'cropConstraint') as CropConstraint;
}
export function getOriginalSize(engine: CreativeEngine): {
  width: number;
  height: number;
  designUnit: DesignUnit;
} {
  const page = engine.scene.getCurrentPage()!;
  const fill = engine.block.getFill(page);
  const sourceSet = engine.block.getSourceSet(fill, 'fill/image/sourceSet');
  const imageSource = sourceSet[0];
  return {
    width: imageSource.width,
    height: imageSource.height,
    designUnit: 'Pixel'
  };
}
