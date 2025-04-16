import { Restaurant } from "./restaurant";

export interface Customer {
  id: number;
  phone: string;
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
  customerPhone: string;
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