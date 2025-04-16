import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { OpeningCreationRequest, RestaurantResponse } from '@/app/core/models/restaurant';
import { StorageService } from '@/app/core/services/storage.service';

@Injectable({
  providedIn: 'root',
})

export class PlanningService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  createOpening(data: OpeningCreationRequest) {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/restaurant/${restaurantId}/opening/create`;

    return this.http
      .request<{ status: string; message: string; data: RestaurantResponse[] }>('post', url, {
        body: [data],
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

  createClosure(openingId: number, dateOfClosure:string) {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/restaurant/${restaurantId}/closure/create`;
  
    return this.http
      .request<{ status: string; message: string; data: RestaurantResponse[] }>('post', url, {
        body: {openingId, dateOfClosure},
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