export const caseAssetPath = (path, caseId = 'photo-book-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
