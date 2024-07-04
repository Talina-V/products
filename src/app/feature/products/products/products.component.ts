import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from "./products.model";
import {Subscription} from "rxjs";
import {ProductsService} from "../../../core/services/products.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private productService: ProductsService,
  ) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const productSubscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
      console.log('Loaded products:', data);
    });
    this.subscription.add(productSubscription);
  }

  formatField(field: string | null): string {
    return field ? field : '—';
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(product => product.id !== id);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
