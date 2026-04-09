import CreativeEditorSDK, { EditorPlugin } from '@cesdk/cesdk-js';
import { exportHtml, injectGsapPlayer } from '@imgly/html-exporter';

// Workaround for the unexported Dialog type in the cesdk-js package
type Parameters<Type extends (...args: any) => any> = Type extends (
  ...args: infer Args
) => any
  ? Args
  : never;
type Dialog = Exclude<
  Parameters<CreativeEditorSDK['ui']['showDialog']>[0],
  string
>;

const translations = {
  en: {
    'html5-export.exporting.title': 'Exporting HTML5',
    'html5-export.exporting.message': 'Generating HTML5 output...',
    'html5-export.success.title': 'Export Complete',
    'html5-export.success.message':
      'HTML5 preview opened in a new tab. You can now download as ZIP.',
    'html5-export.success-with-warnings.title':
      'Export Complete (with warnings)',
    'html5-export.error.title': 'Export Failed',
    'html5-export.error.message':
      'An error occurred while exporting. Please try again.',
    'html5-export.nav-label': 'Export and Preview HTML5',
    'html5-export.download-zip': 'Download ZIP'
  }
};

export const ExportHtml5PanelPlugin = (): EditorPlugin => ({
  name: 'ly.img.html5-export-plugin',
  version: '1.0.0',
  initialize: async ({ cesdk }) => {
    if (cesdk == null) return;

    cesdk.i18n.setTranslations(translations);

    let isExporting = false;
    let lastExportResult: Awaited<ReturnType<typeof exportHtml>> | null = null;

    // Navigation bar button that directly triggers export
    cesdk.ui.registerComponent(
      'ly.img.html5-export.navigationBar',
      ({ builder }) => {
        builder.Button('html5-export-button', {
          color: 'accent',
          variant: 'regular',
          label: 'html5-export.nav-label',
          isLoading: isExporting,
          isDisabled: isExporting,
          onClick: async () => {
            if (isExporting) return;
            isExporting = true;

            const engine = cesdk.engine;

            const loadingDialog: Dialog = {
              type: 'loading',
              content: {
                title: 'html5-export.exporting.title',
                message: 'html5-export.exporting.message'
              },
              actions: [],
              cancel: undefined,
              clickOutsideToClose: false
            };

            const buildSuccessDialog = (
              messages?: { message: string; type: string }[]
            ): Dialog => {
              const warnings = messages?.filter(
                (m) => m.type === 'warning' || m.type === 'error'
              );
              const hasWarnings = warnings && warnings.length > 0;
              const warningText = hasWarnings
                ? '\n\n' + warnings.map((m) => `⚠ ${m.message}`).join('\n')
                : '';

              return {
                type: hasWarnings ? 'warning' : 'success',
                content: {
                  title: hasWarnings
                    ? 'html5-export.success-with-warnings.title'
                    : 'html5-export.success.title',
                  message:
                    cesdk.i18n.translate('html5-export.success.message') +
                    warningText
                },
                actions: [
                  {
                    label: 'html5-export.download-zip',
                    onClick: async ({ id }) => {
                      if (!lastExportResult) return;
                      try {
                        const zipResult = await exportHtml(engine, {
                          format: 'external',
                          pageIndex: 0,
                          textMode: 'html'
                        });
                        const zip = await zipResult.files.toZip();
                        const blob = new Blob([zip.buffer as ArrayBuffer], {
                          type: 'application/zip'
                        });
                        localDownload(blob, 'html5-export.zip');
                      } catch (error) {
                        console.error('HTML5 ZIP download failed:', error);
                      }
                      cesdk.ui.closeDialog(id);
                    }
                  },
                  {
                    label: 'common.close',
                    onClick: ({ id }) => {
                      cesdk.ui.closeDialog(id);
                    }
                  }
                ],
                cancel: undefined,
                clickOutsideToClose: true
              };
            };

            const errorDialog: Dialog = {
              type: 'error',
              content: {
                title: 'html5-export.error.title',
                message: 'html5-export.error.message'
              },
              actions: [
                {
                  label: 'common.close',
                  onClick: ({ id }) => {
                    cesdk.ui.closeDialog(id);
                  }
                }
              ],
              cancel: undefined,
              clickOutsideToClose: true
            };

            const dialogId = cesdk.ui.showDialog(loadingDialog);

            try {
              const result = await exportHtml(engine, {
                format: 'embedded',
                pageIndex: 0,
                textMode: 'html'
              });

              lastExportResult = result;

              const htmlFile = result.files.get('index.html');
              if (!htmlFile) {
                throw new Error('Export did not produce an HTML file');
              }

              const htmlContent =
                typeof htmlFile.content === 'string'
                  ? htmlFile.content
                  : new TextDecoder().decode(htmlFile.content);

              // Inject GSAP runtime for animated previews
              const playableHtml = injectGsapPlayer(htmlContent);

              // Open preview in new tab
              const blob = new Blob([playableHtml], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');

              cesdk.ui.updateDialog(
                dialogId,
                buildSuccessDialog(result.messages)
              );
            } catch (error) {
              console.error('HTML5 export failed:', error);
              cesdk.ui.updateDialog(dialogId, errorDialog);
            } finally {
              isExporting = false;
            }
          }
        });
      }
    );
  }
});

const localDownload = (data: Blob, filename: string): void => {
  const element = document.createElement('a');
  element.setAttribute('href', URL.createObjectURL(data));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
