import { Component, Input, OnInit, inject } from '@angular/core';
import { CalendarEvent } from '../../../core/models/calendar-event.model';
import { timelots } from '../../../core/consts/timeslots';
import { CalendarService } from '../../../core/services/calendar.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Timeslot } from '../../../core/models/timeslot.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, AsyncPipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  timeSlots: Timeslot[] = timelots;

  @Input({ required: true }) events: CalendarEvent[] = [];

  // Services
  calendarService = inject(CalendarService);

  ngOnInit(): void {}

  calculateMarginTop(value: number) {
    return `calc((${value} * 40px))`;
  }

  calculateMarginLeft(value: CalendarEvent) {
    const mergedEvents = this.getOverlappingEvents(value.id);
    const order = this.getOrderInMergedArray(value.id, mergedEvents);
    return `calc(${order * 120}px)`;
  }

  getOverlappingEvents(eventId: number) {
    const event = this.events.find((e) => e.id === eventId);

    if (!event) {
      return [];
    }

    const overlappingEvents = this.events.filter(
      (otherEvent) =>
        otherEvent.id !== event.id &&
        otherEvent.startTime < event.endTime &&
        otherEvent.endTime > event.startTime
    );

    // Merge the original event with overlapping events into a single array
    const mergedEvents = [event, ...overlappingEvents];

    // Sort mergedEvents by id
    mergedEvents.sort((a, b) => a.id - b.id);

    return mergedEvents;
  }

  getOrderInMergedArray(id: number, mergedEvents: CalendarEvent[]) {
    return mergedEvents.findIndex((event) => event.id === id);
  }

  calculateHeight(startTime: number, endTime: number) {
    return `calc((${endTime} - ${startTime}) * 40px)`;
  }
}
