export const caseAssetPath = (path, caseId = 'mobile-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
