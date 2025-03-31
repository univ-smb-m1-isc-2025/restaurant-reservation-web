import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';
import { Registercomponent as RegisterComponent } from './routes/auth/register/register.component';
import { RestaurantHubComponent } from './routes/restaurant/restaurant-hub/restaurant-hub.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent },
    { path: 'restaurant-hub', component: RestaurantHubComponent },
];