# AI Editor Specification

## Overview
The AI editor is a modular showcase application that demonstrates AI-powered creative editing capabilities. It supports multiple editing modes (Design, Video, and Photo) with mode-specific configurations and initialization logic extracted into separate files for better maintainability and extensibility.

## Current Architecture

### Directory Structure
```
src/components/show-cases/ai-editor/
├── CaseComponent.jsx     # Main component handling mode switching and base configuration
├── modes/
│   ├── index.js         # Exports all modes and MODE_OPTIONS array
│   ├── design.js        # Design mode configuration and initialization
│   ├── video.js         # Video mode configuration and initialization
│   └── photo.js         # Photo mode configuration and initialization
├── components/
│   └── AiProviderPanel.jsx  # AI provider selection UI
├── lib/
│   ├── CreativeEditor.jsx          # CE.SDK wrapper component
│   ├── PhotoEditorUIConfig.tsx     # Photo editor UI configuration and setup
│   ├── CreativeEngineUtils.js      # Helper functions for engine operations
│   └── loadAssetSourceFromContentJSON.ts  # Asset source loading utility
├── assets/
│   └── Apps.json        # Photo editor apps configuration (remove background)
├── util/
│   └── photo-util.js    # Photo editor utility functions
└── providers.js         # AI provider configurations
```

### Mode Configuration Interface
Each mode file exports an object with the following structure:
```javascript
export default {
  name: 'ModeName',           // Display name used in UI and URL parameters
  sceneMode: 'SceneMode',     // Scene mode passed to addDemoAssetSources
  cesdkConfig: {              // CE.SDK configuration (excluding license and baseURL)
    featureFlags: {},
    callbacks: {},
    ui: {}
  },
  initialize: async (instance, modeContext, createMiddleware) => {
    // Complete initialization logic for the mode
  }
}
```

### Current Modes

#### 1. Design Mode (`modes/design.js`)
- **Name**: 'Design'
- **Scene**: Loads `ai_editor_design_v3.archive`
- **Configuration**:
  - Feature flags: `archiveSceneEnabled: true`, `dangerouslyDisableVideoSupportCheck: false`
  - Callbacks: `onUpload: 'local'`, `onExport: 'download'`
  - UI: Export action enabled
- **Initialization**:
  - Adds default and demo asset sources
  - Configures UI dock order with AI apps dock at the top
  - Sets canvas menu order for AI text and image options
  - Disables preview and placeholder features
  - Loads design scene archive
  - Configures all AI providers (text2text, text2image, image2image)
  - Adds AI generation history to asset libraries (image)

#### 2. Video Mode (`modes/video.js`)
- **Name**: 'Video'
- **Scene**: Loads `ai_editor_video.archive`
- **Configuration**: Identical to Design mode
- **Initialization**: Identical to Design mode except:
  - Loads video scene archive instead of design
  - Includes additional AI providers (text2video, image2video, text2speech, text2sound)
  - Adds AI generation history to video and audio asset libraries

#### 3. Photo Mode (`modes/photo.js`)
- **Name**: 'Photo'
- **Scene**: Creates dynamic photo editing scene from image URL
- **Configuration**:
  - Role: 'Adopter', Theme: 'dark'
  - Feature flags: `archiveSceneEnabled: false`, `dangerouslyDisableVideoSupportCheck: false`
  - Callbacks: `onUpload: 'local'`, `onExport: 'download'`
  - UI: Custom photo editor layout with inspector on left, PNG export format
  - Custom crop presets libraries for pages and blocks
- **Initialization**:
  - Adds default and demo asset sources
  - Initializes photo editing scene with Unsplash image
  - Sets up custom dock with crop, adjustment, filter, text, shapes, and apps buttons
  - Configures inspector bar to hide/show based on selection
  - Loads background removal app from Apps.json
  - Sets up photo-specific UI translations and interactions

### Main Component (`CaseComponent.jsx`)

#### Responsibilities
1. **Mode Context Management**
   - Reads mode from URL query parameter
   - Validates and sets default mode (currently always 'Design')
   - Updates URL when mode changes

