import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('cesdk_container') containerRef!: ElementRef;

  title = 'Integrate CreativeEditor SDK with Angular';

  ngAfterViewInit(): void {
    const config: Configuration = {
      // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your actual CE.SDK license key
      userId: 'guides-user'
      // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`
    };

    CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
      async (instance: any) => {
        instance.addDefaultAssetSources();
        instance.addDemoAssetSources({
          sceneMode: 'Design',
          withUploadAssetSources: true
        });
        await instance.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });
      }
    );
  }
}
