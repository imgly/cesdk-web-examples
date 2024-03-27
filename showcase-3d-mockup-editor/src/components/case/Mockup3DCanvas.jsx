import { useEffect, useRef, useState } from 'react';
import '@google/model-viewer/dist/model-viewer';

export const Mockup3DCanvas = ({
  imageUrl,
  modelUrl,
  baseColorTextureIndex,
  cameraOrbit = '160deg 90deg'
}) => {
  const modelViewerRef = useRef();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const changeTexture = async () => {
      const duck = modelViewerRef.current;
      if (!duck || !duck.model) return;

      const material = duck.model.materials[baseColorTextureIndex];
      const texture = await duck.createTexture(imageUrl);
      material['pbrMetallicRoughness']['baseColorTexture'].setTexture(texture);
    };
    changeTexture();
  }, [baseColorTextureIndex, imageUrl]);

  useEffect(() => {
    const duck = modelViewerRef.current;
    duck.addEventListener('load', async () => {
      const material = duck.model.materials[baseColorTextureIndex];
      const texture = await duck.createTexture(imageUrl);
      material['pbrMetallicRoughness']['baseColorTexture'].setTexture(texture);
      duck.cameraOrbit = cameraOrbit;
      duck.cameraControls = true;
      setLoaded(true);
    });
  }, [modelUrl, imageUrl, baseColorTextureIndex, cameraOrbit]);

  return (
    <model-viewer
      ref={modelViewerRef}
      src={modelUrl}
      style={{ width: '100%', height: '100%' }}
      camera-controls
      shadow-intensity="1"
      data-cy={loaded ? 'mockup-3d-canvas' : 'mockup-3d-canvas-loading'}
    >
      <div className="progress-bar hide" slot="progress-bar">
        <div className="update-bar"></div>
      </div>
    </model-viewer>
  );
};
