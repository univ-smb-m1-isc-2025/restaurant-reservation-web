import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { LoginRequest } from '@/app/models/loginRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(data: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}`, data);
  }
}
