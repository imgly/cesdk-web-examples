import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import CreativeEngine from '@cesdk/engine';

@Component({
  selector: 'app-custom-editor',
  templateUrl: './custom-editor.component.html',
  styleUrls: ['./custom-editor.component.css']
})
export class CustomEditorComponent implements AfterViewInit {
  @ViewChild('cesdkCanvas') canvasContainer!: ElementRef;

  private engine: any;
  private imageBlockId: any;

  async ngAfterViewInit() {
    const config = {
      license: 'YOUR_CESDK_LICENSE_KEY',
      userId: 'guides-user'
      // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.0/assets'
    };

    const engine = await CreativeEngine.init(config);

    this.engine = engine;
    this.canvasContainer.nativeElement.append(engine.element);

    // Create a scene programmatically
    const scene = await engine.scene.create();

    // Add blocks and manipulate content
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Add an image to the page
    this.imageBlockId = engine.block.create('graphic');
    engine.block.setShape(this.imageBlockId, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setFill(this.imageBlockId, imageFill);
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setEnum(this.imageBlockId, 'contentFill/mode', 'Contain');
    engine.block.appendChild(page, this.imageBlockId);
    engine.scene.zoomToBlock(page);
  }

  changeOpacity(): void {
    this.engine.block.setOpacity(this.imageBlockId, 0.5);
  }
}
