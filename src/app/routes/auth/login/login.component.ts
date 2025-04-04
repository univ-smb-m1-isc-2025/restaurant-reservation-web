import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '@/app/core/services/toast.service';
import { ToastType } from '@/app/core/models/toast';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})

export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.toastService.create('La connexion a été validée avec succès.', ToastType.SUCCESS);
        this.toRestaurantHub()
      },
      error : (error: any) => {
        this.toastService.create('Une erreur est survenue lors de la connexion',ToastType.ERROR);
        console.error(error)
      }
    });
  }

  toRestaurantHub() {
    this.router.navigate(['/restaurant-hub'])
  }

  toSignup(){
    this.router.navigate(['/register'])
  }
}