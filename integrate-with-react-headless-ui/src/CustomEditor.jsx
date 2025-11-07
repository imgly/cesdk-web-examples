import { useEffect, useRef } from 'react';
import CreativeEngine from '@cesdk/engine';

export default function CustomEditor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const initEngine = async () => {
      if (!canvasRef.current) return;

      const config = {
        userId: 'guides-user',
        // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.0/assets'
      };

      const engine = await CreativeEngine.init(config);

      // Attach engine element to DOM
      canvasRef.current.appendChild(engine.element);

      // Create a scene programmatically
      const scene = engine.scene.create();

      // Add blocks and manipulate content
      const page = engine.block.create('page');
      engine.block.setWidth(page, 800);
      engine.block.setHeight(page, 600);
      engine.block.appendChild(scene, page);

      // Zoom to fit the page
      engine.scene.zoomToBlock(page);
    };

    initEngine();
  }, []);

  return <div ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />;
}
