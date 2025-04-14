import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.49.0-rc.2/index.js';

const colors = [
  {
    id: 'RGB Murky Magenta',
    label: { en: 'RGB Murky Magenta' },
    tags: { en: ['RGB', 'Murky', 'Magenta'] },
    payload: {
      color: {
        colorSpace: 'sRGB',
        r: 0.65,
        g: 0.3,
        b: 0.65,
        a: 1
      }
    }
  },
  {
    id: 'Spot Goo Green',
    label: { en: 'Spot Goo Green' },
    tags: { en: ['Spot', 'Goo', 'Green'] },
    payload: {
      color: {
        colorSpace: 'SpotColor',
        name: 'Spot Goo Green',
        externalReference: 'My Spot Color Book',
        representation: {
          colorSpace: 'sRGB',
          r: 0.7,
          g: 0.98,
          b: 0.13,
          a: 1
        }
      }
    }
  },
  {
    id: 'CMYK Baby Blue',
    label: { en: 'CMYK Baby Blue' },
    tags: { en: ['CMYK', 'Baby', 'Blue'] },
    payload: {
      color: {
        colorSpace: 'CMYK',
        c: 0.5,
        m: 0,
        y: 0,
        k: 0
      }
    }
  }
];

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  locale: 'en',
  i18n: {
    en: {
      'libraries.myCustomColors.label': 'Custom Color Library'
    }
  },
  ui: {
    colorLibraries: ['ly.img.colors.defaultPalette', 'myCustomColors'],
    elements: {
      view: 'default',
      panels: {
        settings: true
      }
    }
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (cesdk) => {
  cesdk.addDefaultAssetSources();
  cesdk.addDemoAssetSources();

  cesdk.engine.asset.addLocalSource('myCustomColors', ['text/plain']);
  for (const asset of colors) {
    cesdk.engine.asset.addAssetToSource('myCustomColors', asset);
  }

  cesdk.createDesignScene();
});
