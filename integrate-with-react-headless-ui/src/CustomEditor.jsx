import CreativeEngine from '@cesdk/engine';
import { useCallback, useEffect, useRef } from 'react';

export default function CustomEditor() {
  // reference to store the DOM container where the CreativeEngine canvas will be attached
  const canvasRef = useRef(null);
  // reference to store the CreativeEngine instance
  const engineRef = useRef(null);
  // reference to store the the ID of the image block added to the scene
  const imageBlockIdRef = useRef(null);

  useEffect(() => {
    // your CE.SDK configurations
    const config = {
      // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your actual CE.SDK license key
      userId: 'guides-user'
      // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.66.1/assets'
    };

    // initialize CreativeEngine in headless mode
    CreativeEngine.init(config).then((engine) => {
      // to avoid initializing CreativeEngine twice in strict mode
      if (!engineRef.current) {
        engineRef.current = engine;

        // append CE.SDK canvas to the DOM
        if (canvasRef.current) {
          canvasRef.current.appendChild(engine.element);
        }

        // get the current scene or create a new one
        let scene = engine.scene.get();
        if (!scene) {
          scene = engine.scene.create();
          const page = engine.block.create('page');
          engine.block.appendChild(scene, page);
        }

        // get the first page block
        const [page] = engine.block.findByType('page');

        // appen a block to show an image on the page
        const imageBlockId = engine.block.create('graphic');
        imageBlockIdRef.current = imageBlockId;
        engine.block.setShape(imageBlockId, engine.block.createShape('rect'));

        // fill the block with an image from a public source
        const imageFill = engine.block.createFill('image');
        engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
          {
            uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
            width: 1024,
            height: 683
          }
        ]);
        engine.block.setFill(imageBlockId, imageFill);
        engine.block.appendChild(page, imageBlockId);

        // zoom to fit the page in the editor view
        engine.scene.zoomToBlock(page);
      }
    });
  }, []);

  const changeOpacity = useCallback(() => {
    const engine = engineRef.current;
    const imageBlockId = imageBlockIdRef.current;

    if (engine && imageBlockId != null) {
      // get the current opacity value of the image
      const currentOpacity = engine.block.getOpacity(imageBlockId);
      // reduce the opacity image by 20% at each click
      engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
    }
  }, [engineRef, imageBlockIdRef]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button onClick={changeOpacity}>Reduce Opacity</button>
      </div>
    </div>
  );
}
