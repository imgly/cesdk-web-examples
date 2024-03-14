export const caseAssetPath = (path, caseId = 'batch-image-generation') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

export const replaceImages = (engine, imageName, newUrl) => {
  const images = engine.block.findByName(imageName);

  images.forEach((image) => {
    const fill = engine.block.getFill(image);
    engine.block.setString(fill, 'fill/image/imageFileURI', newUrl);
  });
};
