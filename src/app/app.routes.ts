import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent as RegisterComponent } from './routes/auth/register/register.component';
import { RestaurantHubComponent } from './routes/restaurant/restaurant-hub/restaurant-hub.component';
import { AuthGuard } from './core/guards/AuthGuard';
import { RestaurantCreationComponent } from './routes/restaurant/restaurant-creation/restaurant-creation.component';
import { RestaurantGuard } from './core/guards/RestaurantGuard';
import { PlanningComponent } from './routes/dashboard/planning/planning.component';
import { StaffComponent } from './routes/dashboard/staff/staff.component';
import { ReservationComponent } from './routes/reservation/reservation.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/restaurants', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent },
    { path: 'restaurants', canActivate: [AuthGuard], component: RestaurantHubComponent },
    { path: 'restaurants/creation', canActivate: [AuthGuard], component: RestaurantCreationComponent },
    { path: 'dashboard',   redirectTo: '/dashboard/planning', pathMatch: 'full' },
    { path: 'dashboard/planning', canActivate: [AuthGuard, RestaurantGuard], component: PlanningComponent },
    { path: 'dashboard/personnel', canActivate: [AuthGuard, RestaurantGuard], component: StaffComponent },
    { path: 'reservation', component: ReservationComponent }
];