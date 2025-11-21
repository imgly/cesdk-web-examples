import { type CreativeEngine, EditorPlugin } from '@cesdk/cesdk-js';

const COLOR_PROFILES = ['fogra39', 'gracol', 'srgb'] as const;

type ColorProfile = (typeof COLOR_PROFILES)[number];

export enum PageAmountType {
  ALL = 'all',
  CUSTOM = 'custom'
}

const COLOR_PROFILE_SELECT_VALUES = [
  { id: 'fogra39', label: 'ISO Coated v2 (ECI) (CMYK)' },
  { id: 'gracol', label: 'GRACoL 2006 (CMYK)' },
  { id: 'srgb', label: 'sRGB (RGB)' }
];

const COLOR_PROFILE_DEFAULT_VALUE = COLOR_PROFILE_SELECT_VALUES[0];

type SelectValue = { id: string; label: string | string[] };

export const ExportPrintReadyPDFPanelPlugin = (): EditorPlugin => ({
  name: 'ly.img.export-print-ready-pdf',
  version: '1.0.0',
  initialize: async ({ cesdk }) => {
    if (cesdk == null) return;

    cesdk.ui.registerComponent(
      'ly.img.export-print-ready-pdf.navigationBar',
      ({ builder }) => {
        builder.Button('export-button', {
          color: 'accent',
          variant: 'regular',
          label: 'common.export',
          onClick: () => {
            if (cesdk.ui.isPanelOpen('//ly.img.panel/export-print-ready-pdf')) {
              cesdk.ui.closePanel('//ly.img.panel/export-print-ready-pdf');
            } else {
              cesdk.ui.openPanel('//ly.img.panel/export-print-ready-pdf');
            }
          }
        });
      }
    );

    cesdk.i18n.setTranslations({
      en: {
        'panel.//ly.img.panel/export-print-ready-pdf': 'Export PDF/X-3',
        'pages/all': 'All',
        'pages/custom': 'Custom'
      }
    });

    cesdk.ui.registerPanel(
      '//ly.img.panel/export-print-ready-pdf',
      ({ builder, engine, state }) => {
        const colorProfileState = state<SelectValue>(
          'colorProfile',
          COLOR_PROFILE_DEFAULT_VALUE
        );
        const pagesState = state<PageAmountType>('pages', PageAmountType.ALL);

        const rangeInputState = state<string>('rangeInput', '');
        const rangeInputErrorState = state<string | undefined>(
          'rangeInputError'
        );
        const rangePageState = state<number[]>('rangePages', []);

        builder.Section('color-profile-section', {
          children: () => {
            builder.Select('color-profile', {
              inputLabel: 'Color Profile',
              values: COLOR_PROFILE_SELECT_VALUES,
              value: colorProfileState.value,
              setValue: colorProfileState.setValue,
              tooltip:
                'Select the color profile for print-ready PDF export. CMYK profiles are recommended for professional printing.'
            });
          }
        });

        builder.Section('pages-section', {
          children: () => {
            builder.ButtonGroup('pages', {
              inputLabel: 'Pages',
              children: () => {
                [PageAmountType.ALL, PageAmountType.CUSTOM].forEach(
                  (pageType) => {
                    builder.Button(pageType, {
                      label: `pages/${pageType}`,
                      isActive: pagesState.value === pageType,
                      onClick: () => pagesState.setValue(pageType)
                    });
                  }
                );
              }
            });

            if (pagesState.value === 'custom') {
              builder.TextInput('page-range', {
                inputLabel: 'Page Range',
                value: rangeInputState.value,
                setValue: (newValue) => {
                  rangeInputState.setValue(newValue);
                  try {
                    rangePageState.setValue(getPagesFromRange([], newValue));
                    rangeInputErrorState.setValue(undefined);
                  } catch (error: any) {
                    rangeInputErrorState.setValue(error.message);
                  }
                }
              });
              builder.Text('page-range-info', {
                content: rangeInputErrorState.value ?? 'e.g.: 1,1-2',
                align: 'right'
              });
            }
          }
        });

        builder.Section('export-button', {
          children: () => {
            const loadingState = state<boolean>('loading', false);
            builder.Button('export', {
              label: 'Export PDF',
              isLoading: loadingState.value,
              color: 'accent',
              onClick: async () => {
                loadingState.setValue(true);

                await exportPrintReadyPDF(
                  engine,
                  rangeInputState.value,
                  colorProfileState.value.id as ColorProfile
                );

                loadingState.setValue(false);
              }
            });
          }
        });
      }
    );

    cesdk.ui.setPanelPosition(
      '//ly.img.panel/export-print-ready-pdf',
      'right' as any
    );
  }
});

const exportPrintReadyPDF = async (
  engine: CreativeEngine,
  pageRange: string,
  colorProfile: ColorProfile
) => {
  const scene = engine.scene.get();
  if (scene == null) {
    return;
  }
  const pages = engine.scene.getPages();
  let filteredPages: number[] = pages;
  try {
    filteredPages = getPagesFromRange(pages, pageRange);
  } catch {
    return;
  }

  const hiddenPages = pages.filter((id: number) => !filteredPages.includes(id));

  // Hide pages from export that are not specified in the range
  hiddenPages.forEach((id: number) => {
    engine.block.setVisible(id, false);
  });

  // Export as standard PDF first
  const pdfBlob = await engine.block.export(scene, {
    mimeType: 'application/pdf'
  });

  // Restore hidden pages
  hiddenPages.forEach((id: number) => {
    engine.block.setVisible(id, true);
  });

  // Load the plugin from CDN to avoid Next.js webpack bundling issues with import.meta.url
  const { convertToPDFX3 } = await import(
    /* webpackIgnore: true */
    // @ts-ignore - Dynamic import from CDN, TypeScript cannot resolve this
    'https://cdn.jsdelivr.net/npm/@imgly/plugin-print-ready-pdfs-web@1.0.0/dist/index.mjs'
  );

  // Convert to print-ready PDF/X-3
  const printReadyPDF = await convertToPDFX3(pdfBlob, {
    outputProfile: colorProfile,
    title: 'Print-Ready Export'
  });

  await localDownload(printReadyPDF, 'my-design-print-ready');
};

const getPagesFromRange = (
  scenePages: number[],
  pageRange: string
): number[] => {
  if (!pageRange) {
    return scenePages;
  }
  // The regex pattern for matching valid page ranges
  const regexPattern = /^(\d+-\d+|\d+)(,(\d+-\d+|\d+))*$/;

  // Test the input page range against the regex pattern
  if (!regexPattern.test(pageRange.replace(/\s/, ''))) {
    throw new Error('Invalid page range');
  }

  // Split the input page range by commas
  const pageRanges = pageRange.split(',');

  // Build a list of page indexes within the specified ranges
  const pageIndexes: number[] = [];
  pageRanges.forEach((range: string) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        pageIndexes.push(i);
      }
    } else {
      pageIndexes.push(Number(range));
    }
  });

  return [...scenePages].filter((_, i) => pageIndexes.includes(i + 1));
};

const localDownload = (data: Blob, filename: string): Promise<void> => {
  return new Promise((resolve) => {
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    resolve();
  });
};
