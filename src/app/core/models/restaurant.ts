export interface RestaurantCreationRequest {
  name: string;
  address: string;
  city: string;
  zipcode: string;
  capacity: number;
}

export interface OpeningCreationRequest {
  day: string;
  openingTime: string;
  closingTime: string;
}

export interface ClosureCreationRequest {
  openingId: number;
  dateOfClosure: string;
}

export interface Opening {
  id: number;
  day: string;
  openingTime: string;
  closingTime: string;
  closures: Closure[];
}

export interface Closure {
  id: number;
  closureDate: string;
}

export interface Restaurant {
    id: number;
    name: string;
    address: string;
    city: string;
    zipcode: string;
    capacity: number;
    openings: Opening[];
  }
  
  export interface Role {
    id: number;
    roleName: string;
  }
  
  export interface RestaurantResponse {
    restaurant: Restaurant;
    role: Role;
  }  