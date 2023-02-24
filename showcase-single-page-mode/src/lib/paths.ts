const version = 'showcases';

export const buildDocPath = (path: string) =>
  'https://img.ly/docs/cesdk' + path;
export const buildCodesandboxUrl = (
  showcase: string,
  componentFile = 'CaseComponent.jsx'
) =>
  `https://codesandbox.io/s/github/imgly/cesdk-web-examples/tree/${version}/showcase-${showcase}/?file=/src/components/case/${componentFile}`;
export const buildGithubUrl = (
  showcase: string,
  componentFile = 'CaseComponent.jsx'
) =>
  `https://github.com/imgly/cesdk-web-examples/tree/${version}/showcase-${showcase}/src/components/case/${componentFile}`;

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
