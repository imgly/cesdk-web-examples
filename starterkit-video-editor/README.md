# Video Editor Starter Kit

Create and edit videos for your web app—trim clips, add text, apply transitions, and export to MP4. Runs entirely in the browser with no server dependencies.

## Pre-requisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-video-editor-web.git
```

### Install Dependencies

```bash
cd starterkit-video-editor-web
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
// Create a blank video scene
await cesdk.createVideoScene();

// Load from a template archive
await cesdk.loadFromArchiveURL('https://example.com/video-template.zip');

// Load from a scene file
await cesdk.loadFromURL('https://example.com/scene.json');

// Load from a video URL
await cesdk.createFromVideo('https://example.com/video.mp4');
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
  de: { 'common.export': 'Exportieren' }
});
cesdk.i18n.setLocale('de');
```

See [Localization](https://img.ly/docs/cesdk/web/ui-styling/localization/) for supported languages and translation keys.

## Architecture

```
starterkit-video-editor-web/
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

- **Video Trimming** – Cut and arrange video clips on timeline
- **Text Overlays** – Add animated text and titles
- **Transitions** – Smooth transitions between clips
- **Audio** – Add background music and sound effects
- **Stickers & Graphics** – Overlay graphics and animations
- **Export** – MP4 video with configurable quality

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Video doesn't play | Check browser autoplay policies and video format (MP4, WebM) |
| Watermark appears | Add your license key or [get a free trial](https://img.ly/forms/free-trial) |

## Documentation

For complete integration guides and API reference, visit the [Video Editor Documentation](https://img.ly/docs/cesdk/web/prebuilt-solutions/video-editor+9e533a/).
