import { CreativeEngine, MimeType } from '@cesdk/cesdk-js';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import classes from './ExportModal.module.css';
import { Label } from './components/Label/Label';
import { Resolution } from './components/Resolution/Resolution';
import { SectionDivider } from './components/SectionDivider/SectionDivider';
import { Select } from './components/Select/Select';
import { ReactComponent as DownloadIcon } from './icons/Download.svg';
import { ReactComponent as LoadingSpinnerIcon } from './icons/LoadingSpinner.svg';
import { localDownload } from './lib/localDownload';

interface Props {
  show: boolean;
  engine: CreativeEngine;
}

const ALL_RESOLUTIONS = {
  'SD (Standard Definition), 480p': {
    id: 'SD (Standard Definition), 480p',
    name: 'Standard Definition (SD)',
    description: '480p',
    value: {
      width: 640,
      height: 480
    }
  },
  'HD (High Definition), 720p': {
    id: 'HD (High Definition), 720p',
    name: 'High Definition (HD)',
    description: '720p',
    value: {
      width: 1280,
      height: 720
    }
  },
  'FHD (Full HD), 1080p': {
    id: 'FHD (Full HD), 1080p',
    name: 'Full HD (FHD)',
    description: '1080p',
    value: {
      width: 1920,
      height: 1080
    }
  },
  '2K (Quad HD), 1440p': {
    id: '2K (Quad HD), 1440p',
    name: 'Quad HD (2K)',
    description: '1440p',
    value: {
      width: 2560,
      height: 1440
    }
  },
  '4K (Ultra HD), 2160p': {
    id: '4K (Ultra HD), 2160p',
    name: 'Ultra HD (4K)',
    description: '2160p',
    value: {
      width: 3840,
      height: 2160
    }
  }
};

const getResolution = (engine: CreativeEngine) => {
  const page = engine.scene.getCurrentPage();
  if (!page) {
    return { width: 0, height: 0 };
  }
  const width = engine.block.getWidth(page);
  const height = engine.block.getHeight(page);
  return { width, height };
};

export const ExportModal: React.FC<Props> = ({ engine }) => {
  const [fps, setFps] = useState<number>(30);
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  }>(() => getResolution(engine));
  const fpsString = fps.toString();
  const [progress, setProgress] = useState(0);
  const handleVideoExport = useCallback(async () => {
    const page = engine.scene.getCurrentPage();
    if (!page) {
      return;
    }

    setProgress(0);
    const blob = await engine.block.exportVideo(
      page,
      MimeType.Mp4,
      (numberOfRenderedFrames, numberOfEncodedFrames, totalNumberOfFrames) => {
        setProgress(numberOfEncodedFrames / totalNumberOfFrames);
      },
      {
        targetWidth: resolution.width,
        targetHeight: resolution.height,
        framerate: fps
      }
    );
    await localDownload(blob, `my-video`);
    setProgress(0);
  }, [engine, resolution, fps]);

  return (
    <>
      <h4 className={classes.title}>Video Export Settings</h4>
      <div className={classes.body}>
        <div className={classNames('paragraphSmall', classes.subtitle)}>
          Videos are exported with H.264 Codec
        </div>
        <SectionDivider />
        <Label
          label="Frames per Second"
          className={classes.fps}
          infoText={
            'FPS determines video smoothness. Higher FPS is smoother, but affects file size and export time.'
          }
        >
          <Select
            name="fps"
            value={fpsString}
            options={[
              { label: '24 FPS', value: '24' },
              { label: '30 FPS', value: '30' },
              { label: '60 FPS', value: '60' },
              { label: '120 FPS', value: '120' }
            ]}
            onChange={(val) => setFps(Number(val))}
          />
        </Label>

        <SectionDivider />
        <Resolution
          className={classes.resolution}
          onChange={setResolution}
          value={resolution}
          resolutions={ALL_RESOLUTIONS}
        />
      </div>

      <div className={classes.footer}>
        <progress className={classes.progress} value={progress} max={1} />
        <div className={classes.buttons}>
          <button
            className={'button button--small button--primary '}
            type="button"
            onClick={() => {
              handleVideoExport();
            }}
            disabled={progress > 0 || resolution.width > 3840}
          >
            <span>Export</span>
            {progress === 0 ? <DownloadIcon /> : <LoadingSpinnerIcon />}
          </button>
        </div>
      </div>
    </>
  );
};
