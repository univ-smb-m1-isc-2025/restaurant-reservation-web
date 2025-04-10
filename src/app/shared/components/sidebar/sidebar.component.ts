import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})

export class SidebarComponent {
  auth: AuthResponse | null = null;
  isSidebarVisible = false;
  isMobileView = false;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.checkViewport();
    if (authService.isAuthenticatedUser()) {
      this.auth = this.authService.getAuthenticatedUser();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }

    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < 768;
    if (!this.isMobileView) {
      this.isSidebarVisible = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  navigateReplace(path: string) {
    this.router.navigate([path], { replaceUrl: true });
  }
  
  isRouteActive(path: string): boolean {
    return this.router.url === path;
  }

  logout() {
    this.authService.resetUser();
    this.router.navigate(['/login']);
  }
}