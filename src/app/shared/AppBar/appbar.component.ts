import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';

@Component({
  selector: 'appbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appbar.component.html'
})
export class AppbarComponent {
  auth: AuthResponse | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
  ){
    if (authService.isAuthenticatedUser()) {
      this.auth = this.authService.getAuthenticatedUser();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }
  }

  logout() {
    this.authService.resetUser();
    this.router.navigate(['/login']);
  }
}
