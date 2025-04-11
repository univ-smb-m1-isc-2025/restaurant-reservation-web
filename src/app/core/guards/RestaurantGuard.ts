import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { RestaurantService } from "@/app/core/services/restaurant.service";

export const RestaurantGuard = () => {
    const restaurantService = inject(RestaurantService);
    const router = inject(Router);

    const selectedRestaurant: Number | null = restaurantService.getSelectedRestaurant();

    if (selectedRestaurant) return true;

    return router.createUrlTree(['/restaurants']);
}