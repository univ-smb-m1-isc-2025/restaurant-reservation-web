import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@/app/services/auth.service";
import { AuthResponse } from '../models/user.model';

export const AuthGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const authenticatedUser: AuthResponse | null = authService.getAuthenticatedUser();

    if (authenticatedUser) return true;

    return router.createUrlTree(['/login']);
}