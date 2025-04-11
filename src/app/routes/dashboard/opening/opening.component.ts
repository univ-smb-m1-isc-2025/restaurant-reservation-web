import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { StorageService } from '@/app/core/services/storage.service';
import { RestaurantService } from '@/app/core/services/restaurant.service';
import { RestaurantResponse, Restaurant, OpeningCreationRequest } from '@/app/core/models/restaurant';
import { OpeningService } from '@/app/core/services/opening.service';
import { SidebarComponent } from "@/app/shared/components/sidebar/sidebar.component";
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
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

@Component({
  selector: 'opening',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FullCalendarModule, ReactiveFormsModule],
  templateUrl: './opening.component.html',
})

export class OpeningComponent {
  openingForm!: FormGroup;
  auth: AuthResponse | null = null;
  restaurant: Number | null = null;
  restaurantFull: Restaurant | null = null;
  restaurantResponse: RestaurantResponse[] = [];
  private calendarApi: any;

  openings: any[] = [];
  closures: any[] = [];

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
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
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
    eventClick: this.createClosure.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: '',
      right: 'title',
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
    private openingService: OpeningService,
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

    this.openingForm = this.formBuilder.group({
      day: ['', [Validators.required]],
      openingTime: ['', [Validators.required]],
      closingTime: ['', [Validators.required]],
    });

    this.fetchRestaurant();
  }

  generateEvents(): EventInput[] {
    const events: EventInput[] = [];
    const closureDates = new Set(this.closures.map(e => e.date));

    this.openings.forEach(slot => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');
  
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = new Date(dateStr).getDay();
  
        if (slot.daysOfWeek.includes(dayOfWeek) && !closureDates.has(dateStr)) {
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

  displayOpenings() {
    this.openings = [];
    this.closures = [];

    if(!this.restaurantFull) return

    console.log(this.restaurantFull.openings)

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
        console.log(this.restaurantFull)
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

    this.openingService.createOpening(this.openingForm.value).subscribe({
      next: (response) => {
        this.toastService.create(response.message, ToastType.SUCCESS);
        this.fetchRestaurant();
        this.openingForm.reset();
      },
      error : (error) => {
        this.toastService.create(error,ToastType.ERROR);
        console.error(error)
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
      date: closureDate,
      title: `Fermé`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      color: '#FFA500'
    };
  
    this.closures.push(newException);
  }

  createClosure(clickInfo: any) {
    const eventId = clickInfo.event.id;
    
    const slot = this.openings.find(s => s.id === eventId);
    
    if (!slot) {
      console.warn('Créneau non trouvé pour l\'ID:', eventId);
      return;
    }

    const eventDate = clickInfo.event.start;
    const formattedDateISO = eventDate.toISOString().split('T')[0];

    this.openingService.createClosure(eventId, formattedDateISO).subscribe({
      next: (response) => {
        this.toastService.create(response.message,ToastType.SUCCESS);
        this.fetchRestaurant()
      },
      error: (error) => {
        this.toastService.create(error,ToastType.ERROR);
        console.error(error)
      },
    });
  }
}