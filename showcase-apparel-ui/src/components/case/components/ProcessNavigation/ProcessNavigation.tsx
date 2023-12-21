import { useEditor } from '../../EditorContext';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import classes from './ProcessNavigation.module.css';

interface ProcessNavigationProps {
  disabled?: boolean;
}

const ProcessNavigation = ({ disabled }: ProcessNavigationProps) => {
  const { currentStep, setCurrentStep } = useEditor();
  return (
    <nav className={classes.wrapper}>
      <SegmentedControl
        options={[
          { label: 'Edit', value: 'edit' },
          { label: 'Preview', value: 'preview' }
        ]}
        value={currentStep}
        name="currentStep"
        onChange={(value) => setCurrentStep(value as typeof currentStep)}
        size="sm"
        buttonStyle={{ minWidth: '75px' }}
        label={''}
      />
    </nav>
  );
};
export default ProcessNavigation;
