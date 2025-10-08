'use client';

import classNames from 'classnames';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import { SegmentedControl } from './components/SegmentedControl';
import CreativeEditor from './components/CreativeEditor';

const CaseComponent = () => {
  const [selectedImage, setSelectedImage] = useState(IMAGE_URLS[0]);
  const [selectedCropPreset, setSelectedCropPreset] = useState(CROP_PRESETS[0]);
  const [selectedCropMode, setSelectedCropMode] = useState(CROP_MODES[0]);
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.optionsWrapper}>
          {/* Select Image */}
          <div className={classes.optionWrapper}>
            <h5 className={classNames('h5', classes.h5)}>Select Image</h5>
            <div className={classes.imagesWrapper}>
              {IMAGE_URLS.map((image, index) => (
                <button
                  onClick={() => setSelectedImage(image)}
                  className={classes.imageButton}
                  key={image.full}
                  data-cy={`image-${index}`}
                >
                  <img
                    src={image.thumb}
                    className={classNames(classes.image, {
                      [classes.selected]: selectedImage === image
                    })}
                    alt={image.alt}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Select Crop Preset */}
          <div className={classes.optionWrapper}>
            <h5 className={classNames('h5', classes.h5)}>Select Crop Preset</h5>
            <div className={classes.presetsWrapper}>
              {CROP_PRESETS.map((preset) => (
                <div className={classes.presetWrapper} key={preset.id}>
                  <button
                    className={classNames(classes.presetButton, {
                      [classes.selected]: selectedCropPreset === preset
                    })}
                    onClick={() => setSelectedCropPreset(preset)}
                    data-cy={`crop-preset-${preset.label.en}`}
                  >
                    <div
                      className={classes.presetLogoWrapper}
                      style={{
                        aspectRatio:
                          preset.payload.transformPreset.width /
                          preset.payload.transformPreset.height,
                        width:
                          preset.payload.transformPreset.height >
                          preset.payload.transformPreset.width
                            ? 'auto'
                            : preset.payload.transformPreset.height <
                                preset.payload.transformPreset.width
                              ? '100%'
                              : '42.222px',
                        height:
                          preset.payload.transformPreset.height >
                          preset.payload.transformPreset.width
                            ? '100%'
                            : preset.payload.transformPreset.height <
                                preset.payload.transformPreset.width
                              ? 'auto'
                              : '42.222px'
                      }}
                    >
                      <img
                        src={preset.meta.icon}
                        className={classes.presetLogo}
                        alt={preset.meta.thumbAlt}
                      />
                    </div>
                  </button>
                  <div className={classes.presetContent}>
                    <span
                      className={classNames(classes.presetLabel, {
                        [classes.selectedLabel]: selectedCropPreset === preset
                      })}
                    >
                      {preset.label.en}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Select Mode */}
          <div className={classes.optionWrapper}>
            <h5 className={classNames('h5', classes.h5)}>Select Mode</h5>
            <div className={classes.segmentedControl}>
              <SegmentedControl
                options={CROP_MODES}
                onChange={(value) => setSelectedCropMode(value)}
                value={selectedCropMode}
              />
            </div>
            <p className={classes.modeDescription}>
              {selectedCropMode.description}
            </p>
          </div>
          <button
            className="button button--primary"
            onClick={() => {
              setEditorOpen(true);
            }}
            data-cy="applyButton"
          >
            <span>Open Editor</span>
          </button>
        </div>
      </div>
      {editorOpen && (
        <CreativeEditor
          preset={selectedCropPreset}
          cropMode={selectedCropMode}
          image={selectedImage}
          closeEditor={() => {
            setEditorOpen(false);
          }}
        />
      )}
    </>
  );
};

const caseAssetPath = (path, caseId = 'force-crop') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;
const IMAGE_URLS = [
  {
    full: caseAssetPath('/image-1.png'),
    thumb: caseAssetPath('/image-1.png'),
    width: 800,
    height: 1200,
    alt: 'man'
  },
  {
    full: caseAssetPath('/image-2.png'),
    thumb: caseAssetPath('/image-2.png'),
    width: 1200,
    height: 800,
    alt: 'mountain'
  },
  {
    full: caseAssetPath('/image-3.png'),
    thumb: caseAssetPath('/image-3.png'),
    width: 1200,
    height: 1200,
    alt: 'bowl'
  }
];

const CROP_PRESETS = [
  {
    id: 'custom-portrait-post',
    label: {
      en: 'Portrait Post (4:5)'
    },
    meta: {
      thumbUri: caseAssetPath('/thumb-instagram.png'),
      icon: caseAssetPath('/logo-instagram.svg'),
      thumbAlt: 'Instagram Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 4,
        height: 5,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-profile-photo',
    label: {
      en: 'Profile Photo (1:1)'
    },
    meta: {
      thumbUri: caseAssetPath('/thumb-linkedin.png'),
      icon: caseAssetPath('/logo-linkedin.svg'),
      thumbAlt: 'LinkedIn Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-shared-image',
    label: {
      en: 'Shared Image (1.91:1)'
    },
    meta: {
      thumbUri: caseAssetPath('/thumb-facebook.png'),
      icon: caseAssetPath('/logo-facebook.svg'),
      thumbAlt: 'Facebook Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1.91,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  }
];

const CROP_MODES = [
  {
    id: 'always',
    label: 'Always',
    description: 'This mode opens the Crop Mode always.'
  },
  {
    id: 'ifNeeded',
    label: 'If Needed',
    description:
      'This mode opens the Crop Mode only if the media does not match the required size or aspect ratio.'
  },
  {
    id: 'silent',
    label: 'Silent',
    description: 'This mode applies cropping without showing Crop Mode.'
  }
];

export default CaseComponent;
