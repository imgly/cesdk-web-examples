import { memo, useState, useCallback } from 'react';
import classes from './GeneratedAssetsSection.module.css';
import DownloadIcon from '../icons/Download.svg';
import EditIcon from '../icons/Edit.svg';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import EditInstanceCESDK from '../components/EditInstanceCESDK';

export interface GeneratedAsset {
  id: number;
  label: string;
  isLoading: boolean;
  width: number;
  height: number;
  src: string | null;
  type?: string;
  sceneString?: string | null;
}

interface GeneratedAssetsSectionProps {
  assets: GeneratedAsset[];
  onAssetUpdate: (assetId: number, sceneString: string, url: string) => void;
}

const GeneratedAssetsSection = memo(
  ({ assets, onAssetUpdate }: GeneratedAssetsSectionProps) => {
    const [assetToEdit, setAssetToEdit] = useState<GeneratedAsset | null>();
    const [editPanelOpen, setEditPanelOpen] = useState(false);

    const onEditClicked = useCallback((asset: GeneratedAsset) => {
      setAssetToEdit(asset);
      setEditPanelOpen(true);
    }, []);

    return (
      <>
        <div className={classes.sectionHeaderWrapper}>
          <h4 className={'h3'}>Generated Assets</h4>
          <button
            className={'button button--primary button--small'}
            onClick={() => downloadAssets(assets)}
            disabled={assets.some((asset) => asset.isLoading)}
          >
            <DownloadIcon /> <span>Download All Assets</span>
          </button>
        </div>
        <div
          className={classes.assetsWrapper}
          style={{ height: assets.length < 1 ? '558.66px' : 'auto' }}
        >
          {/* Sort the indexes to show the generated assets in the correct order */}
          {assets
            .sort((a, b) => a.id - b.id)
            .map((asset, index) => (
              <div className={classes.assetWrapper} key={index}>
                {asset.isLoading ? (
                  <div
                    className={classes.loadingSpinnerWrapper}
                    style={{ aspectRatio: asset.width / asset.height }}
                  >
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div
                    className={classes.assetPreviewWrapper}
                    key={asset.label}
                    style={{ aspectRatio: asset.width / asset.height }}
                  >
                    {asset.type === 'image' ? (
                      <img
                        className={classes.assetPreview}
                        data-cy={!asset.isLoading ? 'export-image' : ''}
                        key={asset.src}
                        src={asset.src as string}
                        style={{
                          ...(asset.isLoading
                            ? { opacity: 0.0 }
                            : { opacity: 1 }),
                          transition: 'opacity .5s',
                          transitionTimingFunction: 'ease-in-out'
                        }}
                        alt=""
                      />
                    ) : (
                      <video
                        className={classes.assetPreview}
                        data-cy={!asset.isLoading ? 'export-image' : ''}
                        src={asset.src as string}
                        style={{
                          ...(asset.isLoading
                            ? { opacity: 0.0 }
                            : { opacity: 1 }),
                          transition: 'opacity .5s',
                          transitionTimingFunction: 'ease-in-out'
                        }}
                        autoPlay
                        loop
                        muted
                      />
                    )}
                    <div
                      className={classes.overlay}
                      style={{
                        visibility: assets.some((asset) => asset.isLoading)
                          ? 'hidden'
                          : 'visible'
                      }}
                    >
                      <button
                        onClick={() => onEditClicked(asset)}
                        className={classes.editButton}
                        disabled={asset.isLoading}
                      >
                        <EditIcon />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className={classes.assetDescription}>
                  <div>
                    <p className={classes.bold}>{asset.label}</p>
                    <p>{`${asset.width} × ${asset.height} px`}</p>
                  </div>
                  <button
                    onClick={() => downloadAsset(asset)}
                    className={'button button--secondary button--small'}
                    disabled={asset.isLoading}
                  >
                    <DownloadIcon />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
        {editPanelOpen && assetToEdit && (
          <EditInstanceCESDK
            asset={assetToEdit}
            onSave={async (assetId, sceneString, url) => {
              onAssetUpdate(assetId, sceneString, url);
              setEditPanelOpen(false);
            }}
            onClose={() => setEditPanelOpen(false)}
          />
        )}
      </>
    );
  }
);

function downloadAssets(assets: GeneratedAsset[]) {
  assets.forEach((asset) => {
    downloadAsset(asset);
  });
}

function downloadAsset(asset: GeneratedAsset) {
  const link = document.createElement('a');
  link.href = asset.src as string;
  link.download = `${asset.label}.${asset.type === 'image' ? 'png' : 'mp4'}`;
  link.click();
}

GeneratedAssetsSection.displayName = 'GeneratedAssetsSection';

export default GeneratedAssetsSection;
