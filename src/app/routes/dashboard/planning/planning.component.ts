import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { StorageService } from '@/app/core/services/storage.service';
import { RestaurantService } from '@/app/core/services/restaurant.service';
import { RestaurantResponse, Restaurant } from '@/app/core/models/restaurant';
import { PlanningService } from '@/app/core/services/planning.service';
import { ReservationService } from '@/app/core/services/reservation.service';
import { SidebarComponent } from "@/app/shared/components/sidebar/sidebar.component";
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ToastService } from '@/app/core/services/toast.service';
import { ToastType } from '@/app/core/models/toast';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ReservationResponse } from '@/app/core/models/reservations';
import { Role } from '@/app/core/models/staff';

@Component({
  selector: 'planning',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FullCalendarModule, ReactiveFormsModule],
  templateUrl: './planning.component.html',
})

export class PlanningComponent {
  openingForm!: FormGroup;
  auth: AuthResponse | null = null;
  restaurant: Number | null = null;
  admin: Boolean | null = null;
  restaurantFull: Restaurant | null = null;
  restaurantResponse: RestaurantResponse[] = [];
  reservations: ReservationResponse[] = [];
  private calendarApi: any;

  openings: any[] = [];
  closures: any[] = [];

  selectedSlot: any  | null = null;
  showModal: boolean = false;

