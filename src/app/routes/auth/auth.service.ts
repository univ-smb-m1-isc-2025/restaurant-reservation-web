import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { LoginRequest } from '@/app/models/loginRequest.interface';
import { SignupRequest } from '@/app/models/signupRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(data: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}/auth/login`, data);
  }

  signup(data: SignupRequest) {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, data);
  }
}
