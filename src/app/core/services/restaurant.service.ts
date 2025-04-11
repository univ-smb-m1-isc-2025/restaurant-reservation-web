import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { Restaurant, RestaurantCreationRequest, RestaurantResponse } from '@/app/core/models/restaurant';
import { StorageService } from '@/app/core/services/storage.service';

@Injectable({
  providedIn: 'root',
})

export class RestaurantService {
  private _selectedRestaurant: Number | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {
    const selectedRestaurant = this.storageService.getSelectedRestaurant();
    if (selectedRestaurant) this.initializeRestaurant(selectedRestaurant)
  }

  getRestaurants() {
    const token = this.storageService.getToken();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/restaurant/me`;
  
    return this.http
      .request<{ status: string; message: string; data: RestaurantResponse[] }>('get', url, {
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

  getRestaurant() {
    const token = this.storageService.getToken();
    const restaurantId = this.storageService.getSelectedRestaurant();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/restaurant/${restaurantId}`;
  
    return this.http
      .request<{ status: string; message: string; data: Restaurant }>('get', url, {
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

  createRestaurant(data: RestaurantCreationRequest) {
    const token = this.storageService.getToken();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${environment.apiBaseUrl}/restaurant/create`;
  
    return this.http
      .request<{ status: string; message: string; data: RestaurantResponse[] }>('post', url, {
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

  isSelectedRestaurant(): boolean {
    return !!this._selectedRestaurant;
  }
  
  getSelectedRestaurant(): Number | null {
    return this._selectedRestaurant;
  }

  resetRestaurant() {
    this._selectedRestaurant = null;
    this.storageService.clean();
  }

  initializeRestaurant(restaurantResponse: Number) {
    this._selectedRestaurant = restaurantResponse;
  }
}