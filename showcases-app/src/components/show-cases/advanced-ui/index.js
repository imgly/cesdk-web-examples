import AdvancedUICESDK from './AdvancedUICESDK';
import { buildCodesandboxUrl, buildDocPath, buildGithubUrl } from 'lib/paths';

const ADVANCED_UI_CASE = {
  id: 'advanced-ui',
  title: 'Advanced UI – Create Templates',
  description:
    'Our editor variant for professional users. Granular control over your designs.',
  component: AdvancedUICESDK,
  documentationLink: buildDocPath('/configuration/ui/elements/'),
  githubLink: buildGithubUrl('advanced-ui', 'AdvancedUICESDK.jsx'),
  codesandboxLink: buildCodesandboxUrl('advanced-ui', 'AdvancedUICESDK.jsx')
};
export default ADVANCED_UI_CASE;
