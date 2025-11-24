# Export with a Color Mask - Browser Guide

This example demonstrates how to export design blocks with color masking in CE.SDK. Color mask export allows you to exclude specific colors from your exported images by converting them to transparency, while also generating a separate alpha mask file.

## Features Demonstrated

- Basic color mask export with specified RGB colors
- Converting RGB values from 0-255 to 0.0-1.0 format
- Export format options (PNG, WEBP) with compression settings
- Exporting different block types (pages, groups, individual blocks)
- Common use cases:
  - Removing registration marks from print workflows
  - Creating transparency from background colors
  - Generating alpha masks for compositing

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to view the example

## Code Structure

- `index.html` - HTML container for CE.SDK
- `index.ts` - CE.SDK initialization and plugin loading
- `browser.ts` - Main example implementation with color mask exports
- `utils.ts` - Grid layout utilities for demonstrations

## API Used

- `block.exportWithColorMask(handle, r, g, b, options)` - Export with color masking
- `block.addImage()` - Add image blocks
- `block.create()` - Create graphic blocks
- `block.createFill()` - Create color fills
- `block.setColor()` - Set fill colors

## Learn More

- [Export with Color Mask Guide](https://img.ly/docs/cesdk/export-save-publish/export/with-color-mask-4f868f/)
- [Export Overview](https://img.ly/docs/cesdk/export-save-publish/export/overview-9ed3a8/)
- [CE.SDK Documentation](https://img.ly/docs/cesdk/)
