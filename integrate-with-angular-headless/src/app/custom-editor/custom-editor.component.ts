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

  ngAfterViewInit(): void {
    const config = {
      license:
        'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
      userId: 'guides-user',
      baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.56.0/assets'
    };

    CreativeEngine.init(config).then((engine: any) => {
      this.engine = engine;
      this.canvasContainer.nativeElement.append(engine.element);

      let scene = engine.scene.get();
      if (!scene) {
        scene = engine.scene.create();
        const page = engine.block.create('page');
        engine.block.appendChild(scene, page);
      }

      const [page] = engine.block.findByType('page');

      this.imageBlockId = engine.block.create('graphic');
      engine.block.setShape(
        this.imageBlockId,
        engine.block.createShape('rect')
      );
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
    });
  }

  changeOpacity(): void {
    this.engine.block.setOpacity(this.imageBlockId, 0.5);
  }
}
