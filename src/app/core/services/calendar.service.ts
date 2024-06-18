import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AddEventPopupComponent } from '../../shared/components/add-event-popup/add-event-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent } from '../models/calendar-event.model';

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
}
