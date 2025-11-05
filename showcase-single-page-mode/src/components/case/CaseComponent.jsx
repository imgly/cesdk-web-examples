'use client';

import SINGLE_PAGE_TEMPLATE_ASSETS from './SinglePageTemplateAssets.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      featureFlags: {
        singlePageMode: true
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
      },
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({
      sceneMode: 'Design',
      excludeAssetSourceIds: ['ly.img.template']
    });
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.engine.editor.setSetting('page/title/show', false);

    // Add previous and next page navigation icons
    instance.ui.addIconSet(
      '@imgly/custom',
      `
        <svg>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            id="@imgly/custom/icon/ArrowLeft"
          >
          <path d="M4.79289 12.7072L11.2929 19.2072L12.7071 17.793L7.91414 13H19V11H7.9143L12.7071 6.20718L11.2929 4.79297L4.79289 11.293C4.60536 11.4805 4.5 11.7349 4.5 12.0001C4.5 12.2653 4.60536 12.5196 4.79289 12.7072Z" fill="currentColor"/>

          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            id="@imgly/custom/icon/ArrowRight"
          >
          <path d="M19.2071 12.7072L12.7071 19.2072L11.2929 17.793L16.0858 13.0001H5V11.0001H16.0858L11.2929 6.20719L12.7071 4.79297L19.2071 11.293C19.3947 11.4805 19.5 11.7349 19.5 12.0001C19.5 12.2653 19.3947 12.5196 19.2071 12.7072Z" fill="currentColor"/>
          </symbol>
        </svg>
      `
    );

    function getPageName(engine, pageId, useName = false) {
      if (!engine.block.isValid(pageId)) return '';
      const allPages = engine.scene.getPages();
      if (!allPages.includes(pageId)) return '';

      return (
        (useName && engine.block.getName(pageId)) ||
        `Page ${allPages.indexOf(pageId) + 1}`
      );
    }

    function switchAndSelectPage(newPage) {
      instance.unstable_switchPage(newPage);
      // select the new page
      instance.engine.block.select(newPage);
    }

    let lastActivePageIndex = 0;
    instance.ui.registerComponent('page-select', ({ builder, engine }) => {
      const pageIds = engine.scene.getPages();

      const activePageId = engine.scene.getCurrentPage();
      // If a user deletes the current page, we need to manually switch to another page
      if (!pageIds.includes(activePageId)) {
        // use the next page if the current page is not the last page
        const newPage =
          pageIds[lastActivePageIndex] ??
          pageIds[lastActivePageIndex - 1] ??
          pageIds[0];

        switchAndSelectPage(newPage);
      }
      lastActivePageIndex = pageIds.indexOf(activePageId);

      // if there is only one page, don't show the page select component
      if (pageIds.length <= 1) return;

      // if there are less than 4 pages, show all pages instead of prev/next buttons
      if (pageIds.length <= 3) {
        builder.ButtonGroup('pages', {
          children: () => {
            pageIds.forEach((id) => {
              builder.Button(id, {
                label: getPageName(engine, id, true),
                isActive: activePageId === id,
                onClick: () => activePageId !== id && switchAndSelectPage(id)
              });
            });
          }
        });
      } else {
        // If there are more than 4 pages, show a prev/next button
        const activePageIndex = pageIds.indexOf(activePageId);
        const prevPageId = pageIds[activePageIndex - 1];
        const nextPageId = pageIds[activePageIndex + 1];
        builder.ButtonGroup('pagesControls', {
          children: () => {
            builder.Button('prevPage', {
              tooltip: 'Previous Page',
              icon: '@imgly/custom/icon/ArrowLeft',
              isDisabled: !prevPageId,
              onClick: () => switchAndSelectPage(prevPageId)
            });
            builder.Dropdown('pageSelect', {
              tooltip: 'Select Page',
              label: `${getPageName(engine, activePageId)} / ${pageIds.length}`,
              // button children for each page
              children: ({ close }) => {
                pageIds.forEach((id) => {
                  builder.Button(id, {
                    label: engine.block.getName(id) || getPageName(engine, id),
                    isActive: activePageId === id,
                    onClick: () => {
                      switchAndSelectPage(id);
                      close();
                    }
                  });
                });
              }
            });

            builder.Button('nextPage', {
              tooltip: 'Next Page',
              icon: '@imgly/custom/icon/ArrowRight',
              isDisabled: !nextPageId,
              onClick: () => switchAndSelectPage(nextPageId)
            });
          }
        });
      }
    });
    // Default navigation bar order with the new page select component
    instance.ui.setCanvasBarOrder(
      [
        { id: 'ly.img.settings.canvasBar' },
        { id: 'ly.img.spacer' },
        // Add the page select component
        { id: 'page-select' },
        { id: 'ly.img.page.add.canvasBar' },
        { id: 'ly.img.spacer' }
      ],
      'bottom'
    );

    const engine = instance.engine;
    await engine.scene
      .loadFromArchiveURL(
        caseAssetPath(`/${loadSelectedTemplateFromURL('ig-post')}.archive`)
      )
      .catch(() => {});
    if (engine.scene.get() === null) {
      await engine.scene.loadFromArchiveURL(
        caseAssetPath(`/presentation.archive`)
      );
    }
    // Add sample templates:
    loadAssetSourceFromContentJSON(
      engine,
      SINGLE_PAGE_TEMPLATE_ASSETS,
      caseAssetPath(''),
      async (asset) => {
        if (!asset.meta || !asset.meta.uri)
          throw new Error('Asset does not have a uri');
        await engine.scene.loadFromArchiveURL(asset.meta.uri);
        persistSelectedTemplateToURL(asset.id);
      }
    );
    return () => {
      unsubscribeHandlers.forEach((unsubscribe) => unsubscribe?.());
    };
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

function persistSelectedTemplateToURL(templateName) {
  const url = new URL(window.location.href);
  url.searchParams.set('template', templateName);
  window.history.pushState({}, '', url);
}
function loadSelectedTemplateFromURL(fallbackTemplateName) {
  const url = new URL(window.location.href);
  return url.searchParams.get('template') || fallbackTemplateName;
}
function caseAssetPath(path, caseId = 'single-page-mode') {
  return `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;
}

export default CaseComponent;
