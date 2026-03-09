# Content Moderation Server Guide

This example demonstrates how to implement automated content moderation in CE.SDK for Node.js to detect and flag potentially inappropriate images and text in designs.

## Features

- Headless server-side content validation
- Find all image and text blocks in a design
- Extract image URLs and text content
- Integrate with external moderation APIs
- Validate content before export
- Display validation results with severity levels
- Command-line execution

## Prerequisites

- Node.js 18+ installed
- CE.SDK license key ([get a free trial](https://img.ly/forms/free-trial))

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env` and add your CE.SDK license key:

```
CESDK_LICENSE=your_license_key_here
```

## Usage

Run the example:

```bash
npm start
```

Or run in development mode with auto-reload:

```bash
npm run dev
```

## How It Works

1. **Initialize Engine**: Create a headless CE.SDK engine instance
2. **Create Design**: Build a sample design with images and text
3. **Find Content**: Locate all images and text blocks
4. **Check Moderation**: Call moderation APIs for each content item
5. **Display Results**: Show violations, warnings, and passed checks
6. **Export Control**: Block export if violations detected

## Integration with Real APIs

The example uses mock moderation APIs. To integrate with real services:

1. **Replace Mock Functions**: Update `checkImageContentAPI()` and `checkTextContentAPI()`
2. **Add API Configuration**: Set environment variables for API endpoints and keys
3. **Handle Errors**: Add proper error handling and retry logic
4. **Implement Caching**: Use Redis or similar for production caching

### Supported Services

- **Image Moderation**: Sightengine, AWS Rekognition, Google Vision AI
- **Text Moderation**: OpenAI Moderation API, Perspective API, Azure Content Moderator

## Documentation

For the complete guide, see: [Moderate Content](https://img.ly/docs/cesdk/node/guides/rules/moderate-content/)

## License

This example requires a valid CE.SDK license. Get a free trial at: https://img.ly/forms/free-trial