  daysOfWeek = [
    { value: 'MONDAY', label: 'Lundi' },
    { value: 'TUESDAY', label: 'Mardi' },
    { value: 'WEDNESDAY', label: 'Mercredi' },
    { value: 'THURSDAY', label: 'Jeudi' },
    { value: 'FRIDAY', label: 'Vendredi' },
    { value: 'SATURDAY', label: 'Samedi' },
    { value: 'SUNDAY', label: 'Dimanche' },
  ];

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin, listPlugin],
    initialView: this.getInitialView(),
    locale: 'fr',
    slotMinTime: '08:00:00',
    slotMaxTime: '24:00:00',
    editable: false,
    events: this.generateEvents(),
    firstDay: 1,
    allDaySlot: false,
    contentHeight: 'auto',
    eventBackgroundColor: '#A8DADC',
    eventTextColor: '#1D3557',
    eventBorderColor: '#A8DADC',
    eventClick: this.onEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: '',
      right: 'title'
    },
    eventDidMount: (info) => {
      if (!this.calendarApi) {
        this.calendarApi = info.view.calendar;
      }
    }
  };  

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private restaurantService: RestaurantService,
    private planningService: PlanningService,
    private reservationService: ReservationService,
    private toastService: ToastService
  ) {
    if (authService.isAuthenticatedUser()) {
      this.auth = this.authService.getAuthenticatedUser();
    } else {
      console.error('Utilisateur non présent dans le localStorage');
    }

    if (storageService.getSelectedRestaurant()) {
      this.restaurant = this.storageService.getSelectedRestaurant();
    } else {
      console.error('Restaurant non sélectionné dans le localStorage');
    }

    if (authService.getAuthenticatedUserRole()) {
      this.admin = this.authService.isAdmin();
    } else {
      console.error('Role non présent dans le localStorage');
    }

    this.openingForm = this.formBuilder.group({
      day: ['', [Validators.required]],
      openingTime: ['', [Validators.required]],
      closingTime: ['', [Validators.required]],
    });

    this.fetchRestaurant();
  }

  getInitialView(): 'timeGridWeek' | 'listWeek' {
    return window.innerWidth < 768 ? 'listWeek' : 'timeGridWeek';
  }

  generateEvents(): EventInput[] {
    const events: EventInput[] = [];
    const closureDates = new Set(this.closures.map(e => e.date));

    this.openings.forEach(slot => {
      const startDate = new Date();
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = new Date(dateStr).getDay();

        const isClosed = this.closures.some(c => c.id === slot.id && c.date === dateStr);

        if (slot.daysOfWeek.includes(dayOfWeek) && !isClosed) {
          events.push({
            id: slot.id,
            title: slot.title,
            start: `${dateStr}T${slot.startTime}`,
            end: `${dateStr}T${slot.endTime}`,
            color: slot.color
          });
        }
      }
    });

    this.closures.forEach(exception => {
      events.push({
        id: exception.id,
        title: exception.title,
        start: `${exception.date}T${exception.startTime}`,
        end: `${exception.date}T${exception.endTime}`,
        color: exception.color,
        display: 'background'
      });
    });

    return events;
  }

  private resetCalendarEvents(): void {
    const savedclosures = [...this.closures];

    this.closures = [];
    this.calendarOptions.events = [];

    setTimeout(() => {
      this.closures = savedclosures;
      this.calendarOptions.events = this.generateEvents();

      if (this.calendarApi) {
        this.calendarApi.refetchEvents();
      }
    }, 50);
  }

  onEventClick(clickInfo: any): void {
    if (clickInfo.event.display === 'background') {
      return;
    }

    const eventId = clickInfo.event.id;
    const eventDate = clickInfo.event.start;

    const slot = this.openings.find(s => s.id === eventId);

    if (!slot) {
      console.warn("Créneau non trouvé:", eventId);
      return;
    }

    this.selectedSlot = {
      id: eventId,
      date: eventDate.toISOString().split("T")[0],
      fullDate: eventDate,
      title: slot.title,
      startTime: slot.startTime.substring(0, 5),
      endTime: slot.endTime.substring(0, 5),
    };

    this.showModal = true;
  }

  displayOpenings() {
    this.openings = [];
    this.closures = [];

    if (!this.restaurantFull) return;

    for (let opening of this.restaurantFull.openings) {
      this.addOpeningSlot(opening.id, opening.day, opening.openingTime, opening.closingTime);

      for (let closure of opening.closures) {
        this.addClosureSlot(opening.id, closure.closureDate);
      }
    }

    this.resetCalendarEvents();
  }

  fetchRestaurant() {
    this.restaurantService.getRestaurant().subscribe({
      next: (response) => {
        this.restaurantFull = response.data;
        this.displayOpenings();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants:', err);
      },
    });
  }

  addOpeningSlot(id: number, day: string, openingTime: string, closingTime: string): void {
    const dayMap: Record<string, number> = {
      "SUNDAY": 0, "MONDAY": 1, "TUESDAY": 2, "WEDNESDAY": 3,
      "THURSDAY": 4, "FRIDAY": 5, "SATURDAY": 6
    };

    const dayNumber = dayMap[day.toUpperCase()];
    if (dayNumber === undefined) {
      console.error('Jour invalide:', day);
      return;
    }

    const updatedSlots = JSON.parse(JSON.stringify(this.openings));

    updatedSlots.push({
      id: id.toString(),
      title: 'Ouvert',
      daysOfWeek: [dayNumber],
      startTime: openingTime,
      endTime: closingTime,
      color: '#4caf50'
    });

    this.openings = updatedSlots;
  }

  createOpening() {
    if (this.openingForm.invalid) {
      this.openingForm.markAllAsTouched();
      return;
    }

    this.planningService.createOpening(this.openingForm.value).subscribe({
      next: (response) => {
        this.toastService.create(response.message, ToastType.SUCCESS);
        this.fetchRestaurant();
        this.openingForm.reset();
      },
      error: (error) => {
        this.toastService.create(error, ToastType.ERROR);
      }
    });
  }

  addClosureSlot(slotId: number, closureDate: string): void {
    const slot = this.openings.find(s => s.id === slotId.toString());

    if (!slot) {
      console.error('Créneau non trouvé pour l\'ID:', slotId.toString());
      return;
    }

    const newException = {
      id: slotId.toString(),
      date: closureDate,
      title: `Fermé`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      color: '#FFA500'
    };

    this.closures.push(newException);
  }

  getReservations(openingId: string, date: string): void {
    this.reservationService.getReservations(openingId, date).subscribe({
      next: (response) => {
        this.reservations = response.data;
        console.log(this.reservations);
      },
      error: (error) => {
        this.toastService.create(error, ToastType.ERROR);
      }
    });
  }

  confirmReservation(reservationId: number): void {
    this.reservationService.confirmReservation(reservationId.toString()).subscribe({
      next: (response) => {
        this.toastService.create(response.message, ToastType.SUCCESS);
        this.getReservations(this.selectedSlot.id, this.selectedSlot.date);
      },
      error: (error) => {
        this.toastService.create(error, ToastType.ERROR);
      }
    });
  }

  cancelReservation(reservationId: number): void {
    this.reservationService.cancelReservation(reservationId.toString()).subscribe({
      next: (response) => {
        this.toastService.create(response.message, ToastType.SUCCESS);
        this.getReservations(this.selectedSlot.id, this.selectedSlot.date);
      },
      error: (error) => {
        this.toastService.create(error, ToastType.ERROR);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
  }

  handleCreateClosure(): void {
    const { id, date } = this.selectedSlot;
    this.planningService.createClosure(id, date).subscribe({
      next: (res) => {
        this.toastService.create(res.message, ToastType.SUCCESS);
        this.fetchRestaurant();
        this.closeModal();
      },
      error: (err) => {
        this.toastService.create(err, ToastType.ERROR);
      }
    });
  }

  handleGetReservations(): void {
    console.log(this.selectedSlot);
    const { id, date } = this.selectedSlot;
    this.getReservations(id, date);
    this.closeModal();
  }
}