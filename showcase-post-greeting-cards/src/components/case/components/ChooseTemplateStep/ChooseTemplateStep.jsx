import { useEditor } from '../../EditorContext';
import POSTCARD_TEMPLATES from '../../PostcardTemplates.json';
import { caseAssetPath } from '../../util';
import classes from './ChooseTemplateStep.module.css';

const ChooseTemplateStep = () => {
  const { setCurrentStep, setPostcardTemplateId } = useEditor();

  return (
    <div className={classes.outerWrapper}>
      <div className={classes.wrapper}>
        {Object.entries(POSTCARD_TEMPLATES).map(([id, template]) => (
          <button
            key={id}
            className={classes.button}
            onClick={async () => {
              setPostcardTemplateId(id);
              setCurrentStep('Design');
            }}
            data-cy={`choose-${id}-template`}
          >
            <img
              alt={`Choose ${template.name} Template`}
              src={caseAssetPath(template.preview)}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
export default ChooseTemplateStep;
