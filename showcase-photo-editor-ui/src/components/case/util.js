export const caseAssetPath = (path, caseId = 'photo-editor-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
