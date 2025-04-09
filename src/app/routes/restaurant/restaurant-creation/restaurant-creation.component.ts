import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { RestaurantService } from '@/app/core/services/restaurant.service';
import { RestaurantResponse } from '@/app/core/models/restaurant';
import { ToastService } from '@/app/core/services/toast.service';
import { ToastType } from '@/app/core/models/toast';
import { AppbarComponent } from "@/app/shared/AppBar/appbar.component";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';


@Component({
  selector: 'restaurant-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppbarComponent],
  templateUrl: './restaurant-creation.component.html',
})

export class RestaurantCreationComponent {
  auth: AuthResponse | null = null;
  restaurantResponse: RestaurantResponse[] = [];
  restaurantForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {
    if (authService.isAuthenticatedUser()) {
      this.auth = this.authService.getAuthenticatedUser();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }

    this.restaurantForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.invalid) {
      this.restaurantForm.markAllAsTouched();
      return;
    }

    this.restaurantService.createRestaurant(this.restaurantForm.value).subscribe({
      next: (response) => {
        this.toastService.create('Le restaurant a été créé avec succès.', ToastType.SUCCESS);
        this.toRestaurantHub();
      },
      error: (err) => {
        this.toastService.create('Une erreur est survenue lors de la création du restaurant',ToastType.ERROR);
      },
    });
  }

  toRestaurantHub() {
    this.router.navigate(['/restaurants']);
  }
}