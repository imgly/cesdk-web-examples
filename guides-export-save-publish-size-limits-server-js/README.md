# CE.SDK Size Limits - Server Guide

This example demonstrates how to configure and work with image size limits in CE.SDK Server (Node.js).

## Features

- Reading current `maxImageSize` setting
- Configuring `maxImageSize` for different scenarios (low memory, standard, high quality)
- Observing settings changes
- Understanding export size constraints
- Visual comparison of different size limit configurations

## Size Limit Concepts

### Input Size Limits (maxImageSize)

- **Default**: 4096×4096 pixels
- **Purpose**: Controls maximum resolution at which images are loaded
- **Impact**: Reduces memory footprint, improves performance
- Images exceeding this size are downscaled before rendering

### Output Size Limits (Export)

- **No enforced limit**: CE.SDK doesn't artificially cap export resolution
- **Theoretical maximum**: Up to 16,384×16,384 pixels
- **Practical limits**: Depends on GPU texture size capabilities
- Export may fail if output exceeds GPU capabilities

## Running the Example

```bash
# Install dependencies
npm install

# Run the example
npm run dev

# The result will be exported to ./output/size-limits-result.png
```

## Configuration Options

The example demonstrates different `maxImageSize` configurations:

- **2048px**: Low memory mode (mobile/constrained devices)
- **4096px**: Standard mode (default, universal compatibility)
- **8192px**: High quality mode (professional use, high-end devices)
- **16384px**: Maximum mode (use cautiously, may fail on some GPUs)

## Best Practices

- Default to 4096px for universal compatibility
- Increase cautiously only when necessary (high-end devices, professional workflows)
- Decrease for better performance on mobile/low-memory devices
- Remember: Export size is not limited by `maxImageSize` but by GPU capabilities

## Learn More

- [Size Limits Documentation](https://img.ly/docs/cesdk/)
- [Settings API Reference](https://img.ly/docs/cesdk/api/settings/)
