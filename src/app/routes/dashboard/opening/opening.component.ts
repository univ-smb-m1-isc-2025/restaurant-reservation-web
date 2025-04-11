import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { AuthResponse } from '@/app/core/models/user';
import { StorageService } from '@/app/core/services/storage.service';
import { RestaurantService } from '@/app/core/services/restaurant.service';
import { RestaurantResponse } from '@/app/core/models/restaurant';
import { SidebarComponent } from "@/app/shared/components/sidebar/sidebar.component";
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'opening',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FullCalendarModule],
  templateUrl: './opening.component.html',
})

export class OpeningComponent {
  auth: AuthResponse | null = null;
  restaurant: Number | null = null;
  restaurantResponse: RestaurantResponse[] = [];
  private calendarApi: any;

  recurringSlots = [
    {
      id: "8",
      title: 'Ouvert',
      daysOfWeek: [6],
      startTime: '12:00',
      endTime: '14:00',
      color: '#4caf50',
    },
  ];

  exceptions = [
    {
      date: '2025-04-26',
      title: 'Fermé exceptionnel',
      startTime: '12:00',
      endTime: '16:00',
      color: '#ff6b6b'
    },
    {
      date: '2025-05-03',
      title: 'Fermé pour congés',
      startTime: '00:00',
      endTime: '23:59', 
      color: '#ff6b6b'
    }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'fr',
    slotMinTime: '12:00:00',
    slotMaxTime: '24:00:00',
    editable: false,
    events: this.generateEvents(),
    firstDay: 1,
    allDaySlot: false,
    contentHeight: 'auto',
    eventBackgroundColor: '#A8DADC',
    eventTextColor: '#1D3557',
    eventBorderColor: '#A8DADC',
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    eventDidMount: (info) => {
      if (!this.calendarApi) {
        this.calendarApi = info.view.calendar;
      }
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private restaurantService: RestaurantService
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
  }

  generateEvents(): EventInput[] {
    const events: EventInput[] = [];
    const exceptionDates = new Set(this.exceptions.map(e => e.date));
  
    this.recurringSlots.forEach(slot => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');
  
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = new Date(dateStr).getDay();
  
        if (slot.daysOfWeek.includes(dayOfWeek) && !exceptionDates.has(dateStr)) {
          events.push({
            id: slot.id,
            title: slot.title,
            start: `${dateStr}T${slot.startTime}:00`,
            end: `${dateStr}T${slot.endTime}:00`,
            color: slot.color
          });
        }
      }
    });
  
    this.exceptions.forEach(exception => {
      events.push({
        title: exception.title,
        start: `${exception.date}T${exception.startTime}:00`,
        end: `${exception.date}T${exception.endTime}:00`,
        color: exception.color,
        display: 'background'
      });
    });
  
    return events;
  }

  addRecurringSlot(id: number, day: string, openingTime: string, closingTime: string): void {
    const dayMap: Record<string, number> = {
      "SUNDAY": 0, "MONDAY": 1, "TUESDAY": 2, "WEDNESDAY": 3,
      "THURSDAY": 4, "FRIDAY": 5, "SATURDAY": 6
    };

    const dayNumber = dayMap[day.toUpperCase()];
    
    if (dayNumber === undefined) {
      console.error('Jour invalide:', day);
      return;
    }

    const updatedSlots = JSON.parse(JSON.stringify(this.recurringSlots));
    
    updatedSlots.push({
      id: id.toString(),
      title: 'Ouvert',
      daysOfWeek: [dayNumber],
      startTime: openingTime,
      endTime: closingTime,
      color: '#4caf50'
    });

    this.recurringSlots = updatedSlots;
    this.resetCalendarEvents();
  }

  private resetCalendarEvents(): void {
      const savedExceptions = [...this.exceptions];
      
      this.exceptions = [];
      this.calendarOptions.events = [];
      
      setTimeout(() => {
        this.exceptions = savedExceptions;
        this.calendarOptions.events = this.generateEvents();
        
        if (this.calendarApi) {
          this.calendarApi.refetchEvents();
        }
      }, 50);
  }

  addException(slotId: number, exceptionDate: string): void {
    const slot = this.recurringSlots.find(s => s.id === slotId.toString());
  
    if (!slot) {
      console.error('Créneau non trouvé pour l\'ID:', slotId.toString());
      return;
    }

    const newException = {
      date: exceptionDate,
      title: `Fermé`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      color: '#FFA500'
    };
  
    this.exceptions.push(newException);
    this.resetCalendarEvents();
  }

  handleEventClick(clickInfo: any) {
    const eventId = clickInfo.event.id;
    
    const slot = this.recurringSlots.find(s => s.id === eventId);
    
    if (!slot) {
      console.warn('Créneau non trouvé pour l\'ID:', eventId);
      return;
    }

    const eventDate = clickInfo.event.start;
    const formattedDateISO = eventDate.toISOString().split('T')[0];

    console.log('Date', formattedDateISO);
  }

  getFrenchDayName(englishDayName: string): string {
    const dayMap: Record<string, string> = {
      'SUNDAY': 'Dimanche',
      'MONDAY': 'Lundi',
      'TUESDAY': 'Mardi',
      'WEDNESDAY': 'Mercredi',
      'THURSDAY': 'Jeudi',
      'FRIDAY': 'Vendredi',
      'SATURDAY': 'Samedi'
    };
    
    console.log('Jour:', dayMap[englishDayName]);

    return dayMap[englishDayName] || 'UNKNOWN';
  }
  

  addTestSlot() {
    this.addRecurringSlot(9, 'MONDAY', '18:00', '20:00');
  }

  addTestException() {
    this.addException(9, '2025-04-14');
  }
}