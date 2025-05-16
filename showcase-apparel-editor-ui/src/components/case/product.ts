import { ProductConfig } from './ApparelEditorUIConfig';

export const PRODUCT_SAMPLES: ProductConfig[] = [
  {
    id: 'tshirt',
    label: 'Mens T-Shirt',
    designUnit: 'Inch',
    unitPrice: 19.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: {
          width: 20,
          height: 20
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/apparel-editor-ui/{{color}}_front.png`,
              width: 815,
              height: 948
            }
          ],
          printableAreaPx: {
            x: 815 / 2 - 360 / 2,
            y: 948 / 2 - 360 / 2 - 100,
            width: 360,
            height: 360
          }
        }
      },
      {
        id: 'back',
        label: 'Back',
        pageSize: {
          width: 20,
          height: 20
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/apparel-editor-ui/{{color}}_back.png`,
              width: 815,
              height: 948
            }
          ],
          printableAreaPx: {
            x: 815 / 2 - 360 / 2,
            y: 948 / 2 - 360 / 2 - 100,
            width: 360,
            height: 360
          }
        }
      },
      {
        id: 'left',
        label: 'Left',
        pageSize: {
          width: 20,
          height: 20
        },
        disabled: true
      },
      {
        id: 'right',
        label: 'Right',
        pageSize: {
          width: 20,
          height: 20
        },
        disabled: true
      }
    ],
    colors: [
      {
        id: 'black',
        colorHex: '#000000'
      },
      {
        id: 'gray',
        colorHex: '#929292'
      },
      {
        id: 'white',
        colorHex: '#FFFFFF',
        isDefault: true
      },
      {
        id: 'red',
        colorHex: '#E02D27'
      },
      {
        id: 'orange',
        colorHex: '#F88D28'
      },
      {
        id: 'yellow',
        colorHex: '#F7EC1E'
      },
      {
        id: 'green',
        colorHex: '#43D31F'
      },
      {
        id: 'cyan',
        colorHex: '#1FD3CA'
      },
      {
        id: 'blue',
        colorHex: '#1F40D3'
      },
      {
        id: 'purple',
        colorHex: '#E524EF'
      }
    ],
    sizes: [
      {
        id: 'XS'
      },
      {
        id: 'S'
      },
      {
        id: 'M'
      },
      {
        id: 'L'
      },
      {
        id: 'XL'
      }
    ]
  }
];
