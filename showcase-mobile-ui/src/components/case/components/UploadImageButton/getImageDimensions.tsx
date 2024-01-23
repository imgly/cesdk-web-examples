/**
 * Returns image dimensions for specified URL.
 */
export const getImageDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({
        width: img.width,
        height: img.height
      });
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};
