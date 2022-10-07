import { configFromParams, searchParamsFromState } from 'lib/routing';

it('searchParamsFromState creates search parameters', () => {
  expect(searchParamsFromState({ theme: 'en' }).toString()).toEqual(
    new URLSearchParams('c_theme=en').toString()
  );
  expect(searchParamsFromState({ theme: 'en' }).toString()).toEqual(
    'c_theme=en'
  );
});
it('searchParamsFromState underscores parameters', () => {
  expect(searchParamsFromState({ activeColor: '#fff' }).toString()).toEqual(
    'c_active_color=%23fff'
  );
});

it('configFromParams uses default parameters', () => {
  expect(
    configFromParams(
      {
        theme: { default: 'light', availableValues: ['light', 'dark', ''] },
        scale: { default: 'normal', availableValues: ['normal', 'large'] },
        backgroundColor: { default: null },
        activeColor: { default: null },
        accentColor: { default: null }
      },
      {}
    )
  ).toEqual({
    theme: 'light',
    scale: 'normal',
    backgroundColor: null,
    activeColor: null,
    accentColor: null
  });
});

it('configFromParams uses parameters', () => {
  expect(
    configFromParams(
      {
        theme: { default: 'light', availableValues: ['light', 'dark', ''] },
        scale: { default: 'normal', availableValues: ['normal', 'large'] },
        backgroundColor: { default: null },
        activeColor: { default: null },
        accentColor: { default: null }
      },
      { c_theme: 'light', c_scale: '123', c_background_color: '#fff' }
    )
  ).toEqual({
    theme: 'light',
    scale: 'normal', // 123 is ignored
    backgroundColor: '#fff',
    activeColor: null,
    accentColor: null
  });
});
it('configFromParams discards invalid parameters', () => {
  expect(
    configFromParams(
      {
        theme: { default: 'light', availableValues: ['light', 'dark', ''] },
        scale: { default: 'normal', availableValues: ['normal', 'large'] },
        backgroundColor: { default: null },
        activeColor: { default: null },
        accentColor: { default: null }
      },
      { c_theme: 'dark', maliciousParam: '123' }
    )
  ).toEqual({
    theme: 'dark',
    scale: 'normal',
    backgroundColor: null,
    activeColor: null,
    accentColor: null
  });
});
