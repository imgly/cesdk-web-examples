import { buildCodesandboxUrl, buildDocPath, buildGithubUrl } from 'lib/paths';
import HeadlessDesignCESDK from './HeadlessDesign';

const HEADLESS_DESIGN_CASE = {
  id: 'headless-design',
  title: 'Image Generation',
  description:
    'Quickly auto-generate variations of your design. Your text and images are changed programmatically for you.',
  component: HeadlessDesignCESDK,
  documentationLink: buildDocPath('/guides/headless/'),
  githubLink: buildGithubUrl('headless-design', 'HeadlessDesignCESDK.jsx'),
  codesandboxLink: buildCodesandboxUrl(
    'headless-design',
    'HeadlessDesignCESDK.jsx'
  )
};
export default HEADLESS_DESIGN_CASE;
