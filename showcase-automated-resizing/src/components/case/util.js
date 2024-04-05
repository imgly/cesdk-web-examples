export const caseAssetPath = (path, caseId = 'automated-resizing') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
