const version = 'v1.4.1';

export const buildDocPath = (path: string) =>
  'https://img.ly/docs/cesdk/web' + path;
export const buildCodesandboxUrl = (showcase: string, componentFile: string) =>
  `https://codesandbox.io/s/github/imgly/cesdk-web-examples/tree/${version}/showcases-app/?file=src/components/show-cases/${showcase}/${componentFile}`;
export const buildGithubUrl = (showcase: string, componentFile: string) =>
  `https://github.com/imgly/cesdk-web-examples/tree/${version}/showcases-app/src/components/show-cases/${showcase}/${componentFile}`;

export const HOSTNAME = process.env.REACT_APP_URL_HOSTNAME;
export const ROUTE_PREFIX =
  process.env.PUBLIC_URL === '.' ? '' : process.env.PUBLIC_URL;
export const buildInternalRoute = (id: string) => `${ROUTE_PREFIX}/${id}`;
export const buildUrl = (path: string) => `${HOSTNAME}${ROUTE_PREFIX}/${path}`;

export const EXTERNAL_PATHS = {
  logoLink: 'https://img.ly/',
  freeTrial: 'https://img.ly/free-trial',
  contactSalesLink: 'https://img.ly/forms/contact-sales',
  imprintLink: 'https://img.ly/imprint',
  privacyLink: 'https://img.ly/privacy-policy'
};
