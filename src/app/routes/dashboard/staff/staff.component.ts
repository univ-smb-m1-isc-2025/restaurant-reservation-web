import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { StorageService } from '@/app/core/services/storage.service';
import { StaffService } from '@/app/core/services/staff.service';
import { StaffResponse } from '@/app/core/models/staff';
import { SidebarComponent } from "@/app/shared/components/sidebar/sidebar.component";


@Component({
  selector: 'staff',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './staff.component.html',
})

export class StaffComponent {
  auth: AuthResponse | null = null;
  restaurant: Number | null = null;
  staffResponse: StaffResponse[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private staffService: StaffService
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

  ngOnInit() {
    this.fetchStaff();
  }

  fetchStaff() {
    this.staffService.getRestaurants().subscribe({
      next: (response) => {
        this.staffResponse = response.data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants:', err);
      },
    });
  }
}