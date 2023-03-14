import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useMemo, useRef } from 'react';
import { findAirtableAssets } from './airtableAssetLibrary';
import { findPexelsAssets } from './pexelsAssetLibrary';
import { findUnsplashAssets } from './unsplashAssetLibrary';

const availableAssetLibraries = {
  airtable: {
    id: 'Airtable',
    sceneFile: 'airtable.scene',
    DescriptionComponent: () => (
      <p>
        Search and browse images from an{' '}
        <a
          href={'https://airtable.com/'}
          style={linkStyle}
          target="_blank"
          rel="noreferrer"
        >
          Airtable
        </a>{' '}
        spreadsheet in the editor.
      </p>
    ),
    config: {
      findAssets: findAirtableAssets,
      credits: {
        name: 'Airtable',
        url: 'https://airtable.com/shr4x8s9jqaxiJxm5/tblSLR9GBwiVwFS8z?backgroundColor=orange'
      }
    }
  },
  unsplash: {
    id: 'Unsplash',
    sceneFile: 'unsplash.scene',
    title: 'Unsplash',
    DescriptionComponent: () => (
      <p>
        Search and browse images from{' '}
        <a
          href={'https://unsplash.com/'}
          style={linkStyle}
          target="_blank"
          rel="noreferrer"
        >
          Unsplash
        </a>{' '}
        in the editor.
      </p>
    ),
    config: {
      findAssets: findUnsplashAssets,
      credits: {
        name: 'Unsplash',
        url: 'https://unsplash.com/'
      },
      license: {
        name: 'Unsplash license (free)',
        url: 'https://unsplash.com/license'
      }
    }
  },
  pexels: {
    id: 'Pexels',
    sceneFile: 'pexels.scene',
    title: 'Pexels',
    DescriptionComponent: () => (
      <p>
        Search and browse images from{' '}
        <a
          href={'https://pexels.com/'}
          style={linkStyle}
          target="_blank"
          rel="noreferrer"
        >
          Pexels
        </a>{' '}
        in the editor.
      </p>
    ),
    config: {
      findAssets: findPexelsAssets,
      credits: {
        name: 'Pexels',
        url: 'https://pexels.com/'
      },
      license: {
        name: 'Pexels license (free)',
        url: 'https://pexels.com/license'
      }
    }
  }
};

const CustomAssetLibrariesCESDK = ({ asset_library = 'airtable' }) => {
  const cesdk_container = useRef(null);
  const assetLibraryConfig = useMemo(
    () => availableAssetLibraries[asset_library],
    [asset_library]
  );

  useEffect(() => {

    const assetSources = { [assetLibraryConfig.id]: assetLibraryConfig.config };

    let cesdk;
    let config = {
      role: 'Adopter',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/custom-asset-libraries/${assetLibraryConfig.sceneFile}`,
      page: {
        title: {
          show: false
        }
      },
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          },
          libraries: {
            insert: {
              floating: false,
              entries: (defaultEntries) => {
                const entriesWithoutDefaultImages = defaultEntries.filter(
                  (entry) => {
                    return entry.id !== 'ly.img.image';
                  }
                );
                return [
                  {
                    id: assetLibraryConfig.id,
                    sourceIds: [assetLibraryConfig.id],
                    previewLength: 3,
                    gridItemHeight: 'auto',
                    gridBackgroundType: 'cover',
                    gridColumns: 2
                  },
                  ...entriesWithoutDefaultImages
                ];
              }
            },
            replace: {
              floating: false,
              entries: () => {
                return [
                  {
                    id: assetLibraryConfig.id,
                    sourceIds: [assetLibraryConfig.id],
                    previewLength: 3,
                    gridItemHeight: 'auto',
                    gridBackgroundType: 'cover',
                    gridColumns: 2
                  }
                ];
              }
            }
          }
        }
      },
      assetSources,
      i18n: {
        en: {
          'libraries.airtable.label': 'Airtable',
          'libraries.unsplash.label': 'Unsplash',
          'libraries.pexels.label': 'Pexels'
        }
      },

      // Begin standard template presets
      presets: {
        templates: {
          postcard_1: {
            label: 'Postcard Design',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.png`
          },
          postcard_2: {
            label: 'Postcard Tropical',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.png`
          },
          business_card_1: {
            label: 'Business card',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.png`
          },
          instagram_photo_1: {
            label: 'Instagram photo',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.png`
          },
          instagram_story_1: {
            label: 'Instagram story',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.png`
          },
          poster_1: {
            label: 'Poster',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.png`
          },
          presentation_4: {
            label: 'Presentation',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.png`
          },
          collage_1: {
            label: 'Collage',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.png`
          }
        }
      }
    };

    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources();
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdk_container, assetLibraryConfig]);

  return (
    <div style={caseContainerStyle}>
      <div className="gap-md flex flex-wrap justify-between">
        <div className="caseHeader caseHeader--no-margin flex-basis-0 flex-grow">
          <h3>Custom Asset Library</h3>
          <p>
            CE.SDK can include assets from third party libraries accessible via
            API.
          </p>
          <assetLibraryConfig.DescriptionComponent />
        </div>
        {assetLibraryConfig.id === 'Airtable' && (
          <div className="flex-basis-0 flex flex-grow">
            <iframe
              className="airtable-embed"
              src="https://airtable.com/embed/shr4x8s9jqaxiJxm5?backgroundColor=orange"
              frameBorder="0"
              width="300"
              height="220"
              title="airtable"
              style={airtableStyle}
            ></iframe>
          </div>
        )}
      </div>
      <div style={wrapperStyle}>
        <div ref={cesdk_container} style={cesdkStyle}></div>
      </div>
    </div>
  );
};
const caseContainerStyle = {
  gap: '2.5rem',
  maxHeight: '100%',
  display: 'flex',
  flexGrow: '1',
  flexDirection: 'column',
  minWidth: 0
};

const cesdkStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '0.75rem'
};

const wrapperStyle = {
  borderRadius: '0.75rem',
  flexGrow: '1',
  minHeight: '450px',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

const linkStyle = {
  textDecoration: 'underline'
};

const airtableStyle = {
  background: 'transparent',
  border: '1px solid #ccc',
  borderRadius: '12px',
  flexGrow: 1
};

export default CustomAssetLibrariesCESDK;
