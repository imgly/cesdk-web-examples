import { ProductConfig } from './ProductEditorUIConfig';

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
          width: 12,
          height: 12
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/tshirt/{{color}}_front.png`,
              width: 814,
              height: 947
            }
          ],
          printableAreaPx: {
            x: 814 / 2 - 360 / 2,
            y: 947 / 2 - 360 / 2 - 100,
            width: 360,
            height: 360
          }
        }
      },
      {
        id: 'back',
        label: 'Back',
        pageSize: {
          width: 12,
          height: 12
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/tshirt/{{color}}_back.png`,
              width: 814,
              height: 947
            }
          ],
          printableAreaPx: {
            x: 814 / 2 - 360 / 2,
            y: 947 / 2 - 360 / 2 - 100,
            width: 360,
            height: 360
          }
        }
      }
    ],
    colors: [
      {
        id: 'white',
        colorHex: '#FFFFFF',
        isDefault: true
      },
      {
        id: 'black',
        colorHex: '#000000'
      },
      {
        id: 'blue',
        colorHex: '#1F40D3'
      },
      {
        id: 'gray',
        colorHex: '#929292'
      },
      {
        id: 'green',
        colorHex: '#43D31F'
      },
      {
        id: 'red',
        colorHex: '#E02D27'
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
  },
  {
    id: 'cap',
    label: 'Baseball Cap',
    designUnit: 'Inch',
    unitPrice: 14.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: {
          width: 4.5,
          height: 3
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/cap/{{color}}_front.png`,
              width: 736,
              height: 760
            }
          ],
          printableAreaPx: {
            x: 736 / 2 - 300 / 2,
            y: 760 / 2 - 200 / 2 - 50,
            width: 300,
            height: 200
          }
        }
      },
      {
        id: 'back',
        label: 'Back',
        pageSize: {
          width: 2.99,
          height: 1.38
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/cap/{{color}}_back.png`,
              width: 736,
              height: 760
            }
          ],
          printableAreaPx: {
            x: 269,
            y: 244,
            width: 199,
            height: 92
          }
        }
      }
    ],
    colors: [
      {
        id: 'white',
        colorHex: '#FFFFFF',
        isDefault: true
      },
      {
        id: 'black',
        colorHex: '#000000'
      },
      {
        id: 'blue',
        colorHex: '#1F40D3'
      },
      {
        id: 'gray',
        colorHex: '#929292'
      },
      {
        id: 'green',
        colorHex: '#43D31F'
      },
      {
        id: 'red',
        colorHex: '#E02D27'
      }
    ],
    sizes: [
      {
        id: 'One Size'
      }
    ]
  },
  {
    id: 'arrowsign',
    label: 'Arrow Sign',
    designUnit: 'Inch',
    unitPrice: 29.99,
    areas: [
      {
        id: 'front',
        label: 'Design',
        pageSize: {
          width: 37.88,
          height: 25
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/arrowsign/{{color}}.png`,
              width: 1039,
              height: 963
            }
          ],
          printableAreaPx: {
            x: 59,
            y: 42,
            width: 947,
            height: 625
          },
          editingMaskUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/arrowsign/editing-mask.png`,
          exportingMaskUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/arrowsign/exporting-mask.png`
        }
      }
    ],
    colors: [
      {
        id: 'white',
        colorHex: '#FFFFFF',
        isDefault: true
      },
      {
        id: 'black',
        colorHex: '#000000'
      },
      {
        id: 'blue',
        colorHex: '#1F40D3'
      },
      {
        id: 'gray',
        colorHex: '#929292'
      },
      {
        id: 'green',
        colorHex: '#43D31F'
      },
      {
        id: 'red',
        colorHex: '#E02D27'
      }
    ],
    sizes: [
      {
        id: '24" x 12"'
      }
    ]
  },
  {
    id: 'mug',
    label: 'Coffee Mug',
    designUnit: 'Inch',
    unitPrice: 12.99,
    areas: [
      {
        id: 'front',
        label: 'Design',
        pageSize: {
          width: 9,
          height: 11.58
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/mug/{{color}}.png`,
              width: 841,
              height: 762
            }
          ],
          printableAreaPx: {
            x: 155,
            y: 186,
            width: 300,
            height: 386
          }
        }
      }
    ],
    colors: [
      {
        id: 'white',
        colorHex: '#FFFFFF',
        isDefault: true
      },
      {
        id: 'black',
        colorHex: '#000000'
      },
      {
        id: 'blue',
        colorHex: '#1F40D3'
      },
      {
        id: 'gray',
        colorHex: '#929292'
      },
      {
        id: 'green',
        colorHex: '#43D31F'
      },
      {
        id: 'red',
        colorHex: '#E02D27'
      }
    ],
    sizes: [
      {
        id: '11oz'
      }
    ]
  },
  {
    id: 'phonecase',
    label: 'Phone Case',
    designUnit: 'Inch',
    unitPrice: 16.99,
    areas: [
      {
        id: 'front',
        label: 'Design',
        pageSize: {
          width: 2.75,
          height: 3.12
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/phonecase/{{color}}.png`,
              width: 494,
              height: 917
            }
          ],
          printableAreaPx: {
            x: 73,
            y: 321,
            width: 348,
            height: 341
          }
        }
      }
    ],
    colors: [
      {
        id: 'white',
        colorHex: '#FFFFFF',
        isDefault: true
      },
      {
        id: 'black',
        colorHex: '#000000'
      },
      {
        id: 'blue',
        colorHex: '#1F40D3'
      },
      {
        id: 'gray',
        colorHex: '#929292'
      },
      {
        id: 'green',
        colorHex: '#43D31F'
      },
      {
        id: 'red',
        colorHex: '#E02D27'
      }
    ],
    sizes: [
      {
        id: 'iPhone 14 Pro'
      }
    ]
  },
  {
    id: 'totebag',
    label: 'Tote Bag',
    designUnit: 'Inch',
    unitPrice: 18.99,
    areas: [
      {
        id: 'front',
        label: 'Design',
        pageSize: {
          width: 15.37,
          height: 13.45
        },
        mockup: {
          images: [
            {
              uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/totebag/{{color}}.png`,
              width: 751,
              height: 1225
            }
          ],
          printableAreaPx: {
            x: 132,
            y: 619,
            width: 489,
            height: 432.32
          }
        }
      }
    ],
    colors: [
      {
        id: 'white',
        colorHex: '#FFFFFF',
        isDefault: true
      },
      {
        id: 'black',
        colorHex: '#000000'
      },
      {
        id: 'blue',
        colorHex: '#1F40D3'
      },
      {
        id: 'gray',
        colorHex: '#929292'
      },
      {
        id: 'green',
        colorHex: '#43D31F'
      },
      {
        id: 'red',
        colorHex: '#E02D27'
      }
    ],
    sizes: [
      {
        id: 'One Size'
      }
    ]
  }
];
