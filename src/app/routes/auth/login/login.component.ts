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
    if (this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/restaurants']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.toastService.create(response.message, ToastType.SUCCESS);
        this.toRestaurantHub()
      },
      error : (error) => {

        this.toastService.create(error,ToastType.ERROR);
        console.error(error)
      }
    });
  }

  toRestaurantHub() {
    this.router.navigate(['/restaurants'])
  }

  toSignup(){
    this.router.navigate(['/register'])
  }
}