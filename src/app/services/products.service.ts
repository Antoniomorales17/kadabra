import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Product } from '../models/products.models';
import { CATEGORIES_DATA, PRODUCTS_DATA } from '../data/products.data';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  /**
   * El catalogo se sirve desde el bundle (`data/products.data.ts`) en lugar de
   * desde fakestoreapi.com. Motivo: esa API devolvio HTTP 523 (Cloudflare) y
   * dejo la tienda sin productos. Al no depender de la red, el catalogo no
   * puede caerse y las imagenes se sirven desde `public/products/`.
   *
   * Se mantienen las firmas Observables para no romper los componentes.
   */

  // Copia defensiva: los componentes nunca tocan el array original.
  private readonly products: Product[] = PRODUCTS_DATA.map((p) => ({ ...p }));
  private readonly categories: string[] = [...CATEGORIES_DATA];

  // Obtener todos los productos
  getAllProducts(): Observable<Product[]> {
    return of(this.products.map((p) => ({ ...p })));
  }

  // Obtener productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    const target = (category ?? '').trim().toLowerCase();

    if (target === '' || target === 'todos' || target === 'all') {
      return of(this.products.map((p) => ({ ...p })));
    }

    const filtered = this.products
      .filter((p) => (p.category ?? '').trim().toLowerCase() === target)
      .map((p) => ({ ...p }));

    return of(filtered);
  }

  // Buscar productos por nombre
  searchProducts(query: string): Observable<Product[]> {
    const term = (query ?? '').trim().toLowerCase();

    if (term === '') {
      return of(this.products.map((p) => ({ ...p })));
    }

    const filtered = this.products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.description ?? '').toLowerCase().includes(term)
      )
      .map((p) => ({ ...p }));

    return of(filtered);
  }

  // Obtener detalles de un producto específico
  getProductDetails(productId: number): Observable<Product> {
    const product = this.products.find((p) => p.id === Number(productId));

    if (!product) {
      return throwError(
        () => new Error(`El producto con id "${productId}" no existe.`)
      );
    }

    return of({ ...product });
  }

  // Obtener todas las categorías
  getCategories(): Observable<string[]> {
    return of([...this.categories]);
  }
}
