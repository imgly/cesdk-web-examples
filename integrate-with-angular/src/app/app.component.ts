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
      license:
        'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu', // Replace with your actual CE.SDK license key
      userId: 'guides-user',
      baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.55.0/assets',
      callbacks: {
        onUpload: 'local'
      }
    };

    CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
      async (instance: any) => {
        instance.addDefaultAssetSources();
        instance.addDemoAssetSources({ sceneMode: 'Design' });
        await instance.createDesignScene();
      }
    );
  }
}
