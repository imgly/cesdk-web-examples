// Mock SRT transcriptions for different audio tracks
const MOCK_TRANSCRIPTIONS = {
  // English (Track 0, page, background track video, or "Audio Track 0")
  'eng': `1
00:00:00,160 --> 00:00:01,800
Welcome to CE.SDK.

2
00:00:02,760 --> 00:00:04,880
Export audio from any block.

3
00:00:05,600 --> 00:00:07,920
Generate captions automatically.

4
00:00:08,600 --> 00:00:10,160
Style them as you like.`,

  // German (Track 1 or "Audio Track 1")
  'de': `1
00:00:00,200 --> 00:00:02,100
Willkommen bei CE.SDK.

2
00:00:02,700 --> 00:00:04,970
Exportiere Audio aus jedem Blog.

3
00:00:05,600 --> 00:00:07,940
Generiere automatisch Untertitel.

4
00:00:08,660 --> 00:00:10,670
Gestalte sie nach deinem Geschmack.`,

  // Portuguese (Track 2 or "Audio Track 2")
  'por': `1
00:00:00,170 --> 00:00:01,800
Bem-vindo ao CE.SDK.

2
00:00:02,580 --> 00:00:04,070
Exporta audio de qualquer bloco.

3
00:00:04,790 --> 00:00:06,500
Gera legendas automaticamente.

4
00:00:07,430 --> 00:00:08,690
Estilize-as como desejar.`,
};

export async function transcribeAudio(audioBlob, options = {}) {
  // In a real implementation, you would send the audio to a service like:
  // - AssemblyAI: https://www.assemblyai.com/
  // - OpenAI Whisper: https://platform.openai.com/docs/guides/speech-to-text
  // - AWS Transcribe: https://aws.amazon.com/transcribe/

  // For this demo, we'll use a mock transcription service
  if (options.useMockService !== false) {
    return mockTranscriptionService(audioBlob, options.sourceName);
  }

  // Example real service integration (AssemblyAI)
  if (options.assemblyAIKey) {
    return transcribeWithAssemblyAI(audioBlob, options.assemblyAIKey);
  }

  throw new Error('No transcription service configured');
}

// Mock transcription service that returns sample SRT content
// Returns different transcriptions based on the audio source name
function mockTranscriptionService(audioBlob, sourceName) {
  console.log(`Mock transcribing audio blob of size: ${audioBlob.size} bytes from source: "${sourceName}"`);

  // Determine which language/track to use based on source name
  let language = 'eng'; // Default to English
  let srtContent = MOCK_TRANSCRIPTIONS['eng'];

  if (sourceName) {
    if (sourceName.includes('Audio Track 1') || sourceName.includes('deu')) {
      language = 'de';
      srtContent = MOCK_TRANSCRIPTIONS['de'];
      console.log('→ Detected German (de) based on source name');
    } else if (sourceName.includes('Audio Track 2') || sourceName.includes('por')) {
      language = 'por';
      srtContent = MOCK_TRANSCRIPTIONS['por'];
      console.log('→ Detected Portuguese (por) based on source name');
    } else if (sourceName.includes('Audio Track 3') || sourceName.includes('spa')) {
      language = 'spa';
      srtContent = MOCK_TRANSCRIPTIONS['spa'];
      console.log('→ Detected Spanish (spa) based on source name');
    } else {
      console.log('→ Using default English (eng)');
    }
    // Default case (page, background video, "Audio Track 0", eng) uses English
  }

  console.log('→ Selected language:', language, ', SRT content length:', srtContent ? srtContent.length : 0);

  // Simulate processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        format: 'srt',
        content: srtContent,
        language: language,
        confidence: 0.95
      });
    }, 2000); // Simulate 2 second processing time
  });
}

// Real AssemblyAI integration example
async function transcribeWithAssemblyAI(audioBlob, apiKey) {
  // Step 1: Upload audio to AssemblyAI
  const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'content-type': audioBlob.type
    },
    body: audioBlob
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload audio to AssemblyAI');
  }

  const { upload_url } = await uploadResponse.json();

  // Step 2: Request transcription
  const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      audio_url: upload_url,
      format_text: true,
      punctuate: true,
      format: 'srt'  // Request SRT format directly
    })
  });

  if (!transcriptResponse.ok) {
    throw new Error('Failed to start transcription');
  }

  const transcript = await transcriptResponse.json();

  // Step 3: Poll for completion
  return pollTranscriptionStatus(transcript.id, apiKey);
}

async function pollTranscriptionStatus(transcriptId, apiKey) {
  const statusUrl = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

  while (true) {
    const response = await fetch(statusUrl, {
      headers: {
        'authorization': apiKey
      }
    });

    const result = await response.json();

    if (result.status === 'completed') {
      // Get SRT format
      const srtResponse = await fetch(`${statusUrl}/srt`, {
        headers: {
          'authorization': apiKey
        }
      });

      const srtContent = await srtResponse.text();

      return {
        format: 'srt',
        content: srtContent,
        language: result.language_code,
        confidence: result.confidence
      };
    } else if (result.status === 'error') {
      throw new Error(`Transcription failed: ${result.error}`);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

export function validateSRTFormat(srtContent) {
  const lines = srtContent.trim().split('\n');
  const timestampRegex = /^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/;

  let lineIndex = 0;
  const captions = [];

  while (lineIndex < lines.length) {
    // Skip empty lines
    if (lines[lineIndex].trim() === '') {
      lineIndex++;
      continue;
    }

    // Read sequence number
    const sequenceNumber = parseInt(lines[lineIndex]);
    if (isNaN(sequenceNumber)) {
      console.warn(`Invalid sequence number at line ${lineIndex}: ${lines[lineIndex]}`);
      lineIndex++;
      continue;
    }

    lineIndex++;

    // Read timestamp
    if (lineIndex >= lines.length || !timestampRegex.test(lines[lineIndex])) {
      console.warn(`Invalid timestamp at line ${lineIndex}: ${lines[lineIndex]}`);
      lineIndex++;
      continue;
    }

    const timestamp = lines[lineIndex];
    lineIndex++;

    // Read caption text (can be multiple lines)
    const textLines = [];
    while (lineIndex < lines.length && lines[lineIndex].trim() !== '') {
      textLines.push(lines[lineIndex]);
      lineIndex++;
    }

    captions.push({
      sequence: sequenceNumber,
      timestamp: timestamp,
      text: textLines.join('\n')
    });
  }

  return {
    valid: captions.length > 0,
    captions: captions,
    errors: captions.length === 0 ? ['No valid captions found'] : []
  };
}