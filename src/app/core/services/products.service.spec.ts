import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Product} from "../../feature/products/products/products.model";

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const dummyProducts: Product[] = [
    { id: 1, name: 'Product 1', expiration_type: 'non_expirable', category_id: 1, fields: [], manufacture_date: '', expiration_date: null, comment: '' },
    { id: 2, name: 'Product 2', expiration_type: 'non_expirable', category_id: 2, fields: [], manufacture_date: '', expiration_date: null, comment: '' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    }).compileComponents();

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${service['BASE_API']}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should retrieve product by ID from the API via GET', () => {
    const product: Product = { id: 1, name: 'Product 1', expiration_type: 'non_expirable', category_id: 1, fields: [], manufacture_date: '', expiration_date: null, comment: '' };

    service.getProductsById(1).subscribe(data => {
      expect(data).toEqual(product);
    });

    const req = httpMock.expectOne(`${service['BASE_API']}/products/1`);
    expect(req.request.method).toBe('GET');
    req.flush(product);
  });

  it('should add a new product via POST', () => {
    const newProduct: Product = { id: 3, name: 'Product 3', expiration_type: 'non_expirable', category_id: 3, fields: [], manufacture_date: '', expiration_date: null, comment: '' };

    service.addProduct(newProduct).subscribe(data => {
      expect(data).toEqual(newProduct);
    });

    const req = httpMock.expectOne(`${service['BASE_API']}/products/`);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should edit an existing product via PUT', () => {
    const updatedProduct: Product = { id: 1, name: 'Updated Product', expiration_type: 'non_expirable', category_id: 1, fields: [], manufacture_date: '', expiration_date: null, comment: '' };

    service.editProduct(updatedProduct).subscribe(data => {
      expect(data).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${service['BASE_API']}/products/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete a product via DELETE', () => {
    service.deleteProduct(1).subscribe();

    const req = httpMock.expectOne(`${service['BASE_API']}/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle errors', () => {
    const errorMessage = 'mock 404 error occurred';

    service.getProducts().subscribe({
      next: () => fail('expected an error, not products'),
      error: error => expect(error.message).toContain('Something went wrong; please try again later.')
    });

    const req = httpMock.expectOne(`${service['BASE_API']}/products`);

    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
