import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { EmployeeCreationRequest, Role, StaffResponse } from '@/app/core/models/staff';
import { StorageService } from '@/app/core/services/storage.service';

@Injectable({
  providedIn: 'root',
})

export class StaffService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  getRoles() {
    const token = this.storageService.getToken();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/role/all`;
  
    return this.http
      .request<{ status: string; message: string; data: Role[] }>('get', url, {
        headers: headers,
      })
      .pipe(
        catchError((error) => throwError(() => new Error(error.message))),
        tap((response) => {
          if (response && response.data) {
            console.log('Roles récupérés avec succès:', response.data);
          } else {
            console.error('Aucune donnée reçue');
          }
        }),
      );
  }

  getRestaurants() {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/restaurant/${restaurantId}/staff/all`;
  
    return this.http
      .request<{ status: string; message: string; data: StaffResponse[] }>('get', url, {
        headers: headers,
      })
      .pipe(
        catchError((error) => {
          const errorMessage = error.error?.message || "Une erreur est survenue";
          return throwError(() => new Error(errorMessage));
        }),
        tap((response) => {
          if (response && response.data) {} else {
            throw new Error(response.message);
          }
        }),
      );
  }

  createEmployee(data: EmployeeCreationRequest) {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/restaurant/${restaurantId}/staff/create`;

    return this.http
      .request<{ status: string; message: string; data: StaffResponse[] }>('post', url, {
        headers: headers,
        body: data,
      })
      .pipe(
        catchError((error) => {
          const errorMessage = error.error?.message || "Une erreur est survenue";
          return throwError(() => new Error(errorMessage));
        }),
        tap((response) => {
          console.log('Réponse de création d\'employé:', response);
          if (response && response.data) {} else {
            throw new Error(response.message);
          }
        }),
      );
  }
}