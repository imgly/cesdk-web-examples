import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Video Limitations
 *
 * Demonstrates how to query video processing limitations in CE.SDK:
 * - Querying maximum export size
 * - Monitoring memory usage and availability
 * - Understanding resolution and duration constraints
 * - Validating export feasibility before processing
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene to query environment capabilities
  engine.scene.create();

  // Query the maximum export dimensions supported by this environment
  const maxExportSize = engine.editor.getMaxExportSize();
  console.log('Maximum export size:', maxExportSize, 'pixels');
  // Server environments may have different limits than browser
  // Typical values: 4096, 8192, or 16384 pixels

  // Query current memory consumption (returns BigInt on Node.js)
  const usedMemory = engine.editor.getUsedMemory();
  const usedMemoryMB = (Number(usedMemory) / (1024 * 1024)).toFixed(2);
  console.log('Memory used:', usedMemoryMB, 'MB');

  // Query available memory for video processing (returns BigInt on Node.js)
  const availableMemory = engine.editor.getAvailableMemory();
  const availableMemoryMB = (Number(availableMemory) / (1024 * 1024)).toFixed(
    2
  );
  console.log('Memory available:', availableMemoryMB, 'MB');
  // Server environments typically have more memory than browser tabs

  // Calculate memory utilization percentage
  const totalMemory = Number(usedMemory) + Number(availableMemory);
  const memoryUtilization = ((Number(usedMemory) / totalMemory) * 100).toFixed(
    1
  );
  console.log('Memory utilization:', memoryUtilization, '%');

  // Check if a specific export size is feasible
  const desiredWidth = 3840; // 4K UHD
  const desiredHeight = 2160;
  const canExport4K =
    desiredWidth <= maxExportSize && desiredHeight <= maxExportSize;
  console.log('Can export at 4K UHD (3840x2160):', canExport4K ? 'Yes' : 'No');

  // Before loading large resources, check available memory
  const minRequiredMemory = 500 * 1024 * 1024; // 500 MB minimum
  const hasEnoughMemory = Number(availableMemory) > minRequiredMemory;
  console.log(
    'Has enough memory for large video processing:',
    hasEnoughMemory ? 'Yes' : 'No'
  );

  // Log summary of environment capabilities
  console.log('--- Environment Capabilities Summary ---');
  console.log('Max export dimension:', maxExportSize, 'px');
  console.log('4K UHD support:', canExport4K ? 'Supported' : 'Not supported');
  console.log('Memory available:', availableMemoryMB, 'MB');
  console.log('Memory utilization:', memoryUtilization, '%');

  console.log('\nVideo limitations check completed successfully.');
} finally {
  engine.dispose();
}
