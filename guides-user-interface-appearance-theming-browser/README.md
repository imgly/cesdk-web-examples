# Theming Guide - Browser

This example demonstrates how to customize the visual appearance of the CreativeEditor SDK (CE.SDK) through theming.

## Features

- Setting theme (light, dark, system)
- Setting scale (normal, large, modern)
- Dynamic scale with callback based on viewport
- Custom theme loading via CSS

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Files

- `index.html` - HTML container with custom theme CSS loaded
- `index.ts` - CE.SDK initialization and plugin loading
- `browser.ts` - Main plugin demonstrating theming features
- `custom-theme.css` - Example custom theme with CSS custom properties
- `scripts/capture-hero.mjs` - Hero image capture script

## Documentation

See the [Theming Guide](/docs/guides/user-interface/appearance/theming) for comprehensive documentation.

## Custom Theme Reference

The `custom-theme.css` file serves as a comprehensive reference for all available CSS custom properties that control CE.SDK's appearance. This file documents:

- **130+ CSS Custom Properties**: Complete list of theme variables
- **Color Properties**: Canvas, elevation, foreground, interactive states, borders, effects
- **Typography Properties**: Headline, label, body, input, and button text styles
- **Spacing Properties**: Margins, border radius, and measurements
- **Theme Examples**: Sample dark and pink/purple light theme configurations

While CE.SDK provides built-in light and dark themes that are optimized and production-ready, the custom-theme.css file demonstrates the CSS structure for developers who need to understand the theming system or integrate CE.SDK into existing design systems.

### CSS Structure

```css
.ubq-public[data-ubq-theme='light'][data-ubq-scale='normal'] {
  /* Color properties */
  --ubq-canvas: hsl(320, 30%, 97%);
  --ubq-elevation-1: hsl(320, 25%, 95%);
  /* ... more color properties ... */

  /* Typography properties */
  --ubq-typography-headline-l-size: 16px;
  --ubq-typography-headline-l-line_height: 20px;
  /* ... more typography properties ... */
}
```

**Note**: For production use, we recommend using CE.SDK's built-in themes via `cesdk.ui.setTheme()` API, which provides optimized and tested theme switching.

## Theme API

```typescript
// Set theme
cesdk.ui.setTheme('light' | 'dark' | 'system');

// Get current theme
const theme = cesdk.ui.getTheme(); // Returns 'light' or 'dark'

// Set fixed scale
cesdk.ui.setScale('normal' | 'large' | 'modern');

// Set dynamic scale with callback
cesdk.ui.setScale(({ containerWidth, isTouch }) => {
  return containerWidth < 600 || isTouch ? 'large' : 'normal';
});

// Get current scale
const scale = cesdk.ui.getScale();
```

## License

This example uses CE.SDK which requires a license key for production use.
