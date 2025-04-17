import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ReservationService } from '@/app/core/services/reservation.service';
import { ReservationResponse } from '@/app/core/models/reservations';
import { ToastService } from '@/app/core/services/toast.service';
import { ToastType } from '@/app/core/models/toast';

@Component({
  selector: 'reservation-annulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-annulation.component.html'
})
export class ReservationAnnulationComponent {
  reservationId: string | null = null;
  reservation: ReservationResponse | null = null;
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private reservationService: ReservationService,
      private toastService: ToastService,
    ) {
      this.reservationId = this.route.snapshot.queryParamMap.get('reservation');
      this.getReservation();
    }

    getReservation(): void {
      if(!this.reservationId) return;

      this.reservationService.getReservation(this.reservationId).subscribe({
          next: (response) => {
            this.reservation = response.data;
          },
          error : (error) => {
    
            this.toastService.create(error,ToastType.ERROR);
            console.error(error)
          }
      });
    }

    getReservationDate() {
      const isoDate = this.reservation?.reservationDate;
      const date = new Date(isoDate!);

      const dateFr = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return dateFr;
    }

    getReservationHour() {
      const isoDate = this.reservation?.reservationDate;
      const date = new Date(isoDate!);
      
      const hour = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return hour;
    }
  
    onSubmit(): void {
      if(!this.reservationId) return;

      this.reservationService.cancelReservation(this.reservationId).subscribe({
          next: (response) => {
            this.toastService.create(response.message, ToastType.SUCCESS);
          },
          error : (error) => {
    
            this.toastService.create(error,ToastType.ERROR);
            console.error(error)
          }
      });
    }
}