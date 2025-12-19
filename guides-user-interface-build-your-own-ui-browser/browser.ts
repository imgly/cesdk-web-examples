import CreativeEngine, {
  type BlockEvent,
  type DesignBlockId
} from '@cesdk/engine';
import packageJson from './package.json';

export class Example {
  name = packageJson.name;
  version = packageJson.version;

  private engine!: CreativeEngine;
  private page!: DesignBlockId;
  private selectedBlock: DesignBlockId | null = null;
  private unsubscribeEvents?: () => void;

  async initialize(): Promise<void> {
    this.engine = await CreativeEngine.init({});

    const canvasWrapper = document.getElementById('canvas-wrapper');
    if (canvasWrapper && this.engine.element) {
      canvasWrapper.appendChild(this.engine.element);
    }

    const scene = this.engine.scene.create();
    this.page = this.engine.block.create('page');
    this.engine.block.setWidth(this.page, 800);
    this.engine.block.setHeight(this.page, 600);
    this.engine.block.appendChild(scene, this.page);

    await this.createInitialContent();
    await this.engine.scene.zoomToBlock(this.page, { padding: 20 });

    this.unsubscribeEvents = this.engine.event.subscribe([], (events) => {
      this.handleEngineEvents(events);
    });

    this.setupToolbarControls();
    this.setupPropertyPanel();

    (window as any).cesdk = { engine: this.engine };
  }

  private async createInitialContent() {
    const textBlock = this.engine.block.create('text');
    this.engine.block.setString(textBlock, 'text/text', 'Click to Edit');
    this.engine.block.setPositionX(textBlock, 80);
    this.engine.block.setPositionY(textBlock, 80);
    this.engine.block.setWidth(textBlock, 300);
    this.engine.block.setHeight(textBlock, 80);
    this.engine.block.appendChild(this.page, textBlock);

    const shapeBlock = this.engine.block.create('graphic');
    const shape = this.engine.block.createShape('rect');
    this.engine.block.setShape(shapeBlock, shape);
    const fill = this.engine.block.createFill('color');
    this.engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2, g: 0.6, b: 0.9, a: 1.0
    });
    this.engine.block.setFill(shapeBlock, fill);
    this.engine.block.setPositionX(shapeBlock, 450);
    this.engine.block.setPositionY(shapeBlock, 200);
    this.engine.block.setWidth(shapeBlock, 150);
    this.engine.block.setHeight(shapeBlock, 150);
    this.engine.block.appendChild(this.page, shapeBlock);

    this.engine.block.select(textBlock);
  }

  private handleEngineEvents(events: BlockEvent[]) {
    const selectedBlocks = this.engine.block.findAllSelected();
    const newSelectedBlock = selectedBlocks[0] || null;

    if (newSelectedBlock !== this.selectedBlock) {
      this.selectedBlock = newSelectedBlock;
      this.updatePropertiesPanel();
    }

    events.forEach((event) => {
      if (event.type === 'Updated' && event.block === this.selectedBlock) {
        this.updatePropertiesPanel();
      }
    });
  }

  private setupToolbarControls() {
    document.getElementById('btn-add-text')?.addEventListener('click', () => {
      this.addTextBlock();
    });
    document.getElementById('btn-add-shape')?.addEventListener('click', () => {
      this.addShapeBlock();
    });
    document.getElementById('btn-export')?.addEventListener('click', () => {
      this.exportDesign();
    });
  }

  private addTextBlock() {
    const textBlock = this.engine.block.create('text');
    this.engine.block.setString(textBlock, 'text/text', 'Lorem ipsum dolor sit amet');
    this.engine.block.setPositionX(textBlock, 80);
    this.engine.block.setPositionY(textBlock, 80);
    this.engine.block.setWidth(textBlock, 300);
    this.engine.block.setHeight(textBlock, 100);
    this.engine.block.appendChild(this.page, textBlock);
    this.engine.block.select(textBlock);
  }

  private addShapeBlock() {
    const shapeBlock = this.engine.block.create('graphic');
    const shape = this.engine.block.createShape('rect');
    this.engine.block.setShape(shapeBlock, shape);
    const fill = this.engine.block.createFill('color');
    this.engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2, g: 0.6, b: 0.9, a: 1.0
    });
    this.engine.block.setFill(shapeBlock, fill);
    this.engine.block.setPositionX(shapeBlock, 80);
    this.engine.block.setPositionY(shapeBlock, 80);
    this.engine.block.setWidth(shapeBlock, 150);
    this.engine.block.setHeight(shapeBlock, 150);
    this.engine.block.appendChild(this.page, shapeBlock);
    this.engine.block.select(shapeBlock);
  }

  private setupPropertyPanel() {
    this.bindInput('input-x', (v) => this.engine.block.setPositionX(this.selectedBlock!, v));
    this.bindInput('input-y', (v) => this.engine.block.setPositionY(this.selectedBlock!, v));
    this.bindInput('input-width', (v) => this.engine.block.setWidth(this.selectedBlock!, v));
    this.bindInput('input-height', (v) => this.engine.block.setHeight(this.selectedBlock!, v));
    this.bindInput('input-rotation', (v) => {
      this.engine.block.setRotation(this.selectedBlock!, (v * Math.PI) / 180);
    });
  }

  private bindInput(id: string, setter: (_: number) => void) {
    const input = document.getElementById(id) as HTMLInputElement;
    input?.addEventListener('change', () => {
      if (this.selectedBlock) setter(parseFloat(input.value));
    });
  }

  private updatePropertiesPanel() {
    const selectionInfo = document.getElementById('selection-info');
    const propertyControls = document.getElementById('property-controls');

    if (!this.selectedBlock || !this.engine.block.isValid(this.selectedBlock)) {
      if (selectionInfo) selectionInfo.textContent = 'No block selected';
      if (propertyControls) propertyControls.style.display = 'none';
      return;
    }

    const blockType = this.engine.block.getType(this.selectedBlock);
    if (selectionInfo) selectionInfo.textContent = `Selected: ${blockType}`;
    if (propertyControls) propertyControls.style.display = 'block';

    const setInput = (id: string, value: number) => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) input.value = Math.round(value).toString();
    };

    setInput('input-x', this.engine.block.getPositionX(this.selectedBlock));
    setInput('input-y', this.engine.block.getPositionY(this.selectedBlock));
    setInput('input-width', this.engine.block.getWidth(this.selectedBlock));
    setInput('input-height', this.engine.block.getHeight(this.selectedBlock));
    setInput('input-rotation', (this.engine.block.getRotation(this.selectedBlock) * 180) / Math.PI);
  }

  private async exportDesign() {
    const blob = await this.engine.block.export(this.page, { mimeType: 'image/png' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-ui-export.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  dispose() {
    this.unsubscribeEvents?.();
    this.engine.dispose();
  }
}
