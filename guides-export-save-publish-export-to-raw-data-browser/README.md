# Export to Raw Data - Browser Guide Example

This example demonstrates how to export CE.SDK designs to raw pixel data (RGBA format) using the `application/octet-stream` MIME type.

## Features Demonstrated

- Exporting blocks to raw RGBA pixel data
- Converting raw data to ImageData for canvas display
- Custom pixel manipulation (grayscale, invert, brightness)
- Accessing individual pixels
- Performance comparison with standard formats

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/index.ts` - CE.SDK initialization and plugin loading
- `src/browser.ts` - Main example plugin with raw data export demonstrations
- `src/utils.ts` - Grid layout utilities
- `index.html` - HTML entry point

## License

This example requires a valid CE.SDK license. Get a free trial at https://img.ly/forms/free-trial
