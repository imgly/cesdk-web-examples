'use client';

import { Fragment, useCallback, useState } from 'react';
import classes from './CaseComponent.module.css';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor,
  useCreativeEditorRef
} from './lib/CreativeEditor';

const caseAssetPath = (path, caseId = 'version-history') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

function loadSnapshots() {
  return [
    {
      thumbnailUrl: caseAssetPath('/snapshots/1/thumbnail.png'),
      sceneUrl: caseAssetPath('/snapshots/1/scene.scene'),
      createdAt: '2023-11-30T08:00:00.000Z',
      userName: 'Patrick S.'
    },
    {
      thumbnailUrl: caseAssetPath('/snapshots/2/thumbnail.png'),
      sceneUrl: caseAssetPath('/snapshots/2/scene.scene'),
      createdAt: '2023-11-29T14:00:00.000Z',
      userName: 'Dustin K.'
    },
    {
      thumbnailUrl: caseAssetPath('/snapshots/3/thumbnail.png'),
      sceneUrl: caseAssetPath('/snapshots/3/scene.scene'),
      createdAt: '2023-11-28T12:00:00.000Z',
      userName: 'Marius W.'
    }
  ];
}
async function createThumbnail(cesdk) {
  const engine = cesdk.engine;
  const scene = engine.scene.get();
  return engine.block.export(scene, {
    mimeType: 'image/jpeg',
    targetWidth: 168,
    targetHeight: 168
  });
}

async function createLocalThumbnailUrl(cesdk) {
  const thumbnail = await createThumbnail(cesdk);
  const blob = new Blob([thumbnail], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  return url;
}
async function createLocalSceneUrl(sceneString) {
  const blob = new Blob([sceneString], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  return url;
}

const VersionHistoryCESDK = () => {
  const [snapshots, setSnapshots] = useState(loadSnapshots());
  const cesdkRef = useCreativeEditorRef(null);
  const [cesdk, setCesdk] = useCreativeEditor();

  const loadSnapshot = useCallback(
    async (snapshot) => {
      if (!cesdk) {
        return;
      }
      await cesdk.loadFromURL(snapshot.sceneUrl);
      const page = cesdk.engine.scene.getPages()[0];
      cesdk.engine.scene.enableZoomAutoFit(
        page,
        'Both',
        20.0,
        20.0,
        20.0,
        20.0
      );
    },
    [cesdk]
  );

  const config = useConfig(
    () => ({
      role: 'Creator',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local',
        onSave: async (scene) => {
          const thumbnailUrl = await createLocalThumbnailUrl(cesdkRef.current);
          const sceneUrl = await createLocalSceneUrl(scene);
          const snapshot = {
            thumbnailUrl,
            sceneUrl,
            createdAt: new Date().toISOString(),
            userName: 'Anonymous'
          };
          setSnapshots((snapshots) => [snapshot, ...snapshots]);
        }
      },
      ui: {
        elements: {
          navigation: {
            action: {
              save: true
            }
          }
        }
      }
    }),
    []
  );

  const configure = useConfigure(async (instance) => {
    
    instance.i18n.setTranslations({
      en: {
        'common.save': 'Save Snapshot'
      }
    });

    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    instance.ui.setDockOrder([
      ...instance.ui
        .getDockOrder()
        .filter(({ key }) => key !== 'ly.img.template')
    ]);
    await instance.loadFromURL(caseAssetPath('/snapshots/1/scene.scene'));
  }, []);

  const instanceChangeHandler = useCallback(
    (instance) => {
      cesdkRef.current = instance;
      setCesdk(instance);
    },
    [cesdkRef, setCesdk]
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.cesdkWrapper}>
        <CreativeEditor
          className={classes.cesdk}
          config={config}
          configure={configure}
          onInstanceChange={instanceChangeHandler}
        />
      </div>
      <div className={classes.sidebar}>
        <div className={classes.sidebarHeader}>
          <h2 className={classes.sidebarHeadline}>History</h2>
          <span className="paragraphSmall">{snapshots.length} Snapshots</span>
        </div>
        <div className={classes.snapshotList}>
          {snapshots.map((snapshot, i) => (
            <Fragment key={snapshot.createdAt}>
              <button
                className={classes.snapshotItem}
                onClick={async () => {
                  loadSnapshot(snapshot);
                }}
              >
                <img
                  alt="Snapshot"
                  src={snapshot.thumbnailUrl}
                  className={classes.snapshotItemImage}
                />
                <div className={classes.snapshotItemInfo}>
                  <span className={classes.snapshotItemDate}>
                    {snapshot.userName}
                  </span>
                  <span className="paragraphSmall">
                    {formatDate(new Date(snapshot.createdAt))}
                  </span>
                </div>
                <span className={classes.snapshotItemButton}>Load</span>
              </button>
              {i !== snapshots.length - 1 && (
                <hr className={classes.snapshotDivider} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// returns date in format November 27th 3:28 pm
function formatDate(date) {
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const hour = date.getHours();
  const amPm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  const hour12String = hour12.toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return (
    <>
      {month}&nbsp;{day}
      {getOrdinal(day)}
      <br />
      {hour12String}:{minute}&nbsp;{amPm}
    </>
  );
}
function getOrdinal(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export default VersionHistoryCESDK;
