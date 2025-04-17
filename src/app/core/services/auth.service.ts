import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { LoginRequest } from '@/app/core/models/loginRequest';
import { RegisterRequest } from '@/app/core/models/registerRequest';
import { StorageService } from '@/app/core/services/storage.service';
import { AuthResponse } from '@/app/core/models/user';
import { Role } from '../models/staff';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private _authenticatedUser: AuthResponse | null = null;
  private _authenticatedUserRole: Role | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {
    const savedUser = this.storageService.getSavedUser();
    if (savedUser) this.initializeUser(savedUser)

    const savedRole = this.storageService.getSavedRole();
    if (savedRole) this.initializeRole(savedRole)
  }

  login(data: LoginRequest) {
    const url = `${environment.apiBaseUrl}/auth/login`;
  
    return this.http
      .request<AuthResponse>('post', url, {
        body: data,
      })
      .pipe(
        catchError((error) => {
          const errorMessage = error.error?.message || "Une erreur est survenue";
          return throwError(() => new Error(errorMessage));
        }),
        tap((response: any) => {
          if (response && response.data) {
            const authResponse: AuthResponse = {
              token: response.data.token,
              user: response.data,
            };
  
            this.storageService.saveUser(authResponse);
            this.initializeUser(authResponse);
          } else {
            throw new Error(response.message);
          }
        })
      );
  }  

  register(data: RegisterRequest) {
    const url = `${environment.apiBaseUrl}/auth/register`;
  
    return this.http
      .request<AuthResponse>('post', url, {
        body: data,
      })
      .pipe(
        catchError((error) => {
          const errorMessage = error.error?.message || "Une erreur est survenue";
          return throwError(() => new Error(errorMessage));
        }),
        tap((response: any) => {
          if (response && response.data) {
            const authResponse: AuthResponse = {
              token: response.data.token,
              user: response.data,
            };
  
            this.storageService.saveUser(authResponse);
            this.initializeUser(authResponse);
          } else {
            throw new Error(response.message);
          }
        }),
      );
  }

  isAuthenticatedUser(): boolean {
    return !!this._authenticatedUser;
  }

  getAuthenticatedUser(): AuthResponse | null {
    return this._authenticatedUser;
  }

  getAuthenticatedUserRole(): Role | null {
    return this._authenticatedUserRole;
  }

  isAdmin(): Boolean {
    return this._authenticatedUserRole?.roleName != "EMPLOYEE";
  }

  resetUser() {
    this._authenticatedUser = null;
    this.storageService.clean();
  }

  initializeUser(authResponse: AuthResponse) {
    this._authenticatedUser = authResponse;
  }

  initializeRole(role: Role) {
    this._authenticatedUserRole = role;
  }
}
