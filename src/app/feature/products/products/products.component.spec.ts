import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import {ProductsService} from "../../../core/services/products.service";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";

class MockProductsService {
  getProducts() {
    return of([
      { id: 1, name: 'Product 1', expiration_type: 'non_expirable', category_id: 1, fields: [], manufacture_date: '', expiration_date: null, comment: '' },
      { id: 2, name: 'Product 2', expiration_type: 'non_expirable', category_id: 2, fields: [], manufacture_date: '', expiration_date: null, comment: '' }
    ]);
  }
  deleteProduct(id: number) {
    return of(null);
  }
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: ProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ProductsService, useClass: MockProductsService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(2);
    expect(component.products[0].name).toBe('Product 1');
    expect(component.products[1].name).toBe('Product 2');
  });

  it('should format field correctly', () => {
    expect(component.formatField(null)).toBe('—');
    expect(component.formatField('Test')).toBe('Test');
  });

  it('should delete product', () => {
    component.ngOnInit();
    component.deleteProduct(1);
    expect(component.products.length).toBe(1);
    expect(component.products[0].id).toBe(2);
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
