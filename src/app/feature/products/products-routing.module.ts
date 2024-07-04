import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductFormComponent} from "./product-form/product-form.component";
import {ProductsComponent} from "./products/products.component";
import {DataFormResolver} from "../../core/guards/data-form.resolver";

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'add',
    component: ProductFormComponent
  },
  {
    path: ':id',
    component: ProductFormComponent,
    resolve: {
      feature: DataFormResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
