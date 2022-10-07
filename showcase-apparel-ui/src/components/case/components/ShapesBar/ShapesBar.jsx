import { ReactComponent as LineIcon } from '../../icons/shapes/line.svg';
import { ReactComponent as PolygonIcon } from '../../icons/shapes/polygon.svg';
import { ReactComponent as RectIcon } from '../../icons/shapes/rect.svg';
import { ReactComponent as StarIcon } from '../../icons/shapes/star.svg';

import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import IconButton from '../IconButton/IconButton';

export const ALL_SHAPES = [
  { type: 'shapes/rect', label: 'Rectangle', icon: <RectIcon /> },
  { type: 'shapes/line', label: 'Line', icon: <LineIcon /> },
  { type: 'shapes/star', label: 'Star', icon: <StarIcon /> },
  { type: 'shapes/polygon', label: 'Polygon', icon: <PolygonIcon /> }
];

const ShapesBar = ({ onClick }) => {
  return (
    <AdjustmentsBar gap="sm">
      {ALL_SHAPES.map(({ type, icon }) => (
        <IconButton
          key={type}
          onClick={() => onClick(type)}
          icon={icon}
        ></IconButton>
      ))}
    </AdjustmentsBar>
  );
};
export default ShapesBar;
