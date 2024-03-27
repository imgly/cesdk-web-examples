import classNames from 'classnames';
import React from 'react';
import EditIcon from '../../icons/Edit.svg';
import classes from './TemplateEditButton.module.css';

const TemplateEditButton = ({ template, onClick }) => {
  return (
    <div className={classes.wrapper}>
      <img
        className={classes.image}
        src={template.previewImagePath}
        alt={`Template with name ${template.label}`}
      />
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
    </div>
  );
};

export default TemplateEditButton;
