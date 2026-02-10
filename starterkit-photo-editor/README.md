# Photo Editor Starter Kit

Professional photo editing for your web app—crop, filter, adjust, and remove backgrounds. Runs entirely in the browser with no server dependencies.

## Pre-requisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-photo-editor-web.git
```

### Install Dependencies

```bash
cd starterkit-photo-editor-web
npm install
```

### Download Assets

CE.SDK requires engine assets (fonts, icons, UI elements) served from your `public/` directory.

```bash
curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/imgly-assets.zip
unzip imgly-assets.zip -d public/
rm imgly-assets.zip
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Configuration

### Loading Content

Load content into the editor using one of these methods:

```typescript
// Load from an image URL
await cesdk.createFromImage('https://example.com/photo.jpg');

// Load from a template archive
await cesdk.loadFromArchiveURL('https://example.com/template.zip');

// Create a blank canvas
await cesdk.createDesignScene();

// Load from a scene file
await cesdk.loadFromURL('https://example.com/scene.json');
```

See [Open the Editor](https://img.ly/docs/cesdk/web/guides/open-editor/) for all loading methods.

### Theming

```typescript
cesdk.ui.setTheme('dark'); // 'light' | 'dark' | 'system'
```

See [Theming](https://img.ly/docs/cesdk/web/ui-styling/theming/) for custom color schemes and styling.

### Localization

```typescript
cesdk.i18n.setTranslations({
  de: { 'actions.export.image': 'Foto herunterladen' }
});
cesdk.i18n.setLocale('de');
```

See [Localization](https://img.ly/docs/cesdk/web/ui-styling/localization/) for supported languages and translation keys.

## Architecture

```
starterkit-photo-editor-web/
├── src/
│   ├── index.ts              # Application entry point
│   └── imgly/
│       ├── index.ts          # Editor initialization
│       ├── config/
│       │   ├── plugin.ts         # Main plugin orchestration
│       │   ├── actions.ts        # Load, Save, Export actions
│       │   ├── features.ts       # Feature toggles
│       │   ├── settings.ts       # Engine behavior
│       │   ├── i18n.ts           # Internationalization
│       │   └── ui/               # UI layout configuration
│       └── plugins/
│           └── background-removal.ts
├── public/                   # Static assets
├── package.json
└── vite.config.ts
```

## Key Capabilities

- **Transform** – Crop, rotate, resize, and flip images
- **Filters** – Color grading with LUT filters and adjustments
- **Background Removal** – AI-powered, runs entirely in browser
- **Text Overlays** – Typography with fonts and effects
- **Asset Libraries** – Stickers, shapes, and custom graphics
- **Export** – PNG, JPEG, PDF with quality controls

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Watermark appears | Add your license key or [get a free trial](https://img.ly/forms/free-trial) |

## Documentation

For complete integration guides and API reference, visit the [Photo Editor Documentation](https://img.ly/docs/cesdk/web/prebuilt-solutions/photo-editor+42ccb2/).
