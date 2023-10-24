import { DesignBlockType, type AssetResult } from '@cesdk/cesdk-js';
import CreativeEngine, { type Configuration } from '@cesdk/engine';
import _ from 'lodash';

export const addCutoutAssetLibraryDemoConfiguration = (
  config: Partial<Configuration>
) => {
  _.set(config, "i18n.en['libraries.cutout-entry.label']", 'Cutouts');
  const oldEntriesFunction = _.get(
    config,
    'ui.elements.libraries.insert.entries',
    (defaultEntries: any) => defaultEntries
  );
  _.set(
    config,
    'ui.elements.libraries.insert.entries',
    (defaultEntries: any) => {
      return [
        {
          id: 'cutout-entry',
          sourceIds: ['ly.img.cutout'],
          icon: getLibraryIcon,
          gridColumns: 2,
          cardLabel: (asset: AssetResult) => {
            if (asset.id === 'cutout-selection') {
              return 'Generate from Selection';
            }
            return undefined;
          },
          cardLabelStyle: (asset: AssetResult) => {
            if (asset.id === 'cutout-selection') {
              return {
                lineHeight: 'var(--ubq-typography-label-m-line_height)',
                letterSpacing: 'var(--ubq-typography-label-m-letter_spacing)',
                fontFamily: 'var(--ubq-typography-label-m-font_family)',
                fontWeight: 'var(--ubq-typography-label-m-weight)',
                WebkitLineClamp: '2',
                fontSize: '12px'
              };
            }
            return {};
          },
          cardStyle: (asset: AssetResult) => {
            if (asset.id === 'cutout-selection') {
              return {};
            }
            return {
              padding: '4px'
            };
          },
          cardBackgroundPreferences: [{ path: 'meta.thumbUri', type: 'image' }]
        },
        ...oldEntriesFunction(defaultEntries)
      ];
    }
  );
  _.set(config, 'ui.elements.dock.groups', [
    {
      id: 'cutout-dock',
      entryIds: ['cutout-entry']
    },
    {
      id: 'ly.img.defaultGroup',
      showOverview: true
    }
  ]);
};

export const addLocalCutoutAssetLibrary = async (engine: CreativeEngine) => {
  engine.asset.addLocalSource('ly.img.cutout', [], async (asset) => {
    if (asset.id !== 'cutout-selection') {
      const blockId = await engine.asset.defaultApplyAsset(asset);
      return blockId;
    }
    const selectedBlockIds = engine.block.findAllSelected();
    if (selectedBlockIds.length === 0) {
      alert('No selected blocks available to cutout from selection');
      return undefined;
    }
    const CUTOUT_DISABLED_BLOCK_TYPES = [DesignBlockType.Page];
    if (
      selectedBlockIds.some((blockId) =>
        CUTOUT_DISABLED_BLOCK_TYPES.includes(engine.block.getType(blockId))
      )
    ) {
      alert('Cutout selection can not be performed on pages');
      return undefined;
    }

    const blockParents = selectedBlockIds
      .map((block) => engine.block.getParent(block))
      .filter((parentId) => parentId !== null) as number[];
    const uniqueParents = [...new Set(blockParents)];

    if (uniqueParents.length !== 1) {
      alert(
        'Cutout selection can only be performed on blocks with the same parent'
      );
      return undefined;
    }

    const blockId = engine.block.createCutoutFromBlocks(selectedBlockIds);
    engine.block.appendChild(uniqueParents[0], blockId);
    engine.block.select(blockId);
    engine.editor.addUndoStep();
    return blockId;
  });

  engine.asset.addAssetToSource('ly.img.cutout', {
    id: 'cutout-selection',
    label: { en: 'Cutout from selection' },
    meta: {
      blockType: '//ly.img.ubq/cutout',
      width: 48,
      height: 48
    }
  });
  engine.asset.addAssetToSource('ly.img.cutout', {
    id: 'cutout-rect',
    label: { en: 'Cutout rectangle' },
    meta: {
      thumbUri: cutoutRectThumbUri,
      vectorPath: 'M0 0 H50 V50 H0 Z',
      blockType: '//ly.img.ubq/cutout',
      width: 50,
      height: 50
    }
  });
  engine.asset.addAssetToSource('ly.img.cutout', {
    id: 'cutout-circle',
    label: { en: 'Cutout circle' },
    meta: {
      thumbUri: cutoutCircleThumbUri,
      vectorPath: 'M 0,25 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 Z',
      blockType: '//ly.img.ubq/cutout',
      width: 48,
      height: 48
    }
  });
};

