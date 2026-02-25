'use client';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import { useEffect, useState, useRef } from 'react';
import {
  createOrUpdateSceneByProduct,
  switchProductView
} from './ProductEditorUIConfig';
import classes from './CaseComponent.module.css';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { PRODUCT_SAMPLES } from './product';
import FormSection from './FormSection';
import { enableProductConfigurator } from './productConfigurator';

const CaseComponent = () => {
  const [productId, setProductId] = useState(PRODUCT_SAMPLES[0].id);
  const product = PRODUCT_SAMPLES.find((p) => p.id === productId);
  const [areaId, setAreaId] = useState(product.areas[0].id);
  const [color, setColor] = useState(
    product.colors.find((c) => c.isDefault === true) ?? {
      id: 'white',
      colorHex: '#FFFFFF'
    }
  );
  const [instance, setInstance] = useCreativeEditor(null);
  const isFirstRender = useRef(true);
  // Ref to access current color in CE.SDK component callbacks without stale closures
  const colorRef = useRef(color);
  colorRef.current = color;
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
  const configure = useConfigure(
    async (instance) => {
      // Add the design editor configuration plugin first
      await instance.addPlugin(new DesignEditorConfig());

      // Asset Source Plugins (replaces addDefaultAssetSources)
      await instance.addPlugin(new ColorPaletteAssetSource());
      await instance.addPlugin(new TypefaceAssetSource());
      await instance.addPlugin(new TextAssetSource());
      await instance.addPlugin(new TextComponentAssetSource());
      await instance.addPlugin(new VectorShapeAssetSource());
      await instance.addPlugin(new StickerAssetSource());
      await instance.addPlugin(new EffectsAssetSource());
      await instance.addPlugin(new FiltersAssetSource());
      await instance.addPlugin(new BlurAssetSource());
      await instance.addPlugin(new PagePresetsAssetSource());
      await instance.addPlugin(new CropPresetsAssetSource());
      await instance.addPlugin(
        new UploadAssetSources({
          include: ['ly.img.image.upload']
        })
      );

      // Demo assets (replaces addDemoAssetSources)
      await instance.addPlugin(
        new DemoAssetSources({
          include: ['ly.img.image.*']
        })
      );

      // Disable placeholder and preview features
      instance.feature.enable('ly.img.placeholder', false);
      instance.feature.enable('ly.img.preview', false);

      // Hide 'Resize' button on the navigation bar
      instance.feature.enable('ly.img.page.resize', false);
      instance.feature.enable('ly.img.options', false);
      instance.feature.enable('ly.img.settings', false);
      instance.ui.setDockOrder([
        ...instance.ui
          .getDockOrder()
          .filter(({ key }) => !['ly.img.templates'].includes(key))
      ]);
      instance.engine.editor.setSetting('page/title/show', false);

      // Create initial scene with the first product
      // Note: We don't call switchProductView here because the product update
      // effect (line ~187) will handle it after the scene is created
      const initialProduct = PRODUCT_SAMPLES[0];
      await createOrUpdateSceneByProduct(instance.engine, initialProduct);
    },
    []
  );

  // Setup product-specific UI (area selector) after scene is ready
  useEffect(() => {
    if (!instance || !product) return;

    // Wait for next frame to ensure scene is ready
    const timeoutId = setTimeout(() => {
      // Only show area selector if product has multiple areas
      if (product.areas.length > 1) {
        // Register custom component for front/back switching
        instance.ui.registerComponent(
          'product-area-select',
          ({ builder, engine }) => {
            // Read from engine for visual state - CE.SDK reactivity handles re-renders
            const currentPage = engine.scene.getCurrentPage();
            const currentAreaId = currentPage
              ? engine.block.getName(currentPage)
              : product.areas[0].id;

            builder.ButtonGroup('product-areas', {
              children: () => {
                product.areas.forEach((area) => {
                  builder.Button(area.id, {
                    label: area.label,
                    isActive: currentAreaId === area.id,
                    onClick: () => {
                      // Directly switch view in engine - CE.SDK reactivity updates the UI
                      // Using colorRef.current to get latest color without stale closure
                      switchProductView(instance, area.id, colorRef.current);
                    }
                  });
                });
              }
            });
          }
        );

        // Add the product area select component to the canvas bar
        instance.ui.setCanvasBarOrder(
          [
            { id: 'ly.img.spacer' },
            { id: 'product-area-select' },
            { id: 'ly.img.spacer' }
          ],
          'bottom'
        );
      } else {
        // For single-area products, hide canvas bar elements
        instance.ui.setCanvasBarOrder(
          [
            { id: 'ly.img.spacer' }
          ],
          'bottom'
        );
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [instance, product]);

  // Reset area and color when product changes
  useEffect(() => {
    if (product) {
      // Reset the flag so the area/color effect doesn't run when we set these values
      isFirstRender.current = true;
      setAreaId(product.areas[0].id);
      setColor(
        product.colors.find((c) => c.isDefault === true) ?? product.colors[0]
      );
    }
  }, [productId, product]);

  // Create or update scene when product changes or instance initializes
  useEffect(() => {
    const updateScene = async () => {
      if (instance && product) {
        // This will only recreate mockups if product has changed
        const success = await createOrUpdateSceneByProduct(
          instance.engine,
          product
        );
        // Only switch view if scene was successfully created/updated
        if (success) {
          // Check if current area exists in new product, otherwise use first area
          const targetArea = product.areas.find((a) => a.id === areaId);
          const finalAreaId = targetArea ? areaId : product.areas[0].id;

          // Update areaId state if we had to fall back to first area
          if (!targetArea) {
            setAreaId(finalAreaId);
          }

          // Use the default color for the new product (not the stale color state)
          const defaultColor =
            product.colors.find((c) => c.isDefault === true) ??
            product.colors[0];
          switchProductView(instance, finalAreaId, defaultColor);
        }
      }
    };
    updateScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, productId]);

  // Update the editor view when the selected color changes (but not product)
  // Note: Area changes from button clicks go directly through switchProductView,
  // this effect handles color changes from the sidebar
  useEffect(() => {
    // Skip on first render - initial view is set by the product change effect
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (instance) {
      switchProductView(instance, areaId, color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, color]);

  // Keyboard shortcut: Press 'M' to enable product configurator mode
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only trigger if 'M' key is pressed (not in an input field)
      if (
        event.key === 'm' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.target.tagName !== 'INPUT' &&
        event.target.tagName !== 'TEXTAREA'
      ) {
        if (instance && product) {
          enableProductConfigurator(instance, product, areaId, color).catch(
            (error) => {
              console.error('Failed to enable product configurator:', error);
            }
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [instance, product, areaId, color]);

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
          productId={productId}
          setProductId={setProductId}
          product={product}
          color={color}
          setColor={setColor}
          cesdk={instance}
        />
      </div>
    </div>
  );
};

export default CaseComponent;
