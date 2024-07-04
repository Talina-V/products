import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TITLES_FORM} from "../../../app.config";
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ProductsService} from "../../../core/services/products.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../products/products.model";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {CustomValidators} from "../../../shared/validators/custom.validators";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
  title = 'Product form';
  productForm!: FormGroup;
  productId!: number;
  isEditForm: boolean = false;
  public TITLES_FORM = TITLES_FORM;
  showExpirationDate: boolean = false;
  defaultCategoryId: number = 1;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    public router: Router,
    private activateRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.checkIsEditForm();
    this.setupExpirationTypeListener();
    this.addField();
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        CustomValidators.isValidName
      ]],
      expirationType: ['', Validators.required],
      manufactureDate: ['', [Validators.required, CustomValidators.dateFormat]],
      expirationDate: ['', [Validators.required, CustomValidators.dateFormat]],
      comment: [''],
      fields: this.fb.array([])
    }, {
      validators: CustomValidators.dateComparisonValidator
    });

    this.productForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe();
  }

  setupExpirationTypeListener(): void {
    this.productForm.get('expirationType')?.valueChanges.subscribe(value => {
      const expirationDateControl = this.productForm.get('expirationDate');
      if (value === 'expirable') {
        this.showExpirationDate = true;
        expirationDateControl?.setValidators([Validators.required]);
      } else {
        this.showExpirationDate = false;
        expirationDateControl?.clearValidators();
        expirationDateControl?.setValue(null);
      }
      expirationDateControl?.updateValueAndValidity();
      this.productForm.updateValueAndValidity();
    });
  }

  get fields(): FormArray {
    return this.productForm.get('fields') as FormArray;
  }

  addField(): void {
    const fieldGroup = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      is_date: [false]
    });
    this.fields.push(fieldGroup);
  }

  trackByFn(index: number): number {
    return index;
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
  }

  private checkIsEditForm(): void {
    if (this.activateRoute.snapshot.params['id']) {
      this.productId = this.activateRoute.snapshot.params['id'];
      this.isEditForm = true;
      this.productsService.getProductsById(this.productId).subscribe(product => {
        this.productForm.setValue({
          productName: product.name,
          expirationType: product.expiration_type,
          manufactureDate: product.manufacture_date,
          expirationDate: product.expiration_date,
          comment: product.comment,
          fields: [],
        });

        if (product.expiration_type === 'expirable') {
          this.showExpirationDate = true;
          this.productForm.get('expirationDate')?.setValidators([Validators.required]);
        } else {
          this.showExpirationDate = false;
          this.productForm.get('expirationDate')?.clearValidators();
        }
        this.productForm.get('expirationDate')?.updateValueAndValidity();
      });
    }
  }

  onSave(): void {

    if (this.productForm.invalid) {
      return;
    }

    const product: Product = {
      id: this.isEditForm ? this.productId : 0,
      name: this.productForm.value.productName.trim(),
      expiration_type: this.productForm.value.expirationType === 'expirable' ? 'expirable' : 'non_expirable',
      category_id: this.defaultCategoryId,
      fields: this.productForm.value.fields.map((field: any) => ({
        ...field,
        name: field.name.trim(),
        value: field.value.trim()
      })),
      manufacture_date: this.formatDate(this.productForm.value.manufactureDate),
      expiration_date: this.productForm.value.expirationDate ? this.formatDate(
        this.productForm.value.expirationDate
      ) : null,
      comment: this.productForm.value.comment.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.isEditForm) {
      this.productsService.editProduct(product).subscribe(
        () => {
          this.router.navigate(['/products']);
        },
        (error) => {
          console.error('Error editing product:', error);
        }
      );
    } else {
      this.productsService.addProduct(product).subscribe(
        () => {
          this.router.navigate(['/products']);
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );
    }
  }

  private formatDate(date: string): string {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  }

  get productName(): AbstractControl {
    return this.productForm.get('productName')!;
  }

  get expirationType(): AbstractControl {
    return this.productForm.get('expirationType')!;
  }

  get manufactureDate(): AbstractControl {
    return this.productForm.get('manufactureDate')!;
  }

  get expirationDate(): AbstractControl {
    return this.productForm.get('expirationDate')!;
  }

  get comment(): AbstractControl {
    return this.productForm.get('comment')!;
  }
}
