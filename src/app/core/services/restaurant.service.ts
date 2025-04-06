import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '@/environments/environment';
import { RestaurantResponse } from '@/app/core/models/restaurant';
import { StorageService } from '@/app/core/services/storage.service';

@Injectable({
  providedIn: 'root',
})

export class RestaurantService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  getRestaurants() {
    const token = this.storageService.getToken();
    console.log('Token récupéré:', token);
  
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
}