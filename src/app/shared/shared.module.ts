import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderComponent} from './loader/loader.component';

@NgModule({
  declarations: [
    LoaderComponent,
  ],
  exports: [
    LoaderComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
}
