import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { StorageService } from '@/app/core/services/storage.service';
import { StaffService } from '@/app/core/services/staff.service';
import { Role, StaffResponse } from '@/app/core/models/staff';
import { SidebarComponent } from "@/app/shared/components/sidebar/sidebar.component";
import { ToastService } from '@/app/core/services/toast.service';
import { ToastType } from '@/app/core/models/toast';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'staff',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ReactiveFormsModule],
  templateUrl: './staff.component.html',
})

export class StaffComponent {
  employeeForm!: FormGroup;
  auth: AuthResponse | null = null;
  restaurant: Number | null = null;
  admin: Boolean | null = null;
  staffResponse: StaffResponse[] = [];
  roles: Role[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private staffService: StaffService,
    private toastService: ToastService
  ) {
    if (authService.isAuthenticatedUser()) {
      this.auth = this.authService.getAuthenticatedUser();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }

    if (storageService.getSelectedRestaurant()) {
      this.restaurant = this.storageService.getSelectedRestaurant();
    } else {
      console.error('Restaurant non présent dans le localStorage');
    }

    if (authService.getAuthenticatedUserRole()) {
      this.admin = this.authService.isAdmin();
    } else {
      console.error('Role non présent dans le localStorage');
    }

    this.employeeForm = this.formBuilder.group({
      userEmail: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.fetchStaff();
    this.fetchRoles();
  }

  fetchRoles() {
    this.staffService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        this.toastService.create(error,ToastType.ERROR);
        console.error(error)
      },
    });
  }

  createEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.staffService.createEmployee(this.employeeForm.value).subscribe({
      next: (response) => {
        console.log(this.employeeForm.value)
        this.toastService.create(response.message, ToastType.SUCCESS);
        this.fetchStaff();
        this.employeeForm.reset();
      },
      error : (error) => {
        this.toastService.create(error,ToastType.ERROR);
        console.error(error)
      }
    });
  }

  fetchStaff() {
    this.staffService.getStaff().subscribe({
      next: (response) => {
        this.staffResponse = response.data;
      },
      error: (error) => {
        this.toastService.create(error,ToastType.ERROR);
        console.error(error)
      },
    });
  }
}