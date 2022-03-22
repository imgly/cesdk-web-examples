import { buildCodesandboxUrl, buildDocPath, buildGithubUrl } from 'lib/paths';
import LanguageCESDK from './LanguageCESDK';
import LanguageConfig from './LanguageConfig';

const LANGUAGE_CASE = {
  id: 'language',
  title: 'Internationalization',
  description: 'Experience the editor in any language.',
  component: LanguageCESDK,
  availableConfig: {
    locale: { default: 'en', availableValues: ['en', 'de'] }
  },
  configuratorComponent: LanguageConfig,
  documentationLink: buildDocPath('/configuration/i18n/'),
  githubLink: buildGithubUrl('language', 'LanguageCESDK.jsx'),
  codesandboxLink: buildCodesandboxUrl('language', 'LanguageCESDK.jsx')
};
export default LANGUAGE_CASE;
