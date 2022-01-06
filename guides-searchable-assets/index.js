import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.3.0/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.3.0/assets',
  presets: {
    // highlight-image-preset
    images: {
      imgly_logo: {
        imageURL: 'https://img.ly/static/ubq_samples/imgly_logo.jpg',
        thumbnailURL: 'https://img.ly/static/ubq_samples/thumbnails/imgly_logo.jpg',
        width: 1980,
        height: 720
      }
    }
    // highlight-image-preset
  },
  i18n: {
    en: {
      assets: {
        // highlight-image-preset-i18n
        imgly_logo: {
          label: "img.ly Logo wow",
          // highlight-tags-i18n
          tags: "imgly;logo;white;purple"
          // highlight-tags-i18n
        },
        // highlight-image-preset-i18n
        // highlight-image-extension-pack-i18n
        ly: {
          img: {
            cesdk: {
              images: {
                samples: {
                  sample: {
                    1: {
                      label: "A really nice beach",
                      // highlight-tags-i18n
                      tags: "beach;random"
                      // highlight-tags-i18n
                    }
                  }
                }
              }
            }
          }
        }
        // highlight-image-extension-pack-i18n
      }
    }
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
