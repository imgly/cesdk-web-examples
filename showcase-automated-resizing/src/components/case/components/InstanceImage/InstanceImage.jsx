import classNames from 'classnames';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { ReactComponent as EditIcon } from '../../icons/Edit.svg';
import classes from './InstanceImage.module.css';

const InstanceImage = ({
  src,
  Icon,
  headline,
  subHeadline,
  isLoading,
  aspectRatio,
  onClick
}) => {
  const canEdit = !isLoading && src;
  return (
    <div className={classes.outerWrapper}>
      <div className={classes.header}>
        {Icon}
        <div className={classes.headerText}>
          <h4 className={'paragraphSmall--black'}>{headline}</h4>
          <span className={'paragraphSmall'}>{subHeadline}</span>
        </div>
      </div>
      <div
        className={classNames(classes.innerWrapper, {
          [classes['innerWrapper--empty']]: !src
        })}
        style={{
          aspectRatio
        }}
      >
        {src && (
          <img
            data-cy={!isLoading ? 'export-image' : ''}
            alt={headline}
            src={src}
            className={classNames(classes.image, {
              [classes['image--loading']]: isLoading
            })}
          />
        )}
        {isLoading && <LoadingSpinner />}
        {canEdit && (
          <div className={classes.editOverlay}>
            <button
              onClick={onClick}
              className={classNames(
                classes.editButton,
                'button button--small button--secondary'
              )}
            >
              <EditIcon />
              <span>Edit</span>
            </button>
          </div>
        )}
      </div>
      {src && (
        <div className={classes.footer}>
          <button
            className={classNames(
              'button button--small button--secondary-plain',
              classes.button
            )}
            onClick={() => {
              const a = document.createElement('a');
              a.href = src;
              a.download = `${headline}.png`;
              a.click();
            }}
          >
            <span>Download</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.17484 8.87963L3.6748 5.87963L4.32559 5.12037L7.00023 7.4129V2H8.00023L8.00023 7.41288L10.6748 5.12037L11.3256 5.87963L7.82563 8.87963C7.63838 9.04012 7.36208 9.04012 7.17484 8.87963Z"
                fill="currentColor"
              />
              <path
                opacity="0.75"
                d="M2.5 9V11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H11.5C12.0523 12.5 12.5 12.0523 12.5 11.5V9"
                stroke="currentColor"
                stroke-opacity="0.9"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default InstanceImage;
