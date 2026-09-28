import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from '../../components/slider/slider.component';
import { PromoBannerComponent } from '../../components/promo-banner/promo-banner.component';
import { ScrollToTopComponent } from '../../components/scroll-to-top/scroll-to-top.component';
import { ProductsListComponent } from '../products-list/products-list.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { UserReviewsComponent } from '../../components/user-reviews/user-reviews.component';
import { StoreBenefitsComponent } from '../../components/store-benefits/store-benefits.component';
import { AppPromoBannerComponent } from '../../components/app-promo-banner/app-promo-banner.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    PromoBannerComponent,
    ScrollToTopComponent,
    ProductsListComponent,
    StoreBenefitsComponent,
    UserReviewsComponent,
    AppPromoBannerComponent,
    NewsletterComponent,
  ],
})
export class HomeComponent {
  constructor() {}
}