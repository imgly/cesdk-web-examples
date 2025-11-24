# Change UI Font - CE.SDK Browser Guide

This example demonstrates how to customize the font family used throughout the CE.SDK editor interface to match your application's branding.

## Features Demonstrated

- Loading custom fonts from Google Fonts
- Setting the `--ubq-typography-font_family` CSS custom property
- Applying a custom font to all UI elements (panels, buttons, labels, inputs)
- Configuring fallback fonts for reliability

## Running the Example

```bash
npm install
npm run dev
```

Open your browser to [http://localhost:5173](http://localhost:5173)

## Key Concepts

### CSS Custom Property

CE.SDK's UI uses a single CSS custom property that all typography tokens reference:

```css
.ubq-public {
  --ubq-typography-font_family: 'Roboto', sans-serif;
}
```

### Font Loading

The example loads Roboto from Google Fonts in the HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

## Documentation

For complete documentation, see the [Change UI Font guide](https://img.ly/docs/cesdk/web/guides/user-interface/appearance/change-ui-font/).
