import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { ReservationResponse } from '@/app/core/models/reservations';
import { StorageService } from '@/app/core/services/storage.service';

@Injectable({
  providedIn: 'root',
})

export class ReservationService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  getReservations(openingId : string, date : string) {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/reservation/${restaurantId}/opening/${openingId}/date/${date}`;
  
    return this.http
      .request<{ status: string; message: string; data: ReservationResponse[] }>('get', url, {
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
}