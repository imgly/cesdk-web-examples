export const caseAssetPath = (path, caseId = 'headless-design') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
