const version = 'main';

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

export const HOSTNAME = process.env.PUBLIC_URL_HOSTNAME;
export const ROUTE_PREFIX =
  process.env.PUBLIC_URL === '.' ? '' : process.env.PUBLIC_URL;
export const buildInternalRoute = (id: string) => `${getBasePath()}/${id}`;
export const buildUrl = (path: string) =>
  `${HOSTNAME}${ROUTE_PREFIX}${path ? `/${path}` : ''}`;

// Currently there is no build in way to get the base path:
// https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration
// > basePath has been removed. The alternative will not be part of useRouter. It has not yet been implemented.
export const getBasePath = (): string => {
  return process.env.PUBLIC_URL as string;
};
export const getPathWithoutBasePath = (path: string): string => {
  const basePath = getBasePath();
  const pathWithoutBasePath = path.startsWith(basePath)
    ? path.slice(basePath.length)
    : path;
  // Remove trailing slash
  if (pathWithoutBasePath.endsWith('/')) {
    return pathWithoutBasePath.slice(0, -1);
  }
  return pathWithoutBasePath;
};
