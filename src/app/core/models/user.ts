export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}