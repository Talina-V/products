import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Product} from "../../feature/products/products/products.model";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private BASE_API = 'https://139-162-155-38.ip.linodeusercontent.com:4444/api/v1';

  constructor(
    private http: HttpClient,
  ) {
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BASE_API}/products`).pipe(
      catchError(this.handleError),
    );
  }

  getProductsById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.BASE_API}/products/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_API}/products/${id}`).pipe(
      catchError(this.handleError)
    )
  }

  addProduct(product: Product): Observable<Product> {
    product.category_id = Number(product.category_id);
    return this.http.post<Product>(`${this.BASE_API}/products/`, product).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding product:', error);
        if (error.error && error.error.errors) {
          Object.keys(error.error.errors).forEach(key => {
            console.error(`${key}: ${error.error.errors[key]}`);
          });
        }
        console.error('Request body:', product);
        return throwError(() => new Error('Error adding product'));
      })
    );
  }

  editProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.BASE_API}/products/${product.id}`, product).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Server-side error: ${error.status} - ${error.statusText}`);
      console.error('Response body:', error.error);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
