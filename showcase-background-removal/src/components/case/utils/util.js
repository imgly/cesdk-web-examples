export const caseAssetPath = (path, caseId = 'background-removal') =>
  `${process.env.PUBLIC_URL_HOSTNAME}${process.env.PUBLIC_URL}/cases/${caseId}${path}`;
