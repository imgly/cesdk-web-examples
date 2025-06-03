import { Component } from '@angular/core';
import { CustomEditorComponent } from './custom-editor/custom-editor.component';


@Component({
  selector: 'app-root',
  imports: [CustomEditorComponent],
  template: '<app-custom-editor></app-custom-editor>',
})
export class AppComponent {}
