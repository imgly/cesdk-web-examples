'use client';

import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';
import { useEffect, useState } from 'react';
import classes from './CaseComponent.module.css';
import FormSection from './FormSection';
import { PRODUCT_SAMPLES } from './product';
import {
  createOrUpdateSceneByProduct,
  switchProductView
} from './ApparelEditorUIConfig';

const CaseComponent = () => {
  const product = PRODUCT_SAMPLES[0];
  const [areaId, setAreaId] = useState(product.areas[0].id);
  const [color, setColor] = useState(
    product.colors.find((c) => c.isDefault === true) ?? {
      id: 'white',
      colorHex: '#FFFFFF'
    }
  );
  const [instance, setInstance] = useCreativeEditor(null);
  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      featureFlags: {
        singlePageMode: true
      },
      callbacks: {
        onUpload: 'local'
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
    instance.ui.setDockOrder([
      ...instance.ui
        .getDockOrder()
        .filter(({ key }) => !['ly.img.template'].includes(key))
    ]);
    instance.engine.editor.setSettingBool('page/title/show', false);
    // });
  }, []);

  // Sets the initial product as well as updates the scene when the product changes
  useEffect(() => {
    const updateScene = async () => {
      if (instance && product) {
        await createOrUpdateSceneByProduct(instance.engine, product);
        switchProductView(
          instance,
          product.areas.find((a) => a.id === areaId).mockup,
          areaId,
          color
        );
      }
    };
    updateScene();
  }, [instance, product]);
  // Update the editor view when the selected area or color changes
  useEffect(() => {
    if (instance) {
      switchProductView(
        instance,
        product.areas.find((a) => a.id === areaId).mockup,
        areaId,
        color
      );
    }
  }, [areaId, color]);

  return (
    <div className={classes.wrapper}>
      <div className="cesdkWrapperStyle">
        <CreativeEditor
          style={{
            '--ubq-InspectorBar-background': 'var(--ubq-canvas)'
          }}
          onInstanceChange={setInstance}
          className="cesdkStyle"
          config={config}
          configure={configure}
        />
      </div>
      <div className={classes.sidebar}>
        <FormSection
          areaId={areaId}
          setAreaId={setAreaId}
          color={color}
          setColor={setColor}
          cesdk={instance}
        />
      </div>
    </div>
  );
};

export default CaseComponent;
