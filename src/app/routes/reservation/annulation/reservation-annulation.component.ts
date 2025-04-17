import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ReservationService } from '@/app/core/services/reservation.service';
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
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private reservationService: ReservationService,
      private toastService: ToastService,
    ) {
      this.reservationId = this.route.snapshot.queryParamMap.get('reservation');
    }

    getReservation(): void {
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