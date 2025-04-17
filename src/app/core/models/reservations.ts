import { Restaurant } from "./restaurant";

export interface Customer {
  id: number;
  email: string;
  creationDate: string;
}

export interface ReservationResponse {
  id: number;
  customer: Customer;
  nbGuests: number;
  reservationStatus: string;
  reservationDate: string;
}

export interface CreateReservationRequest {
  reservationDate: string;
  email: string;
  nbGuests: number;
}

export interface CreateReservationResponse {
  id: number;
  customer: Customer;
  nbGuests: number;
  restraurant: Restaurant;
  reservationStatus: string;
  reservationDate: string;
}