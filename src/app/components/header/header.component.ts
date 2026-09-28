import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';
import { CartService } from './../../services/cart.service';
import { AuthService } from './../../services/auth.service';
import { ThemeService } from './../../services/theme.service';
import { CommonModule } from '@angular/common';
import { HeaderBannerComponent } from '../../components/header-banner/header-banner.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PrimaryButtonComponent,
    RouterLink,
    MatIconModule,
    CommonModule,
    HeaderBannerComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  CartService = inject(CartService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  cartLabel = computed(() => ` (${this.CartService.cart().length})`);

  confirmLogout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
        Swal.fire(
          'Sesión cerrada',
          'Has cerrado sesión correctamente.',
          'success'
        );
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}