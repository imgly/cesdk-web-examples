// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  engine.scene.createVideo();
  const stack = engine.block.findByType('stack')[0];
  const page = engine.block.create('page');
  engine.block.appendChild(stack, page);

  const pixelStreamFill = engine.block.createFill('pixelStream');
  engine.block.setFill(page, pixelStreamFill);

  engine.block.appendEffect(page, engine.block.createEffect('half_tone'));
  // highlight-setup

  // highlight-orientation
  // Horizontal mirroring
  engine.block.setEnum(
    pixelStreamFill,
    'fill/pixelStream/orientation',
    'UpMirrored'
  );
  // highlight-orientation

  // highlight-camera
  navigator.mediaDevices.getUserMedia({ video: true }).then(
    (stream) => {
      const video = document.createElement('video');
      video.autoplay = true;
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        engine.block.setWidth(page, video.videoWidth);
        engine.block.setHeight(page, video.videoHeight);
        engine.scene.zoomToBlock(page, 40, 40, 40, 40);
        // highlight-camera
        // highlight-setNativePixelBuffer
        const onVideoFrame = () => {
          engine.block.setNativePixelBuffer(pixelStreamFill, video);
          video.requestVideoFrameCallback(onVideoFrame);
        };
        video.requestVideoFrameCallback(onVideoFrame);
        // highlight-setNativePixelBuffer
      });
    },
    (err) => {
      console.error(err);
    }
  );
});
