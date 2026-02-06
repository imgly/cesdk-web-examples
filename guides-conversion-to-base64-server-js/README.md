# To Base64 - Server Guide

This example demonstrates how to convert CE.SDK exports to Base64-encoded strings for storing in databases, transmitting via APIs, or embedding in data URIs.

## Quick Start

```bash
npm install
npm run dev
```

## Features Demonstrated

- Exporting blocks to Blob using `engine.block.export()`
- Converting Blob to Base64 string using Node.js Buffer
- Working with different MIME types (PNG, JPEG, WebP)
- Creating data URIs for various use cases

## Output

The example exports files to the `output/` directory:
- `to-base64.png` - The raw PNG export
- `base64-png.txt` - PNG as Base64 data URI
- `base64-jpeg.txt` - JPEG as Base64 data URI
- `base64-webp.txt` - WebP as Base64 data URI

## Documentation

See the full guide at: https://img.ly/docs/cesdk/guides/conversion/to-base64/

## License

This example is part of the CE.SDK documentation. See the [CE.SDK License](https://img.ly/docs/cesdk/license/) for usage terms.
