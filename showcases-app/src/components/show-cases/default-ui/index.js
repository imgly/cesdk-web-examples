import { buildCodesandboxUrl, buildDocPath, buildGithubUrl } from 'lib/paths';
import DefaultUICESDK from './DefaultUICESDK';

const DEFAULT_UI_CASE = {
  id: 'default-ui',
  title: 'Default UI – Edit Templates',
  description:
    'Experience our default editor. A easy to use design editor for layout, text and images.',
  component: DefaultUICESDK,
  documentationLink: buildDocPath('/configuration/basics/'),
  githubLink: buildGithubUrl('default-ui', 'DefaultUICESDK.jsx'),
  codesandboxLink: buildCodesandboxUrl('default-ui', 'DefaultUICESDK.jsx')
};
export default DEFAULT_UI_CASE;
