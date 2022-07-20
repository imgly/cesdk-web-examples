export const caseAssetPath = (path, caseId = 'custom-ui') =>
  `${process.env.REACT_APP_URL_HOSTNAME}${process.env.PUBLIC_URL}/cases/${caseId}${path}`;
