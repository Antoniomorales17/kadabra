import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { CATEGORIES_DATA, PRODUCTS_DATA } from '../data/products.data';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsService);
  });

  it('debe devolver el catalogo completo sin llamadas HTTP', (done) => {
    service.getAllProducts().subscribe({
      next: (products) => {
        expect(products.length).toBe(PRODUCTS_DATA.length);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].title).toBeTruthy();
        done();
      },
      error: () => fail('El catalogo local nunca deberia fallar'),
    });
  });

  it('debe exponer todos los productos con imagen y categoría', (done) => {
    service.getAllProducts().subscribe((products) => {
      products.forEach((p) => {
        expect(p.image).toMatch(/^products\/\d+\.jpg$/);
        expect(p.category).toBeTruthy();
        expect(p.price).toBeGreaterThan(0);
      });
      done();
    });
  });

  it('debe devolver las categorias del catalogo', (done) => {
    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(CATEGORIES_DATA);
      expect(categories).toContain('electronics');
      expect(categories).toContain("men's clothing");
      done();
    });
  });

  it('debe filtrar de verdad por categoría', (done) => {
    service.getProductsByCategory('jewelery').subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
      products.forEach((p) => expect(p.category).toBe('jewelery'));
      done();
    });
  });

  it('no debe devolver ropa de hombre al filtrar por joyería', (done) => {
    service.getProductsByCategory('jewelery').subscribe((products) => {
      expect(products.some((p) => p.category === "men's clothing")).toBeFalse();
      done();
    });
  });

  it('debe devolver el catalogo completo para "Todos"', (done) => {
    service.getProductsByCategory('Todos').subscribe((products) => {
      expect(products.length).toBe(PRODUCTS_DATA.length);
      done();
    });
  });

  it('debe devolver un array vacío para una categoría inexistente', (done) => {
    service.getProductsByCategory('no-existe').subscribe((products) => {
      expect(products).toEqual([]);
      done();
    });
  });

  it('debe devolver los detalles de un producto existente', (done) => {
    service.getProductDetails(1).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product.title).toContain('Fjallraven');
      done();
    });
  });

  it('debe fallar con un id de producto inexistente', (done) => {
    service.getProductDetails(9999).subscribe({
      next: () => fail('Deberia fallar con un id inexistente'),
      error: (error) => {
        expect(error.message).toContain('9999');
        done();
      },
    });
  });

  it('debe filtrar por nombre de producto', (done) => {
    service.searchProducts('jacket').subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
      done();
    });
  });

  it('no debe filtrar cuando la búsqueda está vacía', (done) => {
    service.searchProducts('  ').subscribe((products) => {
      expect(products.length).toBe(PRODUCTS_DATA.length);
      done();
    });
  });

  it('debe devolver copias defensivas, no el array original', (done) => {
    service.getAllProducts().subscribe((products) => {
      products[0].title = 'MODIFICADO';
      service.getAllProducts().subscribe((again) => {
        expect(again[0].title).not.toBe('MODIFICADO');
        done();
      });
    });
  });
});
