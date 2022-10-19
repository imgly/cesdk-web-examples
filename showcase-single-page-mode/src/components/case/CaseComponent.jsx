import CreativeEditorSDK from '@cesdk/cesdk-js';
import SegmentedControl from 'components/ui/SegmentedControl/SegmentedControl';
import React, { useEffect, useRef, useState } from 'react';

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  const cesdkRef = useRef(null);
  const pageIds = useRef(null);
  const [activePageId, setActivePageId] = useState(null);

  useEffect(() => {
    let config = {
      role: 'Adopter',
      theme: 'light',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/example-1-adopter.scene`,
      license: process.env.REACT_APP_LICENSE,
      featureFlags: {
        singlePageMode: true
      },
      page: {
        title: {
          show: false
        }
      },
      ui: {
        elements: {
          libraries: {
            template: false
          },
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
        onExport: 'download'
      }
    };
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        async (instance) => {
          pageIds.current = await instance.unstable_getPages();
          cesdkRef.current = instance;
          setActivePageId(pageIds.current[0]);
        }
      );
    }
    return () => {
      if (cesdkRef.current) {
        cesdkRef.current.dispose();
      }
    };
  }, [cesdk_container]);

  useEffect(() => {
    activePageId && cesdkRef.current?.unstable_switchPage(activePageId);
  }, [activePageId]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="caseHeader">
        <h3>Single Page Mode</h3>
        <p>
          Display one page at a time and switch between the pages of your design
          with a clear focus for multi-page use cases, e.g., various print
          products.
        </p>
      </div>

      <div style={wrapperStyle} className="space-y-2">
        <div className="space-y flex flex-col space-y-2">
          <div className="flex space-x-2">
            {pageIds.current && (
              <SegmentedControl
                options={[
                  { label: 'Page 1', value: pageIds.current?.[0] },
                  { label: 'Page 2', value: pageIds.current?.[1] }
                ]}
                value={activePageId}
                name="pageId"
                onChange={(value) => setActivePageId(value)}
                size="md"
              />
            )}
          </div>
        </div>

        <div style={cesdkWrapperStyle}>
          <div ref={cesdk_container} style={cesdkStyle}></div>
        </div>
      </div>
    </div>
  );
};

const cesdkStyle = {
  height: '100%',
  width: '100%',
  flexGrow: 1,
  overflow: 'hidden',
  borderRadius: '0.75rem'
};
const cesdkWrapperStyle = {
  borderRadius: '0.75rem',
  flexGrow: '1',
  display: 'flex',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

const wrapperStyle = {
  flexGrow: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyItems: 'center',
  justifyContent: 'center'
};
export default CaseComponent;
