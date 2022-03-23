import SegmentedControl from 'components/ui/SegmentedControl/SegmentedControl';
import { ColorPicker } from 'components/ui/ColorPicker/ColorPicker';

const setCustomColor = (config, newAttributes) => ({
  ...config,
  theme: 'custom',
  backgroundColor: config.backgroundColor || '',
  activeColor: config.activeColor || '',
  accentColor: config.accentColor || '',
  ...newAttributes
});

const themeColors = {
  light: {
    backgroundColor: 'hsla(0, 50%, 100%, 0.6)',
    activeColor: 'hsla(210, 60%, 5%, 0.85)',
    accentColor: 'rgba(61, 92, 245, 0.8)'
  },
  dark: {
    backgroundColor: 'hsla(0, 0%, 100%, 0.1)',
    activeColor: 'hsla(0, 0%, 100%, 0.88)',
    accentColor: 'rgba(61, 92, 245, 0.8)'
  }
};

const ThemingConfig = ({ onChange, config }) => (
  <div className="space-y-2">
    <SegmentedControl
      label="UI Scaling"
      options={[
        { label: 'Normal', value: 'normal' },
        { label: 'Large', value: 'large' }
      ]}
      value={config.scale}
      name="scale"
      onChange={(value) =>
        onChange({
          ...config,
          scale: value
        })
      }
    />
    <hr />
    <SegmentedControl
      label="Theme"
      options={[
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' }
      ]}
      value={config.theme}
      name="theme"
      onChange={(value) =>
        onChange({
          ...config,
          theme: value,
          backgroundColor: '',
          activeColor: '',
          accentColor: ''
        })
      }
    />
    <ColorPicker
      label="Background"
      value={
        config.backgroundColor || themeColors[config.theme]?.backgroundColor
      }
      name="backgroundColor"
      onChange={(value) => {
        onChange(setCustomColor(config, { backgroundColor: value }));
      }}
      presetColors={['#DCDFE1', '#230D38', '#242623', '#FCEFEB', '#060709']}
    />
    <ColorPicker
      label="Active"
      value={config.activeColor || themeColors[config.theme]?.activeColor}
      name="activeColor"
      onChange={(value) =>
        onChange(setCustomColor(config, { activeColor: value }))
      }
      presetColors={['#5D6266', '#D142A3', '#BBC6A4', '#F4BCAC', '#4D5E6D']}
    />
    <ColorPicker
      label="Accent"
      value={config.accentColor || themeColors[config.theme]?.accentColor}
      name="accentColor"
      onChange={(value) =>
        onChange(setCustomColor(config, { accentColor: value }))
      }
      presetColors={['#3E4044', '#66D3EB', '#F6CE4B', '#265E7A', '#D0FDEB']}
    />
  </div>
);
export default ThemingConfig;
