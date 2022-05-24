export const caseAssetPath = (path, caseId = 'batch-image-generation') =>
  `${process.env.REACT_APP_URL_HOSTNAME}${process.env.PUBLIC_URL}/cases/${caseId}${path}`;

export const replaceImages = (cesdk, imageName, newUrl) => {
  const images = cesdk.block.findByName(imageName);

  images.forEach((image) => {
    cesdk.block.setString(image, 'image/imageFileURI', newUrl);
    cesdk.block.resetCrop(image);
    cesdk.block.setBool(image, 'image/showsPlaceholderOverlay', false);
  });
};
