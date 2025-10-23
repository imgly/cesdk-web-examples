# Print Ready PDF Plugin Example

This example demonstrates how to integrate the Print Ready PDF plugin with CE.SDK to export print-ready PDF/X-3 compliant files.

## What This Example Shows

- Adding custom export buttons to CE.SDK navigation
- Exporting PDFs from CE.SDK engine
- Converting RGB PDFs to CMYK with ICC profiles
- Adding PDF/X-3:2003 compliance markers
- Downloading print-ready files in the browser

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (runs with watermark)
npm run dev

# Build for production
npm run build
```

### Removing the Watermark

By default, this example runs with a CE.SDK watermark. To remove it:

1. Get your free trial license at: https://img.ly/forms/free-trial
2. Open `src/index.ts` and uncomment the license line:
   ```typescript
   const config = {
     license: 'your-license-key-here', // Add your license key here
     ui: {
       // ...
     }
   };
   ```

## Usage

1. Open the example in your browser
2. Create or edit a design in CE.SDK
3. Click "Export Print-Ready PDF" in the navigation bar
4. The file downloads automatically as `design-print-ready.pdf`

## Features Demonstrated

### Custom UI Actions

- Custom button added to CE.SDK navigation bar
- Uses built-in CE.SDK icons
- Async callback for export workflow

### PDF Export

- Single-page export using `engine.block.export()`
- Standard PDF generation from CE.SDK

### Print-Ready Conversion

- RGB to CMYK color space conversion
- FOGRA39 ICC profile embedding (European standard)
- PDF/X-3:2003 compliance markers
- Automatic transparency flattening

### Browser Download

- Object URL creation for Blob downloads
- Proper memory cleanup with `revokeObjectURL()`

## Configuration

### Color Profiles

Change the output profile in `src/index.ts`:

```typescript
const printReadyPDF = await convertToPDFX3(pdfBlob, {
  outputProfile: 'fogra39', // or 'gracol', 'srgb', 'custom'
  title: 'Print-Ready Export'
});
```

Available profiles:

- `fogra39`: European offset printing (ISO Coated v2)
- `gracol`: USA commercial printing (GRACoL 2013)
- `srgb`: Digital distribution
- `custom`: Use your own ICC profile

## Documentation

See the complete guide at: [Print Ready PDF Plugin Documentation](http://img.ly/docs/cesdk/js/plugins/print-ready-pdf+iroalu)
