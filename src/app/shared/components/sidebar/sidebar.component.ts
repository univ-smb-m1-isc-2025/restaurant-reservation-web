import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@/environments/environment';
import { Router, RouterModule  } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { StorageService } from '@/app/core/services/storage.service';
import { AuthResponse } from '@/app/core/models/user';
import { ToastService } from '@/app/core/services/toast.service';
import { ToastType } from '@/app/core/models/toast';

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
  private scrollY = 0;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService
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
    if (this.isMobileView) {
      this.isSidebarVisible = false;
    } else {
      this.isSidebarVisible = true;
    }

    if (this.isSidebarVisible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;

    if (this.isSidebarVisible) {
      this.scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // on réactive le scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, this.scrollY);
    }
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

  copyReservationLink(): void {
    const link = `${environment.webBaseUrl}/reservation?restaurant=${this.storageService.getSelectedRestaurant()}`;
    const iframeCode = `<iframe width="600" height="750" src="${link}"></iframe>`;
    
    navigator.clipboard.writeText(iframeCode)
      .then(() => this.toastService.create('Code iframe copié dans le presse-papier', ToastType.SUCCESS))
      .catch(() => this.toastService.create('Échec de la copie', ToastType.ERROR));
  }  
}