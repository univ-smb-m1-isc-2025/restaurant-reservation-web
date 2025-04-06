import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { RestaurantService } from '@/app/core/services/restaurant.service';
import { RestaurantResponse } from '@/app/core/models/restaurant';


@Component({
  selector: 'restaurant-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-hub.component.html',
})

export class RestaurantHubComponent {
  auth: AuthResponse | null = null;
  restaurantResponse: RestaurantResponse[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
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
}