import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.52.0-rc.2/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.52.0-rc.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
  const scene = engine.scene.createVideo();

  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);

  engine.block.setDuration(page, 20);

  const caption1 = engine.block.create('caption');
  engine.block.setString(caption1, 'caption/text', 'Caption text 1');
  const caption2 = engine.block.create('caption');
  engine.block.setString(caption2, 'caption/text', 'Caption text 2');

  const captionTrack = engine.block.create('captionTrack');
  engine.block.appendChild(page, captionTrack);
  engine.block.appendChild(captionTrack, caption1);
  engine.block.appendChild(captionTrack, caption2);

  engine.block.setDuration(caption1, 3);
  engine.block.setDuration(caption2, 5);

  engine.block.setTimeOffset(caption1, 0);
  engine.block.setTimeOffset(caption2, 3);

  // Captions can also be loaded from a caption file, i.e., from SRT and VTT files.
  // The text and timing of the captions are read from the file.
  const captions = await api.block.createCaptionsFromURI('https://img.ly/static/examples/captions.srt');
  for (let i = 0; i < captions.length; i++) {
    api.block.appendChild(captionTrack, captions[i]);
  }

  // The position and size are synced with all caption blocks in the scene so only needs to be set once.
  engine.block.setPositionX(caption1, 0.05);
  engine.block.setPositionXMode(caption1, "Percent");
  engine.block.setPositionY(caption1, 0.8);
  engine.block.setPositionYMode(caption1, "Percent");
  engine.block.setHeight(caption1, 0.15);
  engine.block.setHeightMode(caption1, "Percent");
  engine.block.setWidth(caption1, 0.9);
  engine.block.setWidthMode(caption1, "Percent");

  // The style is synced with all caption blocks in the scene so only needs to be set once.
  engine.block.setColor(caption1, "fill/solid/color", { r: 0.9, g: 0.9, b: 0.0, a: 1.0 });
  engine.block.setBool(caption1, "dropShadow/enabled", true);
  engine.block.setColor(caption1, "dropShadow/color", { r: 0.0, g: 0.0, b: 0.0, a: 0.8 });

  /* Export page as mp4 video. */
  const mimeType = 'video/mp4';
  const progressCallback = (renderedFrames, encodedFrames, totalFrames) => {
    console.log(
      'Rendered',
      renderedFrames,
      'frames and encoded',
      encodedFrames,
      'frames out of',
      totalFrames
    );
  };
  const blob = await engine.block.exportVideo(
    page,
    mimeType,
    progressCallback,
    {}
  );

  /* Download blob. */
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'exported-video.mp4';
  anchor.click();
});
