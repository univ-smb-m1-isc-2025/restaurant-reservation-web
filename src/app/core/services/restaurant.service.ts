import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { RestaurantCreationRequest, RestaurantResponse } from '@/app/core/models/restaurant';
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
        catchError((error) => throwError(() => new Error(error.message))),
        tap((response) => {
          if (response && response.data) {
            console.log('Restaurants récupérés avec succès:', response.data);
          } else {
            console.error('Aucune donnée reçue');
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
        catchError((error) => throwError(() => new Error(error.message))),
        tap((response) => {
          if (response && response.data) {
            console.log('Restaurant créé avec succès:', response.data);
          } else {
            console.error('Aucune donnée reçue');
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