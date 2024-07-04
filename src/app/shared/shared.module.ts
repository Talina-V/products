import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaredComponent } from './loared/loared.component';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    LoaredComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
