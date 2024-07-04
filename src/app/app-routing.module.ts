import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathNotFoundComponent } from "./feature/path-not-found/path-not-found.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/products', pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./feature/products/products.module')
      .then(m => m.ProductsModule)
  },
  {
    path: '**',
    component: PathNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
