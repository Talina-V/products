import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Product} from "../../feature/products/products/products.model";
import {ProductsService} from "../services/products.service";

@Injectable({
  providedIn: 'root'
})
export class DataFormResolver implements Resolve<Product> {
  constructor(private productsService: ProductsService) {
  }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> | Promise<Product> | Product {
    return this.productsService.getProductsById(route.params['id']);
  }
}
