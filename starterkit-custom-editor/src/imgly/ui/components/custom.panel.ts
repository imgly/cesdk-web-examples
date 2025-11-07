/**
 * Custom Panel Component - Example panel for custom editor
 */

import type { BuilderRenderFunctionContext } from '@cesdk/cesdk-js';

export function defineCustomPanel(
  context: BuilderRenderFunctionContext<any>
): void {
  const { builder, engine } = context;

  builder.Section('custom-panel-header', {
    children: () => {
      builder.Text('custom-panel-title', {
        content: 'Custom Editor Panel'
      });
      builder.Text('custom-panel-description', {
        content:
          'This is an example custom panel. You can add any UI components here using the builder API.'
      });
    }
  });

  // Example: Show selected block info
  const selectedBlockIds = engine.block.findAllSelected();
  if (selectedBlockIds.length > 0) {
    builder.Section('selected-block-info', {
      children: () => {
        builder.Text('selected-block-count', {
          content: `Selected Blocks: ${selectedBlockIds.length}`
        });

        selectedBlockIds.forEach((blockId, index) => {
          const blockType = engine.block.getType(blockId);
          builder.Text(`selected-block-${index}`, {
            content: `Block ${index + 1}: ${blockType} (${blockId})`
          });
        });
      }
    });
  }
}
