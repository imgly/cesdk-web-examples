'use client';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const caseAssetPath = (path, caseId = 'page-sizes') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          }
        }
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);

    // Register custom dock button component
    instance.ui.registerComponent(
      'ly.img.page.resize.dock',
      ({ builder: { Button } }) => {
        const isResizePanelOpen = instance.ui.isPanelOpen(
          '//ly.img.panel/inspector/pageResize'
        );

        Button('open-page-resize', {
          label: 'Page Sizes',
          icon: () => caseAssetPath('/page-sizes-large.svg'),
          isSelected: isResizePanelOpen,
          onClick: () => {
            if (isResizePanelOpen) {
              instance.ui.closePanel('//ly.img.panel/inspector/pageResize');
            } else {
              instance.ui.openPanel('//ly.img.panel/inspector/pageResize');
            }
          }
        });
      }
    );

    // Add custom dock button to dock order
    instance.ui.setDockOrder([
      'ly.img.page.resize.dock',
      'ly.img.separator',
      ...instance.ui.getDockOrder()
    ]);

    await instance.loadFromURL(caseAssetPath('/page-sizes.scene'));
  }, []);

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

export default CaseComponent;
