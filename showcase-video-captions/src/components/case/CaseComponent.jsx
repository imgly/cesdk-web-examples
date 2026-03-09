'use client';

import classNames from 'classnames';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import CreativeEditor from './CreativeEditor';
import { caseAssetPath } from './util';

const CaseComponent = () => {
  const [editorOption, setEditorOption] = useState(null);

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.block}>
          <div>
            <h4 className={classNames('h4', classes.h4)}>
              Select Your Demo Option
            </h4>
          </div>
          <div className={classes.comparisonWrapper}>
            {/* AI Auto Captions */}
            <div className={classes.card}>
              <img
                alt="AI Auto Captions Preview"
                src={caseAssetPath('/autocaption-preview.png')}
                className={classes.comparisonImage}
              />
              <div className={classes.cardText}>
                <h5 className={classNames('h5', classes.h5)}>
                  AI Auto Captions
                </h5>
                <div className={classes.previewText}>
                  Generate Captions with our AI Auto Caption Plugin
                </div>
              </div>
              <div className={classes.actions}>
                <button
                  className={'button button--primary button--small'}
                  onClick={() => setEditorOption('autocaption')}
                >
                  <span>Open Editor</span>
                </button>
              </div>
            </div>

            {/* Blank Video Editor */}
            <div className={classes.card}>
              <img
                alt="Blank Video Editor Preview"
                src={caseAssetPath('/blank-preview.png')}
                className={classes.comparisonImage}
              />
              <div className={classes.cardText}>
                <h5 className={classNames('h5', classes.h5)}>
                  Blank Video Editor
                </h5>
                <div className={classes.previewText}>
                  Upload or create a video, then manually add or import
                  captions.
                </div>
              </div>
              <div className={classes.actions}>
                <button
                  className={'button button--primary button--small'}
                  onClick={() => setEditorOption('blank')}
                >
                  <span>Open Editor</span>
                </button>
              </div>
            </div>

            {/* Caption Import */}
            <div className={classes.card}>
              <img
                alt="Caption Import Preview"
                src={caseAssetPath('/import-preview.png')}
                className={classes.comparisonImage}
              />
              <div className={classes.cardText}>
                <h5 className={classNames('h5', classes.h5)}>Caption Import</h5>
                <div className={classes.previewText}>
                  Import our{' '}
                  <a
                    className={classes.link}
                    href={caseAssetPath('/captions.srt')}
                    download
                  >
                    example .srt file
                  </a>{' '}
                  from the download link below.
                </div>
              </div>
              <div className={classes.actions}>
                <div className={classes.buttons}>
                  <button
                    className={'button button--secondary button--small'}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = caseAssetPath('/captions.srt');
                      link.download = 'captions.srt';
                      link.click();
                    }}
                  >
                    Download .srt File
                  </button>
                  <button
                    className={'button button--primary button--small'}
                    onClick={() => setEditorOption('import')}
                  >
                    <span>Open Editor</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pre-captioned Video */}
            <div className={classes.card}>
              <img
                alt="Pre-captioned Video Preview"
                src={caseAssetPath('/pre-captioned-preview.png')}
                className={classes.comparisonImage}
              />
              <div className={classes.cardText}>
                <h5 className={classNames('h5', classes.h5)}>
                  Pre-captioned Video
                </h5>
                <div className={classes.previewText}>
                  Edit a video with existing captions and adjust as needed.
                </div>
              </div>
              <div className={classes.actions}>
                <button
                  className={'button button--primary button--small'}
                  onClick={() => setEditorOption('pre-captioned')}
                >
                  <span>Open Editor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editorOption && (
        <CreativeEditor
          option={editorOption}
          closeEditor={() => {
            setEditorOption(null);
          }}
        />
      )}
    </>
  );
};
export default CaseComponent;
