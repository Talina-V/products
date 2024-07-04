import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {Product} from "../products/products.model";
import {ProductsService} from "../../../core/services/products.service";

class MockProductsService {
  getProductsById(id: number) {
    return of({
      id: 1,
      name: 'Product 1',
      expiration_type: 'expirable',
      category_id: 1,
      fields: [],
      manufacture_date: '2023-01-01',
      expiration_date: '2023-12-31',
      comment: 'Sample comment'
    });
  }
  editProduct(product: Product) {
    return of(null);
  }
  addProduct(product: Product) {
    return of(null);
  }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductsService: MockProductsService;

  beforeEach(async () => {
    mockProductsService = new MockProductsService();

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: ProductsService, useValue: mockProductsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 1 }
            }
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    component.ngOnInit();
    expect(component.productForm).toBeDefined();
    expect(component.productForm.controls['productName']).toBeDefined();
  });

  it('should setup expirationType listener', () => {
    component.ngOnInit();
    const expirationTypeControl = component.productForm.get('expirationType');
    expirationTypeControl?.setValue('expirable');
    expect(component.showExpirationDate).toBeTrue();
    expirationTypeControl?.setValue('non_expirable');
    expect(component.showExpirationDate).toBeFalse();
  });

  it('should add a new field to the form array', () => {
    component.ngOnInit();
    const initialLength = component.fields.length;
    component.addField();
    expect(component.fields.length).toBe(initialLength + 1);
  });

  it('should remove a field from the form array', () => {
    component.ngOnInit();
    component.addField();
    const initialLength = component.fields.length;
    component.removeField(0);
    expect(component.fields.length).toBe(initialLength - 1);
  });

  it('should check if the form is in edit mode and load product data', () => {
    component.ngOnInit();
    expect(component.isEditForm).toBeTrue();
    expect(component.productForm.get('productName')?.value).toBe('Product 1');
  });

  it('should save the product correctly when the form is valid', () => {
    spyOn(mockProductsService, 'editProduct').and.callThrough();
    spyOn(mockProductsService, 'addProduct').and.callThrough();
    spyOn(component.router, 'navigate');

    component.ngOnInit();
    component.productForm.setValue({
      productName: 'Updated Product',
      expirationType: 'non_expirable',
      manufactureDate: '2023-01-01',
      expirationDate: null,
      comment: 'Updated comment',
      fields: [
        { name: 'Field 1', value: 'Value 1', is_date: false }
      ]
    });

    component.onSave();
    expect(mockProductsService.editProduct).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should not save the product if the form is invalid', () => {
    spyOn(mockProductsService, 'editProduct').and.callThrough();
    spyOn(mockProductsService, 'addProduct').and.callThrough();

    component.ngOnInit();
    component.productForm.get('productName')?.setValue('');
    component.onSave();
    expect(mockProductsService.editProduct).not.toHaveBeenCalled();
    expect(mockProductsService.addProduct).not.toHaveBeenCalled();
  });

  it('should validate date comparison correctly', () => {
    component.ngOnInit();
    const manufactureDateControl = component.productForm.get('manufactureDate');
    const expirationDateControl = component.productForm.get('expirationDate');

    manufactureDateControl?.setValue('2023-01-01');
    expirationDateControl?.setValue('2022-12-31');
    component.productForm.updateValueAndValidity();

    expect(component.productForm.errors).toEqual({ dateInvalid: true });
  });
});