const cutoutRectThumbUri =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTE2IiBoZWlnaHQ9IjExNiIgdmlld0JveD0iMCAwIDExNiAxMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTIgMThIMTlIMThWMTlWOTdWOThIMTlIOTdIOThWOTdWMTlWMThIOTdINjRWMTlIOTdWOTdIMTlWMTlINTJWMThaIiBmaWxsPSIjMTIxQTIxIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTU1IDE3QzU1LjU1MjMgMTcgNTYgMTYuNTUyMyA1NiAxNkM1NiAxNS40NDc3IDU1LjU1MjMgMTUgNTUgMTVDNTQuNDQ3NyAxNSA1NCAxNS40NDc3IDU0IDE2QzU0IDE2LjU1MjMgNTQuNDQ3NyAxNyA1NSAxN1pNNTYuNzA3OSAxNy4wNDEzQzU2Ljg5MzIgMTYuNzM4IDU3IDE2LjM4MTUgNTcgMTZDNTcgMTQuODk1NCA1Ni4xMDQ2IDE0IDU1IDE0QzUzLjg5NTQgMTQgNTMgMTQuODk1NCA1MyAxNkM1MyAxNy4xMDQ2IDUzLjg5NTQgMTggNTUgMThDNTUuNDI0NiAxOCA1NS44MTgzIDE3Ljg2NzcgNTYuMTQyMSAxNy42NDIxTDU3LjUgMTlMNTYuMTQyMSAyMC4zNTc5QzU1LjgxODMgMjAuMTMyMyA1NS40MjQ2IDIwIDU1IDIwQzUzLjg5NTQgMjAgNTMgMjAuODk1NCA1MyAyMkM1MyAyMy4xMDQ2IDUzLjg5NTQgMjQgNTUgMjRDNTYuMTA0NiAyNCA1NyAyMy4xMDQ2IDU3IDIyQzU3IDIxLjYxODUgNTYuODkzMiAyMS4yNjIgNTYuNzA3OSAyMC45NTg3TDU4LjI2NjcgMTkuNzY2N0w2MS4yNDMxIDIyLjc0MzFDNjEuNzE2IDIzLjIxNiA2Mi4zOTM5IDIzLjQyMTIgNjMuMDQ5NiAyMy4yOTAxTDY0LjUgMjNMNTYuNzA3OSAxNy4wNDEzWk01NSAyM0M1NS41NTIzIDIzIDU2IDIyLjU1MjMgNTYgMjJDNTYgMjEuNDQ3NyA1NS41NTIzIDIxIDU1IDIxQzU0LjQ0NzcgMjEgNTQgMjEuNDQ3NyA1NCAyMkM1NCAyMi41NTIzIDU0LjQ0NzcgMjMgNTUgMjNaTTYwLjU3NjkgMThMNjQuNSAxNUw2My4wNDk2IDE0LjcwOTlDNjIuMzkzOSAxNC41Nzg4IDYxLjcxNiAxNC43ODQgNjEuMjQzMSAxNS4yNTY5TDU5LjQzMSAxNy4wNjlMNjAuNTc2OSAxOFoiIGZpbGw9IiMxMjFBMjEiIGZpbGwtb3BhY2l0eT0iMC45Ii8+Cjwvc3ZnPgo=';

