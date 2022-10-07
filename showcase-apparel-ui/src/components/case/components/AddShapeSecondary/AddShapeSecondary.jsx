import { useEditor } from '../../EditorContext';

import ShapesBar from '../ShapesBar/ShapesBar';

const AddShapeSecondary = () => {
  const {
    customEngine: { addShape }
  } = useEditor();

  return <ShapesBar onClick={(type) => addShape(type)} />;
};
export default AddShapeSecondary;
