import React from 'react';
import classes from './TemplateSelectButton.module.css';

const TemplateSelectButton = ({ template, onClick }) => {
  return (
    <button className={classes.button} onClick={onClick}>
      <img
        className={classes.image}
        src={template.previewImagePath}
        alt={`Template with name ${template.name}`}
      />
    </button>
  );
};

export default TemplateSelectButton;
