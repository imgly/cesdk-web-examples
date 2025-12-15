# Import Templates from Scene Files - CE.SDK Browser Guide

This example demonstrates how to import and load templates from scene files in CE.SDK.

## What You'll Learn

- Load scenes from .scene file URLs
- Load scenes from .archive (ZIP) URLs
- Apply templates while preserving page dimensions
- Understand the difference between scene formats
- Query scene properties after loading

## Scene File Formats

### .scene Format
- JSON-based scene structure
- References external assets via URLs
- Lightweight text format
- Assets must remain accessible

### .archive Format (ZIP)
- Self-contained package
- Scene file plus embedded assets
- Portable and offline-capable
- Recommended for template distribution

## Running the Example

```bash
npm install
npm run dev
```

## Template Loading Methods

### Load from Archive (Recommended)
```typescript
await engine.scene.loadFromArchiveURL(
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
);
```

### Load from Scene URL
```typescript
await engine.scene.loadFromURL(
  'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
);
```

### Apply Template (Preserve Dimensions)
```typescript
await engine.scene.applyTemplateFromURL(
  'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_instagram_photo_1.scene'
);
```

## Documentation

For more information, see the [CE.SDK Documentation](https://img.ly/docs/cesdk).
