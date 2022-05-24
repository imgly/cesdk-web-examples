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
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/single-page-mode/example.scene`,
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
          panels: {
            settings: true
          }
        }
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
    <div style={wrapperStyle} className="space-y-2">
      <div className="space-y flex flex-col items-center space-y-2">
        <div className="flex space-x-2">
          {pageIds.current && (
            <SegmentedControl
              options={[
                { label: 'Front page', value: pageIds.current?.[0] },
                { label: 'Back page', value: pageIds.current?.[1] }
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
