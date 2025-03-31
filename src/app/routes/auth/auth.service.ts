import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { LoginRequest } from '@/app/models/loginRequest.interface';
import { RegisterRequest } from '@/app/models/registerRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authenticated = false;

  login(data: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}/auth/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, data);
  }

  authenticate() {
    this.authenticated = true;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}
