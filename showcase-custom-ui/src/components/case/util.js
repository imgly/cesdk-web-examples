export const caseAssetPath = (path, caseId = 'custom-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
