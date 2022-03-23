// Copied from CE.SDK algorithm / color.ts

import chroma from 'chroma-js';
/*
 * These functions below are being used to calculate the colors defined inside CE.SDK
 * configuration and/or the colors set via the settings panel into our design
 * token system
 * */

const setLightness = (color: string, value = '0') => {
  return chroma(color).set('hsl.l', value);
};

const isDark = (color: string) => {
  return chroma(color).luminance() < 0.5;
};

const getContrastColor = (color: string) => {
  const contrast = isDark(color) ? chroma('white') : chroma('black');
  return contrast;
};

const transfer = (key: string, from: string, to: string) => {
  return chroma(to).set(key, chroma(from).get(key));
};

const transferCL = (from: string, to: string) => {
  // transfer chroma and lightness
  const ltran = transfer('lch.l', from, to).toString();
  return transfer('lch.c', from, ltran);
};

export function generateColorAbstractionTokensBackground(color: string) {
  return {
    '--ubq-canvas': chroma(color).css('hsl'),
    '--ubq-elevation-1': setLightness(color, '+0.05').css('hsl'),
    '--ubq-elevation-2': setLightness(color, '+0.1').css('hsl'),
    '--ubq-elevation-3': setLightness(color, '+0.2').css('hsl'),
    '--ubq-foreground-default': getContrastColor(color).alpha(0.9).css('hsl'),
    '--ubq-foreground-light': getContrastColor(color).alpha(0.7).css('hsl'),
    '--ubq-foreground-info': getContrastColor(color).alpha(0.5).css('hsl'),
    '--ubq-interactive-default': setLightness(color, '+0.15').css('hsl'),
    '--ubq-interactive-hover': setLightness(color, '+0.1').css('hsl'),
    '--ubq-interactive-pressed': setLightness(color, '+0.025').css('hsl'),
    '--ubq-input-default': setLightness(color, '-0.1').css('hsl'),
    '--ubq-input-hover': setLightness(color, '-0.12').css('hsl'),
    '--ubq-border-outline': setLightness(color, '+0.5').alpha(0.1).css('hsl'),
    '--ubq-border-divider': setLightness(color, '+0.5').alpha(0.08).css('hsl'),
    '--ubq-border-contrast': setLightness(color, '+0.5').alpha(0.25).css('hsl'),
    '--ubq-focus-outline': chroma(color).css('hsl'),
    '--ubq-overlay-default': chroma(color).alpha(0.8).css('hsl')
  };
}

export function generateColorAbstractionTokensActive(color: string) {
  return {
    '--ubq-foreground-active': getContrastColor(color).alpha(0.9).css('hsl'),
    '--ubq-interactive-active-default': chroma(color).css('hsl'),
    '--ubq-interactive-active-hover': setLightness(color, '+0.05').css('hsl'),
    '--ubq-interactive-active-pressed': setLightness(color, '-0.05').css('hsl'),
    '--ubq-notice-info': getContrastColor(
      getContrastColor(color).toString()
    ).css('hsl')
  };
}

export function generateColorAbstractionTokensAccent(color: string) {
  return {
    '--ubq-foreground-accent': getContrastColor(color).alpha(1.0).css('hsl'),
    '--ubq-interactive-accent-default': chroma(color).css('hsl'),
    '--ubq-interactive-accent-hover': setLightness(color, '+0.05').css('hsl'),
    '--ubq-interactive-accent-pressed': setLightness(color, '-0.05').css('hsl'),
    '--ubq-focus-default': transferCL(color, '#3355FF').css('hsl'),
    '--ubq-notice-warning': transferCL(color, '#FFBB33').css('hsl'),
    '--ubq-notice-error': transferCL(color, '#DC608E').css('hsl'),
    '--ubq-notice-success': transferCL(color, '#09B48B').css('hsl')
  };
}
