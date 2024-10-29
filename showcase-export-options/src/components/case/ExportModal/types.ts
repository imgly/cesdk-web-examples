import { CreativeEngine } from '@cesdk/cesdk-js';

export interface ExportModalState {
  engine: CreativeEngine;
  open: boolean;
  show: () => void;
  hide: () => void;
}

export enum PageAmountType {
  ALL = 'all',
  RANGE = 'range'
}

export enum ResolutionItemValue {
  Small = 'small',
  Original = 'original',
  Large = 'large',
  Huge = 'huge',
  Custom = 'custom'
}

export enum QualityType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  VeryHigh = 'very-height',
  Maximum = 'maximum'
}
