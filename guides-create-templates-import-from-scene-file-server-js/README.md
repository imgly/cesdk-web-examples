# Import Templates from Scene Files (Node.js)

This example demonstrates how to load and import templates from scene files using the CE.SDK headless engine in Node.js.

## Features

- Load scenes from .archive (ZIP) files
- Load scenes from .scene file URLs
- Apply templates while preserving page dimensions
- Export loaded scenes to PNG files
- Headless operation (no UI required)

## Prerequisites

- Node.js 18+ installed
- CE.SDK license key (optional, works in trial mode without it)

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## What This Example Does

1. Initializes the headless CE.SDK engine
2. Loads a template from an archive (ZIP) file
3. Retrieves information about the loaded scene
4. Exports the scene to a PNG file
5. Demonstrates alternative loading methods (commented out)

## Output

The example generates:
- `output-from-archive.png` - PNG export of the loaded template

## Documentation

For more information, see the [Import Templates from Scene Files guide](https://img.ly/docs/cesdk/guides/create-templates/import/from-scene-file/).
