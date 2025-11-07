export const caseAssetPath = (path: string, caseId = 'premium-templates') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

export const persistSelectedTemplateToURL = (assetId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('template', assetId);
  window.history.pushState({}, '', url);
};
