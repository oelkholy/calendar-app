import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AddEventPopupComponent } from '../../shared/components/add-event-popup/add-event-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent } from '../models/calendar-event.model';
import { EditEventPopupComponent } from '../../shared/components/edit-event-popup/edit-event-popup.component';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  dateSubject = new BehaviorSubject<Date>(new Date());
  selectedDate$ = this.dateSubject.asObservable();

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private events: CalendarEvent[] = [];

  dialog = inject(MatDialog);

  get events$() {
    return this.eventsSubject.asObservable();
  }

  setDate(date: Date) {
    this.dateSubject.next(date);
  }

  openAddEventDialog() {
    const dialogRef = this.dialog.open(AddEventPopupComponent, {
      width: '400px',
    });

    return dialogRef;
  }

  addEvent(event: CalendarEvent) {
    event.id = this.events.length + 1;
    this.events.push(event);
    this.eventsSubject.next(this.events);
  }

  openEditEventDialog(event: CalendarEvent) {
    const dialogRef = this.dialog.open(EditEventPopupComponent, {
      width: '400px',
      data: event,
    });

    return dialogRef;
  }

  editEvent(event: CalendarEvent) {
    const index = this.events.findIndex((e) => e.id === event.id);

    if (index !== -1) {
      this.events[index] = event;
      this.eventsSubject.next(this.events.slice());
    }
  }

  deleteEvent(id: number) {
    const index = this.events.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      this.eventsSubject.next(this.events.slice());
    }
  }
}
