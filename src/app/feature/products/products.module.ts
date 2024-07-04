import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductsRoutingModule} from './products-routing.module';
import {ProductFormComponent} from './product-form/product-form.component';
import {ProductsComponent} from './products/products.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    ProductFormComponent,
    ProductsComponent
  ],
    imports: [
        CommonModule,
        ProductsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
    ]
})
export class ProductsModule {
}
