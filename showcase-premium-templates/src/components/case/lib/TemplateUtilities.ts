export const caseAssetPath = (path: string, caseId = 'premium-templates') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

export const getTemplateBaseURL = (): string | null => {
  alert(
    'Premium templates CDN URL is not configured. This showcase requires access to premium templates.'
  );
  console.error('Premium templates base URL is not available');
  return null;
};

export const persistSelectedTemplateToURL = (assetId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('template', assetId);
  window.history.pushState({}, '', url);
};
