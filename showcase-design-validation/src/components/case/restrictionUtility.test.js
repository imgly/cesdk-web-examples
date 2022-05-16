import { getImageQuality } from './restrictionsUtility';

describe('Returns correct image quality ratio', () => {
  it('with same aspect ratio', () => {
    expect(getImageQuality(20, 20, 10, 10)).toEqual(2);
    expect(getImageQuality(10, 10, 10, 10)).toEqual(1);
    expect(getImageQuality(5, 5, 10, 10)).toEqual(0.5);
  });
  it('with portrait frame aspect ratio', () => {
    // When the frame is portrait format with double the height of the image, the image is stretched
    expect(getImageQuality(20, 20, 10, 20)).toEqual(1);
    expect(getImageQuality(10, 10, 10, 20)).toEqual(0.5);
    expect(getImageQuality(5, 5, 10, 20)).toEqual(0.25);
  });
  it('with landscape frame aspect ratio', () => {
    // When the frame is portrait format with double the height of the image, the image is stretched
    expect(getImageQuality(20, 20, 20, 10)).toEqual(1);
    expect(getImageQuality(10, 10, 20, 10)).toEqual(0.5);
    expect(getImageQuality(5, 5, 20, 10)).toEqual(0.25);
  });
  it('zoomed in with factor 2', () => {
    expect(getImageQuality(20, 20, 10, 10, 2)).toEqual(1);
    expect(getImageQuality(10, 10, 10, 10, 2)).toEqual(0.5);
    expect(getImageQuality(5, 5, 10, 10, 2)).toEqual(0.25);

    expect(getImageQuality(20, 20, 10, 20, 2)).toEqual(0.5);
  });
});
