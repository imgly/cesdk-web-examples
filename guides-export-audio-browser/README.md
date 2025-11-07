# Export Audio and Add Captions - CE.SDK Example

This example demonstrates CE.SDK's audio export capabilities and how to integrate with transcription services to automatically generate captions.

## Features

- **Audio Export**: Extract audio from any block type (pages, video fills, audio blocks, tracks)
- **Multiple Formats**: Export as WAV (uncompressed) or MP4 (compressed)
- **Progress Tracking**: Real-time feedback during export operations
- **Transcription Integration**: Mock service for demo, ready for real services
- **Automatic Captions**: Import SRT/VTT captions with synchronized timing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your CE.SDK license key in `src/initializeEngine.js`:
```javascript
license: 'YOUR_CESDK_LICENSE_KEY',
```

3. Start the development server:
```bash
npm start
```

## Usage

1. **Load Sample Video**: Click to load a sample video with audio
2. **Find Audio Sources**: Discovers all blocks containing audio
3. **Export Audio**: Extracts audio from selected source
4. **Transcribe**: Processes audio with mock transcription service
5. **Add Captions**: Imports generated captions to the scene
6. **Run Full Workflow**: Executes all steps automatically

## Code Highlights

The code includes highlight markers for documentation:

- `highlight-init-audio`: Engine initialization
- `highlight-find-audio-sources`: Finding audio blocks
- `highlight-export-audio`: Audio export implementation
- `highlight-transcription-service`: Service integration
- `highlight-import-captions`: Caption import
- `highlight-complete-workflow`: Full workflow

## Production Integration

For production use, replace the mock transcription service with real APIs:

### AssemblyAI
```javascript
const transcription = await transcribeAudio(audioBlob, {
  useMockService: false,
  assemblyAIKey: 'YOUR_ASSEMBLYAI_KEY'
});
```

### OpenAI Whisper
See `transcriptionService.js` for integration example.

### AWS Transcribe
Use AWS SDK for cloud-based transcription.

## Files Structure

```
├── index.html                  # Main HTML file
├── src/
│   ├── index.js               # Application entry point
│   ├── initializeEngine.js    # CE.SDK initialization
│   ├── findAudioSources.js    # Audio source detection
│   ├── exportAudio.js         # Audio export functionality
│   ├── transcriptionService.js # Transcription integration
│   ├── importCaptions.js      # Caption import
│   └── completeWorkflow.js    # Complete workflow implementation
├── package.json
└── vite.config.js
```

## License

MIT