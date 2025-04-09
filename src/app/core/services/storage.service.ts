import { Injectable } from '@angular/core';
import { AuthResponse } from '@/app/core/models/user';

const USER_KEY = 'authenticated-user';
const RESTAURANT_KEY = 'selected-restaurant';

@Injectable({
  providedIn: 'root',
})

export class StorageService {
  constructor() {}

  saveUser(user: AuthResponse) {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getSavedUser(): AuthResponse | null {
    const user = window.localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null!;
  }

  getToken(): string {
    const user = this.getSavedUser();
    return user ? user.token : "";
  }

  saveSelectedRestaurant(restaurant: number): void {
    window.localStorage.removeItem(RESTAURANT_KEY);
    window.localStorage.setItem(RESTAURANT_KEY, JSON.stringify(restaurant));
  }
  
  getSelectedRestaurant(): number | null {
    const restaurant = window.localStorage.getItem(RESTAURANT_KEY);
    return restaurant ? JSON.parse(restaurant) : null;
  }

  clean(): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(RESTAURANT_KEY);
  }
}
