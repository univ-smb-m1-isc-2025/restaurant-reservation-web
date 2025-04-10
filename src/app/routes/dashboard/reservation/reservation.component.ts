import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { StorageService } from '@/app/core/services/storage.service';
import { RestaurantService } from '@/app/core/services/restaurant.service';
import { RestaurantResponse } from '@/app/core/models/restaurant';
import { SidebarComponent } from "@/app/shared/components/sidebar/sidebar.component";


@Component({
  selector: 'reservation',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './reservation.component.html',
})

export class ReservationComponent {
  auth: AuthResponse | null = null;
  restaurant: Number | null = null;
  restaurantResponse: RestaurantResponse[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
  ) {
    if (authService.isAuthenticatedUser()) {
      this.auth = this.authService.getAuthenticatedUser();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }

    if (storageService.getSelectedRestaurant()) {
      this.restaurant = this.storageService.getSelectedRestaurant();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }
  }
}