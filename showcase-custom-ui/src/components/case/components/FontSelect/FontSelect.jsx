import { useEditor } from '../../EditorContext';
import { ReactComponent as FiraSansIcon } from '../../icons/fonts/FiraSans.svg';
import { ReactComponent as ParisienneIcon } from '../../icons/fonts/Parisienne.svg';
import { ReactComponent as RobotoIcon } from '../../icons/fonts/Roboto.svg';
import useStream from '../../lib/streams/useStream';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';

const ALL_FONTS = [
  {
    fontUri: '/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf',
    label: 'Roboto',
    Icon: <RobotoIcon />
  },
  {
    fontUri:
      '/extensions/ly.img.cesdk.fonts/fonts/FiraSans/FiraSans-Regular.ttf',
    label: 'Fira Sans',
    Icon: <FiraSansIcon />
  },
  {
    fontUri:
      '/extensions/ly.img.cesdk.fonts/fonts/Parisienne/Parisienne-Regular.ttf',
    label: 'Parisienne',
    Icon: <ParisienneIcon />
  }
];

const FontSelect = () => {
  const {
    customEngine: {
      changeTextFont,
      selectedTextPropertiesStream,
      getSelectedTextProperties
    }
  } = useEditor();

  const selectedTextProperties = useStream(selectedTextPropertiesStream, () =>
    getSelectedTextProperties()
  );

  return (
    <AdjustmentsBar>
      {ALL_FONTS.map(({ fontUri, Icon }) => (
        <AdjustmentsBarButton
          key={fontUri}
          isActive={fontUri === selectedTextProperties?.['text/fontFileUri']}
          onClick={() => changeTextFont(fontUri)}
        >
          {Icon}
        </AdjustmentsBarButton>
      ))}
    </AdjustmentsBar>
  );
};
export default FontSelect;
