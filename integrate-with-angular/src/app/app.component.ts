import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import CreativeEditorSDK from '@cesdk/cesdk-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('cesdk_container') containerRef: ElementRef = {} as ElementRef;

  title = 'Integrate CreativeEditor SDK with Angular';

  ngAfterViewInit(): void {
    const config = {};
    CreativeEditorSDK.init(this.containerRef.nativeElement, config).then(
      (instance: any) => {
        /** Do something with the instance of CreativeEditor SDK **/
      }
    );
  }
}
