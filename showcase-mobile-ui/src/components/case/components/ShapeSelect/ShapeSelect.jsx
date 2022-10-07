import { ReactComponent as LineIcon } from '../../icons/shapes/line.svg';
import { ReactComponent as PolygonIcon } from '../../icons/shapes/polygon.svg';
import { ReactComponent as RectIcon } from '../../icons/shapes/rect.svg';
import { ReactComponent as StarIcon } from '../../icons/shapes/star.svg';
import { ReactComponent as BadgeIcon } from '../../icons/shapes/badge.svg';
import { ReactComponent as EllipseIcon } from '../../icons/shapes/ellipse.svg';

import classes from './ShapeSelect.module.css';

import IconButton from '../IconButton/IconButton';

export const ALL_SHAPES = [
  { type: 'shapes/rect', label: 'Rectangle', icon: <RectIcon /> },
  { type: 'shapes/line', label: 'Line', icon: <LineIcon /> },
  { type: 'shapes/star', label: 'Star', icon: <StarIcon /> },
  { type: 'shapes/polygon', label: 'Polygon', icon: <PolygonIcon /> },
  { type: 'shapes/ellipse', label: 'Ellipse', icon: <EllipseIcon /> },
  {
    type: 'vector_path',
    label: 'Badge',
    icon: <BadgeIcon />,
    properties: {
      'vector_path/path':
        'M 49.92,6.494 L54.29,0 57.46,7.147 62.89,1.521 64.77,9.107 71.1,4.505 71.63,12.3 78.66,8.873 77.83,16.65 85.35,14.49 83.19,22.01 90.97,21.18 87.54,28.21 95.34,28.74 90.73,35.07 98.32,36.95 92.69,42.38 99.84,45.55 93.35,49.92 99.84,54.29 92.69,57.46 98.32,62.89 90.73,64.77 95.34,71.1 87.54,71.63 90.97,78.66 83.19,77.83 85.35,85.35 77.83,83.19 78.66,90.97 71.63,87.54 71.1,95.34 64.77,90.73 62.89,98.32 57.46,92.69 54.29,99.84 49.92,93.35 45.55,99.84 42.38,92.69 36.95,98.32 35.07,90.73 28.74,95.34 28.21,87.54 21.18,90.97 22.01,83.19 14.49,85.35 16.65,77.83 8.873,78.66 12.3,71.63 4.505,71.1 9.107,64.77 1.521,62.89 7.147,57.46 0,54.29 6.494,49.92 0,45.55 7.147,42.38 1.521,36.95 9.107,35.07 4.505,28.74 12.3,28.21 8.873,21.18 16.65,22.01 14.49,14.49 22.01,16.65 21.18,8.873 28.21,12.3 28.74,4.505 35.07,9.107 36.95,1.521 42.38,7.147 45.55,0z'
    }
  }
];

const ShapeSelect = ({ onClick }) => {
  return (
    <div className={classes.wrapper}>
      {ALL_SHAPES.map(({ type, properties, icon }) => (
        <IconButton
          key={type}
          onClick={() => onClick({ type, properties })}
          icon={icon}
        ></IconButton>
      ))}
    </div>
  );
};
export default ShapeSelect;
