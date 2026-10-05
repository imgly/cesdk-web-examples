/**
 * CE.SDK Premium Templates - Catalogue and Opening
 *
 * The gallery lists the premium templates from the editor's own
 * PremiumTemplatesAssetSource, and a picked template opens through the same
 * source, so the gallery and the editor share one catalogue and one loader.
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { AssetResult, CreativeEngine } from '@cesdk/cesdk-js';
import { PremiumTemplatesAssetSource } from '@cesdk/cesdk-js/plugins';

/** The asset source the PremiumTemplatesAssetSource plugin registers. */
export const PREMIUM_TEMPLATES_SOURCE_ID = 'ly.img.templates.premium';

/**
 * Create the premium templates plugin with every premium template included.
 */
export function createPremiumTemplatesAssetSource() {
  return new PremiumTemplatesAssetSource({
    include: ['ly.img.templates.premium.*']
  });
}

/**
 * List the premium templates of each group.
 *
 * @param engine - The editor's engine, with the premium templates plugin added
 * @param groups - The template groups to list, such as `e-commerce`
 * @returns The templates of each group, in the order of `groups`
 */
export async function listPremiumTemplates(
  engine: CreativeEngine,
  groups: string[]
): Promise<AssetResult[][]> {
  return Promise.all(
    groups.map(
      async (group) =>
        (
          await engine.asset.findAssets(PREMIUM_TEMPLATES_SOURCE_ID, {
            groups: [group],
            page: 0,
            perPage: 9999
          })
        ).assets
    )
  );
}

/**
 * Open a premium template in the editor, in place of the current design.
 *
 * The editor is reused for every template, so this closes the panels the
 * previous one left open. Loading the archive resets the edit mode and starts a
 * new undo history.
 *
 * @param cesdk - The editor, with the premium templates plugin added
 * @param template - A template from `listPremiumTemplates`
 */
export async function openPremiumTemplate(
  cesdk: CreativeEditorSDK,
  template: AssetResult
): Promise<void> {
  const { engine } = cesdk;

  // Before the scene is replaced, otherwise an open panel still points at a
  // block of the previous template. Loading resets the edit mode and history.
  cesdk.ui.closePanel('*');
  await engine.asset.apply(PREMIUM_TEMPLATES_SOURCE_ID, template);

  engine.block.findAllSelected().forEach((block) => {
    engine.block.setSelected(block, false);
  });

  // Name the scene and title the navigation bar after the template.
  // The scene is often block id 0, which a truthiness check would drop.
  const title = template.label ?? template.id;
  const scene = engine.scene.get();
  if (scene != null) {
    engine.block.setName(scene, title);
  }
  cesdk.ui.updateOrderComponent(
    {
      in: 'ly.img.navigation.bar',
      match: { id: 'ly.img.title.navigationBar' }
    },
    { title }
  );

  const pages = engine.scene.getPages();
  if (pages.length > 0) {
    await cesdk.actions.run('zoom.toBlock', pages[0], {
      autoFit: false,
      animate: false
    });
  }
}
