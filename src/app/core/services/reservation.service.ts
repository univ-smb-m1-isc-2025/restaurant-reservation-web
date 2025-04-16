import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { ReservationResponse, CreateReservationRequest, CreateReservationResponse } from '@/app/core/models/reservations';
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

  createReservation(data: CreateReservationRequest) {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/reservation/${restaurantId}/create`;
  
    return this.http
      .request<{ status: string; message: string; data: CreateReservationResponse }>('post', url, {
        body: data,
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

  confirmReservation(reservationId : string) {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/reservation/${restaurantId}/confirm/${reservationId}`;
  
    return this.http
      .request<{ status: string; message: string; data: ReservationResponse[] }>('post', url, {
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
  
  cancelReservation(reservationId : string) {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/reservation/${restaurantId}/cancel/${reservationId}`;
  
    return this.http
      .request<{ status: string; message: string; data: ReservationResponse[] }>('delete', url, {
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