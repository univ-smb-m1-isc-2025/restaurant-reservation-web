import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordValidator } from '@/app/core/validators/passwordValidator';
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
  selector: 'register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})

export class RegisterComponent {
  registerForm!: FormGroup;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, PasswordValidator.strongPassword()]],
      confirmPassword: ['', [Validators.required]],
    },
    { 
      validators: PasswordValidator.matchPasswords('password', 'confirmPassword'), 
      updateOn: 'change'
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        this.toastService.create('L\inscription a été validée avec succès.', ToastType.SUCCESS);
        this.toRestaurantHub()
      },
      error : (error: any) => {
        this.toastService.create('Une erreur est survenue lors de l\inscription',ToastType.ERROR);
        console.error(error)
      }
    });
  }

  toRestaurantHub() {
    this.router.navigate(['/restaurants'])
  }

  toLogin(){
    this.router.navigate(['/login'])
  }
}
