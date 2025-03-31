import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';
import { Registercomponent as RegisterComponent } from './routes/auth/register/register.component';
import { RestaurantHubComponent } from './routes/restaurant/restaurant-hub/restaurant-hub.component';
import { AuthGuard } from './guards/AuthGuard';

export const routes: Routes = [
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent },
    { path: 'restaurant-hub', canActivate: [AuthGuard], component: RestaurantHubComponent },
];