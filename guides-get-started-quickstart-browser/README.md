# Quickstart Vanilla JS (Manual) - Browser Integration Guide

This example demonstrates multiple approaches for integrating CreativeEditor SDK (CE.SDK) into Vanilla JavaScript projects. It showcases NPM installation, CDN loading, GitHub repository cloning, and both module-based and global variable patterns.

## What This Example Demonstrates

- **NPM + ES Modules**: Modern package management with explicit imports
- **NPM + Global Variables**: Package management with traditional global access
- **CDN + ES Modules**: Direct browser loading with module syntax
- **CDN + Global Variables**: Simple script tag integration
- **GitHub Repository Cloning**: Using pre-built examples as a starting point
- **Headless Integration**: Programmatic content creation without UI

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview built application
- `npm run check:syntax` - TypeScript syntax validation
- `npm run check:lint` - ESLint validation
- `npm run check:format` - Prettier format checking
- `npm run fix:format` - Fix formatting issues
- `npm run capture:hero` - Generate hero screenshots

## Integration Approaches

### 1. NPM Installation

Install CE.SDK as a dependency:
```bash
npm install @cesdk/cesdk-js
```

Import and use:
```javascript
import CreativeEditorSDK from '@cesdk/cesdk-js';
```

### 2. CDN Loading

Load directly from IMG.LY CDN:
```html
<script type="module">
  import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/index.js';
</script>
```

### 3. GitHub Repository

Clone the examples repository:
```bash
git clone https://github.com/imgly/cesdk-web-examples.git
cd cesdk-web-examples/integrate-with-vanilla-js
npm install && npm run dev
```

## Key Features Demonstrated

- **Plugin Architecture**: Clean separation between initialization and logic
- **Grid Layout**: Responsive positioning for multiple demonstrations
- **TypeScript Support**: Full type checking and IntelliSense
- **ESLint Integration**: Deprecated API detection and code quality
- **Hero Screenshot**: Automated documentation image generation

## File Structure

```
├── index.html          # Main HTML page with container
├── index.ts            # CE.SDK initialization and plugin loading
├── browser.ts          # Main plugin with all integration examples
├── utils.ts            # Grid layout utilities
├── scripts/
│   └── capture-hero.mjs # Hero screenshot generation
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite build configuration
└── .eslintrc.cjs       # ESLint rules with deprecation detection
```

## Documentation Integration

This example serves the browser guide at:
`/get-started/vanilla-js/quickstart-yef23s1/browser.mdx`

The documentation references specific code sections using highlight markers:
- `highlight-setup` - Basic CE.SDK initialization
- `highlight-npm-module-setup` - NPM with ES modules
- `highlight-npm-global-setup` - NPM with global variables
- `highlight-cdn-module-setup` - CDN with ES modules
- `highlight-cdn-global-setup` - CDN with global variables
- `highlight-headless-integration` - Programmatic content creation
- `highlight-configuration-example` - Configuration patterns

## License

Requires a valid CE.SDK license key. Get a free trial at: https://img.ly/forms/free-trial