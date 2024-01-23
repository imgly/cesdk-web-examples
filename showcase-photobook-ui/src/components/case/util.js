export const caseAssetPath = (path, caseId = 'photobook-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
