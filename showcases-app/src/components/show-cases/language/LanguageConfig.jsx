const AVAILABLE_LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'German', value: 'de' }
];
const LanguageConfig = ({ onChange, config }) => (
  <div className="flex justify-between">
    <label htmlFor="language">Language</label>
    <div className="select-wrapper select-wrapper--small">
      <select
        name="language"
        id="language"
        value={config.locale}
        onChange={(e) =>
          onChange({
            ...config,
            locale: e.target.value
          })
        }
      >
        {AVAILABLE_LANGUAGES.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  </div>
);
export default LanguageConfig;
