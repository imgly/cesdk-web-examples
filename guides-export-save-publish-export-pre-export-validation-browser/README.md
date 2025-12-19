# Pre-Export Validation - Browser Example

Demonstrates comprehensive pre-export validation checks in CE.SDK, including placeholder detection, asset verification, and block validity checks before exporting.

## Features

- Find and identify unfilled placeholders
- Check for enabled placeholders that need content
- Verify image and video asset sources
- Validate block states before export
- Display validation results in a user-friendly format

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the example in action.

## What This Example Demonstrates

This example creates a design with intentional validation issues:
- Unfilled placeholder blocks
- Multiple blocks with different states
- Asset references

Then it demonstrates how to:
1. Find all placeholders in the scene
2. Check if placeholders are enabled and need filling
3. Verify asset sources are valid
4. Display validation warnings to users
5. Determine if the design is ready for export

## Local Development with Monorepo

```bash
# Use local CE.SDK build
npm run dev:local

# Build with local CE.SDK
npm run build:local
```

## Documentation

See the full guide at: https://img.ly/docs/cesdk/web/guides/export-save-publish/pre-export-validation
