import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
// docs-integrate-angular-1
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
// docs-integrate-angular-1

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  // docs-integrate-angular-2
  @ViewChild('cesdk_container') containerRef: ElementRef = {} as ElementRef;
  // docs-integrate-angular-2

  title = 'Integrate CreativeEditor SDK with Angular';

  ngAfterViewInit(): void {
    // docs-integrate-angular-3
    const config: Configuration = {
      license:
        'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
      // Serve assets from IMG.LY cdn or locally
      baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.50.0/assets',
      // Enable local uploads in Asset Library
      callbacks: { onUpload: 'local' }
    };
    CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
      async (instance: any) => {
        // Do something with the instance of CreativeEditor SDK, for example:
        // Populate the asset library with default / demo asset sources.
        instance.addDefaultAssetSources();
        instance.addDemoAssetSources({ sceneMode: 'Design' });
        await instance.createDesignScene();
      }
    );
    // docs-integrate-angular-3
  }
}
