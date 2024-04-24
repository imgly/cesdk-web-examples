'use client';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useEffect, useState } from 'react';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';

const CaseComponent = () => {
  const [cesdk, setCesdk] = useCreativeEditor();
  const [pageIds, setPageIds] = useState([]);
  const [activePageId, setActivePageId] = useState(null);

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
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    instance.engine.editor.setSettingBool('page/title/show', false);
    const engine = instance.engine;

    const unsubscribeHandlers = [];
    const unsubscribeActive = engine.scene.onActiveChanged(() => {
      const newPageIds = engine.scene.getPages();
      setPageIds(newPageIds);
      setActivePageId(newPageIds[0]);
      const pageParent = engine.block.getParent(newPageIds[0]);
      const unsubscribe = engine.event.subscribe([pageParent], () => {
        const getPages = async () => {
          const newPageIds = engine.scene.getPages();
          const newActivePageId = engine.scene.getCurrentPage();
          setPageIds(newPageIds);
          setActivePageId(newActivePageId);
        };
        getPages();
      });
      unsubscribeHandlers.push(unsubscribe);
    });
    unsubscribeHandlers.push(unsubscribeActive);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/example-1.scene`
    );
    return () => {
      unsubscribeHandlers.forEach((unsubscribe) => unsubscribe?.());
    };
  }, []);

  useEffect(() => {
    activePageId && cesdk && cesdk.unstable_switchPage(activePageId);
  }, [cesdk, activePageId]);

  return (
    <div style={wrapperStyle} className="space-y-2">
      <div className="flex flex-col items-center">
        {pageIds && cesdk && (
          <SegmentedControl
            options={pageIds.map((id, index) => ({
              label: cesdk.engine.block.getName(id) || `Page ${index + 1}`,
              value: id
            }))}
            value={activePageId}
            name="pageId"
            onChange={(value) => setActivePageId(value)}
            size="md"
          />
        )}
      </div>

      <div style={cesdkWrapperStyle}>
        <CreativeEditor
          style={cesdkStyle}
          config={config}
          configure={configure}
          onInstanceChange={setCesdk}
        />
      </div>
    </div>
  );
};

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const cesdkWrapperStyle = {
  position: 'relative',
  minHeight: '640px',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(22, 22, 23, 0.25), 0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)'
};

const wrapperStyle = {
  flexGrow: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyItems: 'center',
  justifyContent: 'center'
};
export default CaseComponent;
