// 1. From 'ng new' command.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// 2. From Froala instructions.

// 2.1 Import all Froala Editor plugins.
import 'froala-editor/js/plugins.pkgd.min.js';

// 2.3 Import a Froala Editor language file.
import 'froala-editor/js/languages/it.js';

// 2.5. Import WIRIS Mathtype formula editor.
// Expose FroalaEditor instance to window.
declare const require: any;
(window as any).FroalaEditor = require('froala-editor');
require('@wiris/mathtype-froala3')

const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// 2.6 Import Angular plugin.
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    BrowserModule,
    FormsModule,
        ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
