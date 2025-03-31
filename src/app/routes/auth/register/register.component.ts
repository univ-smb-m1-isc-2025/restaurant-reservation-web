import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { passwordMatchValidator } from '@app/validators/passwordMatchValidator';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class Registercomponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword')
      }
    );
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          if (response.status == "success") {
            console.log("ça passe !!!")
            this.toRestaurantHub()
          }
        },
        error : (error: any) => {
          console.error(error)
        }
      }); 
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  toLogin(){
    this.router.navigate(['/login'])
  }

  toRestaurantHub() {
    this.router.navigate(['/restaurant-hub'])
  }
}
