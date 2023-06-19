export function downloadURI(uri: string, name: string) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function imageDataDownload(imageData: ImageData, name: string) {
  const tmp = imageDataToDataUrl(imageData, 'image/png', 1);
  downloadURI(tmp, name);
}

export function imageDataToDataUrl(
  imagedata: ImageData,
  mime = 'image/png',
  quality = 1
) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = imagedata.width;
  canvas.height = imagedata.height;
  ctx.putImageData(imagedata, 0, 0);
  return canvas.toDataURL(mime, quality);
}

export function imageBitmapToImageData(imageBitmap: ImageBitmap) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set the canvas dimensions to match the ImageBitmap
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  // Draw the ImageBitmap onto the canvas
  ctx.drawImage(imageBitmap, 0, 0);

  // Retrieve the ImageData from the canvas
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function imageDataResize(
  imageData: ImageData,
  newWidth: number,
  newHeight: number
) {
  const bitmap = await createImageBitmap(imageData, {
    resizeWidth: newWidth,
    resizeHeight: newHeight,
    resizeQuality: 'high',
    premultiplyAlpha: 'premultiply'
  });
  return imageBitmapToImageData(bitmap);
}
