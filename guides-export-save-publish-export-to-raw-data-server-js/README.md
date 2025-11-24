# Export to Raw Data (Node.js Server)

This example demonstrates how to export designs to uncompressed RGBA pixel data in Node.js for custom image processing.

## Features

- Export blocks to raw pixel data
- Process pixels with custom algorithms (grayscale conversion)
- Save raw data to files
- Integration pattern with Sharp for image processing

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev
```

The example will:
1. Create a design with an image
2. Export the image to raw RGBA pixel data
3. Apply grayscale processing
4. Save the processed data to `./output/raw-data.bin`

## Related Documentation

See the [Export to Raw Data guide](https://img.ly/docs/cesdk/guides/export-save-publish/export/to-raw-data) for detailed documentation.