2. **Base Configuration**
   - Sets `license` from environment variable
   - Sets `baseURL` for local development
   - Merges mode-specific `cesdkConfig`

3. **CE.SDK Initialization**
   - Sets global `imgly` for testing (if enabled)
   - Delegates to mode's `initialize` function
   - Passes `createMiddleware` function for rate limiting

4. **UI Rendering**
   - Segmented control for mode switching
   - CreativeEditor component with configuration
   - AI provider panel for provider selection

#### State Management
- `cesdk`: Creative Editor instance
- `modeContext`: Current mode and AI providers
- URL synchronization via Next.js router

### AI Provider System

#### Provider Categories
- **text2text**: Text generation and transformation
- **text2image**: Image generation from text prompts
- **image2image**: Image transformation and editing
- **text2video**: Video generation from text (Video mode only)
- **image2video**: Video generation from images (Video mode only)
- **text2speech**: Speech synthesis (Video mode only)
- **text2sound**: Sound effect generation (Video mode only)

#### Provider Configuration
- Providers are created by `createAIProviders()` function
- Each provider can be selected/deselected via the AI provider panel
- Selected providers are passed to the AI Apps plugin
- Middleware includes rate limiting and error handling

### Features and Capabilities

#### Common Features (Both Modes)
- AI-powered text generation and editing
- AI image generation and transformation
- Asset library integration with generation history
- Export functionality
- Provider selection and configuration
- Rate limiting for demo environment

#### Mode-Specific Features
- **Design Mode**: Optimized for static design creation with AI-powered generation
- **Video Mode**: Additional video and audio generation capabilities
- **Photo Mode**: Professional photo editing with crop, filters, adjustments, and background removal

### URL Parameter Handling
- Query parameter `?mode=Design`, `?mode=Video`, or `?mode=Photo` sets the active mode
- Invalid parameters default to 'Design' mode
- URL updates automatically when switching modes via UI

### Extensibility
The current architecture enables:
1. Easy addition of new modes by creating new files in `modes/`
2. Mode-specific UI configurations via `cesdkConfig`
3. Mode-specific initialization logic via `initialize` function
4. Different AI provider sets per mode
5. Custom scene loading per mode

### Photo Mode Architecture

#### Photo Editor Integration
The Photo mode represents a complete integration of the photo-editor-ui showcase into the AI editor architecture. All required files have been copied and adapted to maintain self-containment within the ai-editor directory:

#### Key Components
- **PhotoEditorUIConfig.tsx**: Complete photo editor setup including dock configuration, inspector bar management, and scene initialization
- **CreativeEngineUtils.js**: Helper functions for image size detection and canvas operations
- **loadAssetSourceFromContentJSON.ts**: Utility for loading custom asset sources (Apps.json)
- **Apps.json**: Configuration for background removal app integration
- **photo-util.js**: Asset path utilities adapted for ai-editor directory structure

#### Photo Mode Features
- **Scene Creation**: Dynamically creates photo editing scene from image URL instead of loading archives
- **Custom Dock**: Crop, Adjustments, Filters, Text, Shapes, and Apps buttons
- **Background Removal**: Integrated `@imgly/background-removal` library via Apps system
- **Smart Inspector**: Context-aware inspector bar that shows/hides panels based on selection
- **Crop Integration**: Custom crop button that enters crop mode and opens crop panel
- **Asset Management**: Loads custom apps from Apps.json with proper asset path resolution

#### Self-Containment
- No relative imports to other showcase directories
- All required files copied into ai-editor structure
- External npm dependencies (like `@imgly/background-removal`) preserved
- Asset paths updated to use ai-editor directory structure
- Independent of photo-editor-ui showcase implementation

### Technical Notes
- All mode initialization code is duplicated between modes (by design for isolation)
- The `createMiddleware` function is passed from the main component to maintain hidden implementation details
- Mode switching triggers a full re-initialization of the Creative Editor
- AI provider configuration persists across mode switches within the same session
- Photo mode operates independently of AI providers but could be enhanced with AI features in the future
