/**
 * Icon - Renders SVG icons from public/icons folder
 */
import type { CSSProperties } from 'react';
import { resolveAssetPath } from '../resolveAssetPath';

type IconName =
  | 'Ai2Psd'
  | 'AiFile'
  | 'Arrow'
  | 'Cesdk'
  | 'Download'
  | 'Edit'
  | 'Error'
  | 'PsdFile';

interface IconProps {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, className, style }: IconProps) {
  return (
    <img
      src={resolveAssetPath(`/icons/${name}.svg`)}
      alt=""
      className={className}
      style={style}
    />
  );
}
