import { Injectable } from '@angular/core';
import { AuthResponse } from '@/app/models/user.model';

const USER_KEY = 'authenticated-user';

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

  clean(): void {
    window.localStorage.removeItem(USER_KEY);
  }
}
