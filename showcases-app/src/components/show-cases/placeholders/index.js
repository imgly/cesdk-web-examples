import { buildCodesandboxUrl, buildDocPath, buildGithubUrl } from 'lib/paths';
import PlaceholdersCESDK from './PlaceholdersCESDK';

const PLACEHOLDERS_CASE = {
  id: 'placeholders',
  title: 'Placeholders - Lockable Design',
  description:
    'Publish your templates with placeholder images and design restriction for an instant design experience.',
  component: PlaceholdersCESDK,
  documentationLink: buildDocPath('/concepts/placeholders/'),
  githubLink: buildGithubUrl('placeholders', 'PlaceholdersCESDK.jsx'),
  codesandboxLink: buildCodesandboxUrl('placeholders', 'PlaceholdersCESDK.jsx')
};
export default PLACEHOLDERS_CASE;
