import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { StaffResponse } from '@/app/core/models/staff';
import { StorageService } from '@/app/core/services/storage.service';

@Injectable({
  providedIn: 'root',
})

export class StaffService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

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
        catchError((error) => throwError(() => new Error(error.message))),
        tap((response) => {
          if (response && response.data) {
            console.log('Personnel récupéré avec succès:', response.data);
          } else {
            console.error('Aucune donnée reçue');
          }
        }),
      );
  }
}