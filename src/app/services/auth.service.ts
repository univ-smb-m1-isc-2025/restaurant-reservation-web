import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { LoginRequest } from '@/app/models/loginRequest.interface';
import { RegisterRequest } from '@/app/models/registerRequest.interface';
import { StorageService } from '@/app/services/storage.service';
import { AuthResponse } from '@/app/models/user.model';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private _authenticatedUser: AuthResponse | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {
    const savedUser = this.storageService.getSavedUser();
    if (savedUser) {
      this.initializeUser(savedUser);
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  login(data: LoginRequest) {
    const url = `${environment.apiBaseUrl}/auth/login`;
  
    return this.http
      .request<AuthResponse>('post', url, {
        body: data,
      })
      .pipe(
        catchError((error) => throwError(() => new Error(error.message))),
        tap((response: any) => {
          if (response && response.data) {
            const authResponse: AuthResponse = {
              token: response.data.token,
              user: response.data,
            };
  
            this.storageService.saveUser(authResponse);
            this.initializeUser(authResponse);
          } else {
            console.error('Aucune donnée utilisateur dans la réponse');
          }
        }),
      );
  }  

  register(data: RegisterRequest) {
    const url = `${environment.apiBaseUrl}/auth/register`;
  
    return this.http
      .request<AuthResponse>('post', url, {
        body: data,
      })
      .pipe(
        catchError((error) => throwError(() => new Error(error.message))),
        tap((response: any) => {
          if (response && response.data) {
            const authResponse: AuthResponse = {
              token: response.data.token,
              user: response.data,
            };
  
            this.storageService.saveUser(authResponse);
            this.initializeUser(authResponse);
          } else {
            console.error('Aucune donnée utilisateur dans la réponse');
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

  private initializeUser(authResponse: AuthResponse) {
    this._authenticatedUser = authResponse;
  }

  private resetUser() {
    this._authenticatedUser = null;
  }
}
