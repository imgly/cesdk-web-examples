import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef } from 'react';
import { findAirtableAssets } from './airtableAssetLibrary';
import { findUnsplashAssets } from './unsplashAssetLibrary';

const availableAssetLibraries = {
  airtable: {
    title: 'Airtable',
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
        spreadsheet in the editor under <b>Images</b> {'>'} <b>Airtable</b>.
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
        in the editor under <b>Images</b> {'>'} <b>Unsplash</b>.
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
  }
};

const CustomAssetLibrariesCESDK = ({ asset_library = 'airtable' }) => {
  const cesdk_container = useRef(null);
  const assetLibraryConfig = availableAssetLibraries[asset_library];

  useEffect(() => {

    const assetSources = {
      ...(asset_library === 'airtable' && {
        airtable: availableAssetLibraries['airtable'].config
      }),
      ...(asset_library === 'unsplash' && {
        unsplash: availableAssetLibraries['unsplash'].config
      })
    };

    let cesdk;
    let config = {
      role: 'Adopter',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/custom-asset-libraries/${asset_library}.scene`,
      page: {
        title: {
          show: false
        }
      },
      ui: {
        elements: {
          panels: {
            settings: true
          },
          libraries: {
            panel: {
              insert: {
                floating: false
              },
              replace: {
                floating: false
              }
            }
          }
        }
      },
      assetSources,
      i18n: {
        en: {
          'libraries.airtable.label': 'Airtable',
          'libraries.unsplash.label': 'Unsplash'
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
      },
      // End standard template presets
      // Set extensions to defaults but exclude the local sample images
      // to show the custom images from our asset library directly.
      // Also remove sticker and shapes to unclutter the bar.
      extensions: {
        entries: [
          'ly.img.cesdk.filters.duotone',
          'ly.img.cesdk.filters.lut',
          // 'ly.img.cesdk.stickers.emoticons',
          // 'ly.img.cesdk.vectorpaths',
          // 'ly.img.cesdk.vectorpaths.abstract',
          'ly.img.cesdk.fonts',
          // 'ly.img.cesdk.images.samples',
          'ly.img.cesdk.effects'
          // 'ly.img.cesdk.stickers.doodle',
          // 'ly.img.cesdk.stickers.hand',
          // 'ly.img.cesdk.stickers.emoji'
        ]
      }
    };
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdk_container, asset_library]);

  return (
    <div style={caseContainerStyle}>
      <div className="gap-md flex flex-wrap justify-between">
        <div className="caseHeader caseHeader--no-margin flex-basis-0 flex-grow">
          <h3>Custom Asset Library</h3>
          <p>
            CE.SDK can include assets from third party libraries accessible via
            API.
          </p>
          <p>
            <assetLibraryConfig.DescriptionComponent />
          </p>
        </div>
        {asset_library === 'airtable' && (
          <div className="flex-basis-0 flex flex-grow">
            <iframe
              className="airtable-embed"
              src="https://airtable.com/embed/shr4x8s9jqaxiJxm5?backgroundColor=orange"
              frameborder="0"
              onmousewheel=""
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
  border: '1px solid #ccc;',
  borderRadius: '12px',
  flexGrow: 1
};

export default CustomAssetLibrariesCESDK;
