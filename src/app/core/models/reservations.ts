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