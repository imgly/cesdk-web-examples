export const caseAssetPath = (path, caseId = 'batch-image-generation') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

export const replaceImages = (cesdk, imageName, newUrl) => {
  const images = cesdk.block.findByName(imageName);

  images.forEach((image) => {
    cesdk.block.setString(image, 'image/imageFileURI', newUrl);
    cesdk.block.resetCrop(image);
    cesdk.block.setBool(image, 'image/showsPlaceholderOverlay', false);
  });
};
