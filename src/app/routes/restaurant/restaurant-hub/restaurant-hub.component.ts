import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { RestaurantService } from '@/app/core/services/restaurant.service';
import { RestaurantResponse } from '@/app/core/models/restaurant';
import { StorageService } from '@/app/core/services/storage.service';
import { AppbarComponent } from "@/app/shared/AppBar/appbar.component";


@Component({
  selector: 'restaurant-hub',
  standalone: true,
  imports: [CommonModule, AppbarComponent],
  templateUrl: './restaurant-hub.component.html',
})

export class RestaurantHubComponent {
  auth: AuthResponse | null = null;
  restaurantResponse: RestaurantResponse[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private restaurantService: RestaurantService
  ) {
    if (authService.isAuthenticatedUser()) {
      this.auth = this.authService.getAuthenticatedUser();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }
  }

  ngOnInit() {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.restaurantService.getRestaurants().subscribe({
      next: (response) => {
        this.restaurantResponse = response.data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants:', err);
      },
    });
  }

  toRestaurantCreation() {
    this.router.navigate(['/restaurants/creation']);
  }

  goToDashboard(restaurant: number) {
    this.storageService.saveSelectedRestaurant(restaurant);
    this.restaurantService.initializeRestaurant(restaurant);
    this.router.navigate(['/dashboard']);
  }
}