import { isEdge, isIE } from '../../lib/utils';

const ResizeCursor = ({ rotation }: { rotation: number }) => {
  if (isEdge() || isIE()) {
    switch (rotation) {
      case 90:
        return 'nwse-resize';
      case 135:
        return 'ns-resize';
      case 180:
        return 'nesw-resize';
      case 225:
        return 'ew-resize';
      case 270:
        return 'nwse-resize';
      case 315:
        return 'ns-resize';
      case 360:
        return 'nesw-resize';
      default:
        return 'move';
    }
  }

  return `url(
    "data:image/svg+xml,%3Csvg style='transform: rotate(${rotation}deg)' width ='22' height ='22' viewBox ='0 0 22 22' fill ='none' xmlns ='http://www.w3.org/2000/svg'%3E%3Cg filter ='url(%23filter0_d)'%3E%3Cpath d ='M13.7 11.1L9.7 15.2L12.5 18H4V9.5L6.9 12.3L10.9 8.3L12.3 6.9L9.5 4H18V12.5L15.2 9.7L13.7 11.1Z' fill ='white'/%3E%3C/g%3E%3Cpath d ='M12.7 10.7L8.3 15.2L10.1 17H5V11.9L6.9 13.8L11.3 9.3L13.8 6.9L11.9 5H17V10.1L15.2 8.3L12.7 10.7Z' fill ='black'/%3E%3Cdefs%3E%3Cfilter id ='filter0_d' x ='0' y ='0' width ='22' height ='22' filterUnits ='userSpaceOnUse' color-interpolation-filters ='sRGB'%3E%3CfeFlood flood-opacity ='0' result ='BackgroundImageFix'/%3E%3CfeColorMatrix in ='SourceAlpha' type ='matrix' values ='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation ='2'/%3E%3CfeColorMatrix type ='matrix' values ='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3CfeBlend mode ='normal' in2 ='BackgroundImageFix' result ='effect1_dropShadow'/%3E%3CfeBlend mode ='normal' in ='SourceGraphic' in2 ='effect1_dropShadow' result ='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 12 12, pointer`;
};

export default ResizeCursor;
