import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/products.models';
import { CartService } from '../../services/cart.service';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../products-list/product-card/product-card.component';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    PrimaryButtonComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    ProductCardComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  loading = true;
  notFound = false;

  // Inyecta el servicio del carrito
  CartService = inject(CartService);

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(Number(productId));
      }
    });
  }

  loadProductDetails(productId: number): void {
    this.loading = true;
    this.notFound = false;
    this.productsService
      .getProductDetails(productId)
      .pipe(
        catchError((error) => {
          console.error('Error al cargar el producto:', error);
          this.loading = false;
          this.notFound = true;
          return of(undefined);
        })
      )
      .subscribe((product) => {
        this.product = product;
        this.loading = false;
        if (!product) {
          this.notFound = true;
          return;
        }
        if (product.category) {
          this.loadRelatedProducts(product.category);
        }
      });
  }

  loadRelatedProducts(category: string): void {
    this.productsService
      .getProductsByCategory(category)
      .pipe(
        catchError((error) => {
          console.error('Error al cargar productos relacionados:', error);
          return of([]);
        })
      )
      .subscribe((products) => {
        this.relatedProducts = products.filter(
          (p) => p.id !== this.product?.id
        );
      });
  }

  // Método para añadir el producto al carrito
  addToCart() {
    if (this.product) {
      this.CartService.addToCart(this.product);
      Swal.fire({
        title: 'Producto añadido',
        text: `El producto "${this.product.title}" ha sido añadido a la cesta.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
  }

  // Método para regresar a la página anterior
  goBack() {
    this.location.back();
  }
}