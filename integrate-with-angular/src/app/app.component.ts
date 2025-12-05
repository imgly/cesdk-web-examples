import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
// import {
//   DesignEditorConfig,
//   // VideoEditorConfig,
//   // PhotoEditorConfig
// } from '@cesdk/cesdk-js/configs';

// import {
//   FiltersAssetSource,
//   EffectsAssetSource,
//   ColorPaletteAssetSource
// } from '@cesdk/cesdk-js/plugins';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('cesdk_container') containerRef!: ElementRef;

  title = 'Integrate CreativeEditor SDK with Angular';

  async ngAfterViewInit() {
    if (!this.containerRef?.nativeElement) return;

    const config: Configuration = {
      // license: 'YOUR_CESDK_LICENSE_KEY',
      userId: 'guides-user'
      // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`
    };

    const cesdk = await CreativeEditorSDK.create(
      this.containerRef.nativeElement,
      config
    );

    // TODO: Uncomment when configs/plugins are released
    // Configure the editor
    // await cesdk.addPlugin(new DesignEditorConfig());
    // await cesdk.addPlugin(new VideoEditorConfig());
    // await cesdk.addPlugin(new PhotoEditorConfig());

    // Configure the asset sources
    // await cesdk.addPlugin(new FiltersAssetSource());
    // await cesdk.addPlugin(new EffectsAssetSource());
    // await cesdk.addPlugin(new ColorPaletteAssetSource());

    // Create the scene
    await cesdk.createDesignScene();
  }
}
