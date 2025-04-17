import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ReservationService } from '@/app/core/services/reservation.service';
import { ToastService } from '@/app/core/services/toast.service';
import { ToastType } from '@/app/core/models/toast';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation.component.html'
})
export class ReservationComponent {
  restaurantId: string | null = null;

  reservationForm!: FormGroup;
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private reservationService: ReservationService,
      private toastService: ToastService,
    ) {
      this.reservationForm = this.formBuilder.group({
        reservationDate: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        nbGuests: ['', [Validators.required, Validators.min(1)]],
      });

      this.restaurantId = this.route.snapshot.queryParamMap.get('restaurant');
    }
  
    onSubmit(): void {
      if (this.reservationForm.invalid) {
        this.reservationForm.markAllAsTouched();
        return;
      }

      if(!this.restaurantId) return;

      console.log("Passé !!!")
  
      this.reservationService.createReservation(this.restaurantId, this.reservationForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.toastService.create(response.message, ToastType.SUCCESS);
        },
        error : (error) => {
  
          this.toastService.create(error,ToastType.ERROR);
          console.error(error)
        }
      });
    }
}