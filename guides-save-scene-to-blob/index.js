
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.0-rc.0/cesdk.umd.js';

CreativeEditorSDK.init('#cesdk_container').then(async (cesdk) => {
  // highlight-save
  const savedSceneString = await cesdk.save();
  // highlight-save

  // highlight-create-blob
  const blob = new Blob([savedSceneString], {
    type: 'text/plain'
  });
  // highlight-create-blob

  // highlight-create-form-data
  const formData = new FormData();
  formData.append("file", blob);
  await fetch("/upload", {
    method: "POST",
    body: formData
  });
  // highlight-create-form-data
});