const cutoutCircleThumbUri =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTE2IiBoZWlnaHQ9IjExNiIgdmlld0JveD0iMCAwIDExNiAxMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTIgMTguNDQ2OEMzMi43NTQ5IDIxLjM0MTcgMTggMzcuOTQ3NiAxOCA1Ny45OTk4QzE4IDgwLjA5MTIgMzUuOTA4NiA5Ny45OTk4IDU4IDk3Ljk5OThDODAuMDkxNCA5Ny45OTk4IDk4IDgwLjA5MTIgOTggNTcuOTk5OEM5OCAzNy45NDc2IDgzLjI0NSAyMS4zNDE3IDY0IDE4LjQ0NjhWMTkuNDU4NUM4Mi42OTA1IDIyLjM0NDUgOTcgMzguNTAxMSA5NyA1Ny45OTk4Qzk3IDc5LjUzODkgNzkuNTM5MSA5Ni45OTk4IDU4IDk2Ljk5OThDMzYuNDYwOSA5Ni45OTk4IDE5IDc5LjUzODkgMTkgNTcuOTk5OEMxOSAzOC41MDExIDMzLjMwOTUgMjIuMzQ0NSA1MiAxOS40NTg1VjE4LjQ0NjhaIiBmaWxsPSIjMTIxQTIxIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTU1IDE3QzU1LjU1MjMgMTcgNTYgMTYuNTUyMyA1NiAxNkM1NiAxNS40NDc3IDU1LjU1MjMgMTUgNTUgMTVDNTQuNDQ3NyAxNSA1NCAxNS40NDc3IDU0IDE2QzU0IDE2LjU1MjMgNTQuNDQ3NyAxNyA1NSAxN1pNNTYuNzA3OSAxNy4wNDEzQzU2Ljg5MzIgMTYuNzM4IDU3IDE2LjM4MTUgNTcgMTZDNTcgMTQuODk1NCA1Ni4xMDQ2IDE0IDU1IDE0QzUzLjg5NTQgMTQgNTMgMTQuODk1NCA1MyAxNkM1MyAxNy4xMDQ2IDUzLjg5NTQgMTggNTUgMThDNTUuNDI0NiAxOCA1NS44MTgzIDE3Ljg2NzcgNTYuMTQyMSAxNy42NDIxTDU3LjUgMTlMNTYuMTQyMSAyMC4zNTc5QzU1LjgxODMgMjAuMTMyMyA1NS40MjQ2IDIwIDU1IDIwQzUzLjg5NTQgMjAgNTMgMjAuODk1NCA1MyAyMkM1MyAyMy4xMDQ2IDUzLjg5NTQgMjQgNTUgMjRDNTYuMTA0NiAyNCA1NyAyMy4xMDQ2IDU3IDIyQzU3IDIxLjYxODUgNTYuODkzMiAyMS4yNjIgNTYuNzA3OSAyMC45NTg3TDU4LjI2NjcgMTkuNzY2N0w2MS4yNDMxIDIyLjc0MzFDNjEuNzE2IDIzLjIxNiA2Mi4zOTM5IDIzLjQyMTIgNjMuMDQ5NiAyMy4yOTAxTDY0LjUgMjNMNTYuNzA3OSAxNy4wNDEzWk01NSAyM0M1NS41NTIzIDIzIDU2IDIyLjU1MjMgNTYgMjJDNTYgMjEuNDQ3NyA1NS41NTIzIDIxIDU1IDIxQzU0LjQ0NzcgMjEgNTQgMjEuNDQ3NyA1NCAyMkM1NCAyMi41NTIzIDU0LjQ0NzcgMjMgNTUgMjNaTTYwLjU3NjkgMThMNjQuNSAxNUw2My4wNDk2IDE0LjcwOTlDNjIuMzkzOSAxNC41Nzg4IDYxLjcxNiAxNC43ODQgNjEuMjQzMSAxNS4yNTY5TDU5LjQzMSAxNy4wNjlMNjAuNTc2OSAxOFoiIGZpbGw9IiMxMjFBMjEiIGZpbGwtb3BhY2l0eT0iMC45Ii8+Cjwvc3ZnPgo=';

const libraryIconSvg = (theme: string) => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.26074 8.44939C9.41336 8.16693 9.5 7.84358 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5C7.85969 9.5 8.1972 9.40505 8.48884 9.23884L8.25 9L9 8.25L9.26074 8.44939ZM10.0618 9.06197C10.3398 8.607 10.5 8.07221 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C8.13687 10.5 8.7274 10.3015 9.2131 9.9631L11.25 12L9.2131 14.0369C8.7274 13.6985 8.13687 13.5 7.5 13.5C5.84315 13.5 4.5 14.8431 4.5 16.5C4.5 18.1569 5.84315 19.5 7.5 19.5C9.15685 19.5 10.5 18.1569 10.5 16.5C10.5 15.9278 10.3398 15.393 10.0618 14.938L12.4 13.15L17.2431 17.9931C17.716 18.466 18.3939 18.6712 19.0496 18.5401L21.75 18L10.0618 9.06197ZM8.48884 14.7612L8.25 15L9 15.75L9.26074 15.5506C9.41336 15.8331 9.5 16.1564 9.5 16.5C9.5 17.6046 8.60457 18.5 7.5 18.5C6.39543 18.5 5.5 17.6046 5.5 16.5C5.5 15.3954 6.39543 14.5 7.5 14.5C7.85969 14.5 8.1972 14.595 8.48884 14.7612ZM15.8654 10.5L21.75 6L19.0496 5.45992C18.3939 5.32877 17.716 5.53402 17.2431 6.00686L14.1466 9.10345L15.8654 10.5Z" fill="${
    theme === 'light' ? '#121A21' : 'white'
  }" fill-opacity="0.9"/>
</svg>

`;

const getLibraryIcon = ({ theme }: { theme: string }) =>
  `data:image/svg+xml;base64,${utf8ToB64(libraryIconSvg(theme))}`;

function utf8ToB64(str: string) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
