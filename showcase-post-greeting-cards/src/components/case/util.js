export const caseAssetPath = (path, caseId = 'post-greeting-cards') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
