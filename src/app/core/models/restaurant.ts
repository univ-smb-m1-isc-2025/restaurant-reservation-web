export interface Restaurant {
    id: number;
    name: string;
    address: string;
    city: string;
    zipcode: string;
    capacity: number;
    openings: any[];
  }
  
  export interface Role {
    id: number;
    roleName: string;
  }
  
  export interface RestaurantResponse {
    restaurant: Restaurant;
    role: Role;
  }  