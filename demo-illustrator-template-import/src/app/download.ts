/**
 * Downloads a file under the given name. The file is fetched first: a browser
 * ignores the `download` name on a link to another origin, and the demo
 * assets are served from one.
 */
export async function downloadFile(url: string, name: string): Promise<void> {
  const blob = await (await fetch(url)).blob();
  const objectURL = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectURL;
  link.download = name;
  link.click();
  URL.revokeObjectURL(objectURL);
}
