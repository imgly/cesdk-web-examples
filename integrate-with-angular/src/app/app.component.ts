import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
// docs-integrate-angular-1
import CreativeEditorSDK from '@cesdk/cesdk-js';
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
    const config = {
      // Serve assets from IMG.LY cdn or locally
      baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.11.0-preview.1/assets'
    };
    CreativeEditorSDK.init(this.containerRef.nativeElement, config).then(
      (instance: any) => {
        /** Do something with the instance of CreativeEditor SDK **/
      }
    );
    // docs-integrate-angular-3
  }
}
