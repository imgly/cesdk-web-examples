export const caseAssetPath = (path, caseId = 'apparel-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
