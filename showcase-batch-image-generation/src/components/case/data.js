import SCENES from './scenes.json';
import { caseAssetPath } from './util';

export const TEMPLATES = {
  portrait: {
    label: 'Portrait',
    sceneString: SCENES.portraitScene,
    previewImagePath: caseAssetPath(`/images/empty_portrait.png`),
    width: 160,
    height: 220,
    outputFormat: 'image/jpeg'
  },
  landscape: {
    label: 'Landscape',
    sceneString: SCENES.landscapeScene,
    previewImagePath: caseAssetPath(`/images/empty_landscape.png`),
    width: 240,
    height: 136,
    outputFormat: 'image/png'
  }
};

export const EMPLOYEES = [
  {
    imagePath: 'photo_imgly_11.png',
    firstName: 'Eray',
    lastName: 'Basar',
    department: 'Co-Founder'
  },
  {
    imagePath: 'photo_imgly_09.png',
    firstName: 'Neslihan',
    lastName: 'Dogan',
    department: 'Marketing'
  },
  {
    imagePath: 'photo_imgly_10.png',
    firstName: 'Daniel',
    lastName: 'Hauschildt',
    department: 'Co-Founder'
  },
  {
    imagePath: 'photo_imgly_08.png',
    firstName: 'Nataliya',
    lastName: 'Chukhrai',
    department: 'Quality Assurance'
  },
  {
    imagePath: 'photo_imgly_06.png',
    firstName: 'Patrick',
    lastName: 'Schneider',
    department: 'Design'
  },
  {
    imagePath: 'photo_imgly_04.png',
    firstName: 'Olga',
    lastName: 'Stadnicka',
    department: 'Quality Assurance'
  },
  {
    imagePath: 'photo_imgly_03.png',
    firstName: 'Sascha',
    lastName: 'Schwabbauer',
    department: 'Mobile Development'
  },
  {
    imagePath: 'photo_imgly_01.png',
    firstName: 'Caroline',
    lastName: 'Scheele-Bild',
    department: 'Support'
  },
  {
    imagePath: 'photo_imgly_05.png',
    firstName: 'Dogus',
    lastName: 'Dolu',
    department: 'Web Development'
  }
];
