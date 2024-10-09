import { CreativeEngine, DesignUnit } from '@cesdk/cesdk-js';
import {
  getCropConstraintMetadata,
  getOriginalSize
} from './PhotoEditorUIConfig';

const TEMP_SIZE_METADATA_WIDTH_KEY = 'tempWidth';
const TEMP_SIZE_METADATA_HEIGHT_KEY = 'tempHeight';
export function setTempSizeInMetadata(
  engine: CreativeEngine,
  pageId: number,
  newValue: { width: number; height: number } | null = null
) {
  if (!newValue) {
    if (getValuesFromMetadata(engine, pageId) !== null) {
      engine.block.removeMetadata(pageId, TEMP_SIZE_METADATA_WIDTH_KEY);
      engine.block.removeMetadata(pageId, TEMP_SIZE_METADATA_HEIGHT_KEY);
    }
    return;
  }
  const { width, height } = newValue;
  engine.block.setMetadata(
    pageId,
    TEMP_SIZE_METADATA_WIDTH_KEY,
    width.toString()
  );
  engine.block.setMetadata(
    pageId,
    TEMP_SIZE_METADATA_HEIGHT_KEY,
    height.toString()
  );
}
function getValuesFromMetadata(engine: CreativeEngine, pageId: number) {
  if (
    !engine.block.hasMetadata(pageId, TEMP_SIZE_METADATA_WIDTH_KEY) ||
    !engine.block.hasMetadata(pageId, TEMP_SIZE_METADATA_HEIGHT_KEY)
  ) {
    return null;
  }
  return {
    width: parseFloat(
      engine.block.getMetadata(pageId, TEMP_SIZE_METADATA_WIDTH_KEY)
    ),
    height: parseFloat(
      engine.block.getMetadata(pageId, TEMP_SIZE_METADATA_HEIGHT_KEY)
    )
  };
}

const PageCropPanel = ({
  builder,
  engine
}: {
  builder: any;
  engine: CreativeEngine;
  ui: any;
}) => {
  const { Section, NumberInput, Library, Button } = builder;

  let pageId = engine.scene.getCurrentPage()!;
  if (!pageId) return;

  const realSize = {
    width: engine.block.getWidth(pageId),
    height: engine.block.getHeight(pageId)
  };
  const tempSize = getValuesFromMetadata(engine, pageId) ?? realSize;
  const valueHasChanged =
    tempSize.width !== realSize.width || tempSize.height !== realSize.height;

  const cropConstraint = getCropConstraintMetadata(engine);
  const designUnit = engine.scene.getDesignUnit();
  const shortDesignUnit = shortenDesignUnit(designUnit);
  const currentAspectRatio = realSize.width / realSize.height;
  Section('dimensions', {
    title: `Dimensions`,
    children: () => {
      NumberInput('width', {
        label: `Width (${shortDesignUnit})`,
        value: tempSize.width,
        isDisabled: cropConstraint === 'resolution',
        setValue: (value: number) => {
          if (cropConstraint === 'aspect-ratio') {
            setTempSizeInMetadata(engine, pageId, {
              width: value,
              height: value / currentAspectRatio
            });
          } else {
            setTempSizeInMetadata(engine, pageId, {
              width: value,
              height: tempSize.height
            });
          }
        }
      });

      NumberInput('height', {
        label: `Height (${shortDesignUnit})`,
        value: tempSize.height,
        isDisabled: cropConstraint === 'resolution',
        setValue: (value: number) => {
          if (cropConstraint === 'aspect-ratio') {
            setTempSizeInMetadata(engine, pageId, {
              width: value * currentAspectRatio,
              height: value
            });
          } else {
            setTempSizeInMetadata(engine, pageId, {
              width: tempSize.width,
              height: value
            });
          }
        }
      });

      Button('apply', {
        isDisabled: !valueHasChanged,
        label: 'Apply',
        // onClick we want to change the page size and remove temp values
        onClick: () => {
          const originalSize = getOriginalSize(engine);
          if (tempSize.width <= 0 || tempSize.height <= 0) {
            return;
          }
          if (
            tempSize.width > originalSize.width ||
            tempSize.height > originalSize.height
          ) {
            return;
          }
          engine.block.setWidth(pageId, tempSize.width);
          engine.block.setHeight(pageId, tempSize.height);
          // reset to crop mode to cover because the cropped area is distorted. This is a workaround until the bug is fixed:
          engine.block.setContentFillMode(pageId, 'Cover');

          setTempSizeInMetadata(engine, pageId, null);
        }
      });
    }
  });

  Section('size-presets', {
    title: 'Size Presets',
    children: () => {
      Library('preset-library', {
        entries: [
          {
            id: 'ly.img.formats',
            sourceIds: ['ly.img.formats'],
            previewLength: 3,
            gridColumns: 3,
            gridItemHeight: 'auto',
            previewBackgroundType: 'contain',
            gridBackgroundType: 'cover',
            cardLabel: (assetResult: any) => assetResult.label,
            cardLabelPosition: () => 'bottom',
            showGroupOverview: false
          }
        ]
      });
    }
  });
};

function shortenDesignUnit(designUnit: DesignUnit) {
  // "Pixel" | "Millimeter" | "Inch"
  switch (designUnit) {
    case 'Millimeter':
      return 'mm';
    case 'Inch':
      return 'in';
    default:
      return 'px';
  }
}

export default PageCropPanel;
