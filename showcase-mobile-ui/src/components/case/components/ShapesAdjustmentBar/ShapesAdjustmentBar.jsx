import { useMemo, useState } from 'react';
import { caseAssetPath } from '../../util';
import ChangeShapeColorSecondary from '../ChangeShapeColorSecondary/ChangeShapeColorSecondary';

import ShapeColorIcon from '../ShapeColorIcon/ShapeColorIcon';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';
import InspectorBar from '../InspectorBar/InspectorBar';

export const ALL_IMAGES = [
  caseAssetPath('/images/image2.svg'),
  caseAssetPath('/images/image1.svg'),
  caseAssetPath('/images/image4.svg'),
  caseAssetPath('/images/image3.svg')
];

const ALL_ADJUSTMENTS = [
  {
    Body: ChangeShapeColorSecondary,
    Icon: ShapeColorIcon,
    id: 'color'
  }
];
const ShapesAdjustmentBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState();

  const selectedAdjustment = useMemo(
    () => ALL_ADJUSTMENTS.find(({ id }) => selectedAdjustmentId === id),
    [selectedAdjustmentId]
  );

  const AdjustmentComponent = useMemo(() => {
    if (selectedAdjustment) {
      return selectedAdjustment.Body;
    }
  }, [selectedAdjustment]);

  return (
    <SlideUpPanel
      defaultHeadline={'Shape'}
      isExpanded={!!selectedAdjustmentId}
      onExpandedChanged={(value) => !value && setSelectedAdjustmentId()}
      InspectorBar={
        <InspectorBar
          activeAdjustmentId={selectedAdjustmentId}
          onAdjustmentChange={(newAdjustmentId) =>
            setSelectedAdjustmentId(newAdjustmentId)
          }
          adjustments={ALL_ADJUSTMENTS}
        />
      }
    >
      {AdjustmentComponent && <AdjustmentComponent />}
    </SlideUpPanel>
  );
};
export default ShapesAdjustmentBar;
