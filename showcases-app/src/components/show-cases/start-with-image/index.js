import { buildCodesandboxUrl, buildDocPath, buildGithubUrl } from 'lib/paths';
import StartWithImageCESDK from './StartWithImageCESDK';

const START_WITH_IMAGE_CASE = {
  id: 'start-with-image',
  title: 'Start with an Image',
  description: 'Select an image and load it directly into a template.',
  component: StartWithImageCESDK,
  documentationLink: buildDocPath('/guides/create-scene-from-image-url/'),
  githubLink: buildGithubUrl('start-with-image', 'StartWithImageCESDK.jsx'),
  codesandboxLink: buildCodesandboxUrl(
    'start-with-image',
    'StartWithImageCESDK.jsx'
  )
};
export default START_WITH_IMAGE_CASE;
