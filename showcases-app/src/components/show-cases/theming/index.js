import { buildCodesandboxUrl, buildDocPath, buildGithubUrl } from 'lib/paths';
import ThemingCESDK from './ThemingCESDK';
import ThemingConfig from './ThemingConfig';

const THEMING_CASE = {
  id: 'theming',
  title: 'Editor Theming',
  description: 'Adjust the UI to fit your CI.',
  component: ThemingCESDK,
  availableConfig: {
    theme: { default: 'light', availableValues: ['light', 'dark', 'custom'] },
    scale: { default: 'normal', availableValues: ['normal', 'large'] },
    backgroundColor: { default: null },
    activeColor: { default: null },
    accentColor: { default: null }
  },
  configuratorComponent: ThemingConfig,
  documentationLink: buildDocPath('/configuration/ui/theming/'),
  githubLink: buildGithubUrl('theming', 'ThemingCESDK.jsx'),
  codesandboxLink: buildCodesandboxUrl('theming', 'ThemingCESDK.jsx')
};
export default THEMING_CASE;
