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
  selector: 'signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  signupForm!: FormGroup;

  ngOnInit(): void {
    this.signupForm = this.fb.group(
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
    this.signupForm.markAllAsTouched();

    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response: any) => {
          console.log(response)
        },
        error : (error: any) => {
          console.error(error)
        }
      }); 
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  toLogin(){
    this.router.navigate(['/login'])
  }
}
