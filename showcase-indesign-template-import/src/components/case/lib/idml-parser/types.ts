import { GradientColorStop } from '@cesdk/cesdk-js';

export type RGBA = [r: number, g: number, b: number, a: number];

export type CMYK = [c: number, m: number, y: number, k: number];

export type IDML = Record<string, Document>;

export type Gradient = {
  type:
    | '//ly.img.ubq/fill/gradient/linear'
    | '//ly.img.ubq/fill/gradient/radial'
    | '//ly.img.ubq/fill/gradient/conical';
  stops: GradientColorStop[];
};

export interface Vector2 {
  x: number;
  y: number;
}
