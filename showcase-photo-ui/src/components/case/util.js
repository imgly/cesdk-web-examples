export const caseAssetPath = (path, caseId = 'photo-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
