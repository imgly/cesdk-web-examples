import React from 'react';
import classes from './TemplateSelectButton.module.css';

const TemplateSelectButton = ({ template, onClick }) => {
  return (
    <button className={classes.wrapper} onClick={onClick}>
      <img
        className={classes.image}
        src={template.previewImagePath}
        alt={`Template with name ${template.label}`}
      />
    </button>
  );
};

export default TemplateSelectButton;
