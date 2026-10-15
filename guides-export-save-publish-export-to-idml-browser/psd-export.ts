/** Upload the edited scene archive and download the server's PSD package. */
export async function exportPsdArchive(
  archive: Blob,
  endpoint: string
): Promise<{ zip: Blob; warningCount: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/zip',
        Accept: 'application/zip'
      },
      body: archive,
      credentials: 'omit',
      signal: controller.signal
    });
    if (response.status === 504) {
      const timeoutError = new Error('PSD export took too long');
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }
    if (!response.ok) {
      throw new Error(`PSD export failed (${response.status})`);
    }
    if (
      response.headers
        .get('Content-Type')
        ?.split(';')[0]
        .trim()
        .toLowerCase() !== 'application/zip'
    ) {
      throw new Error('PSD export did not return a ZIP package');
    }
    const warningHeader = response.headers.get('X-Export-Warning-Count');
    if (warningHeader === null || !/^\d+$/.test(warningHeader)) {
      throw new Error('PSD export did not return its warning count');
    }
    const warningCount = Number(warningHeader);
    if (!Number.isSafeInteger(warningCount)) {
      throw new Error('PSD export returned an invalid warning count');
    }
    const zip = await response.blob();
    if (zip.size === 0) {
      throw new Error('PSD export returned an empty package');
    }
    return { zip, warningCount };
  } catch (error) {
    if (controller.signal.aborted) {
      const timeoutError = new Error('PSD export took too long');
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
