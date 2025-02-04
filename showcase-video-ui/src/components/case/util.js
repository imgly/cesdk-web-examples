export const caseAssetPath = (path, caseId = 'video-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
