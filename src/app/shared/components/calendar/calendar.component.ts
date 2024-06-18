import { Component, OnInit, inject } from '@angular/core';
import { CalendarEvent } from '../../../core/models/calendar-event.model';
import { timelots } from '../../../core/consts/timeslots';
import { CalendarService } from '../../../core/services/calendar.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, AsyncPipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  timeSlots: string[] = timelots;

  events: CalendarEvent[] = [
    {
      id: 1,
      title: 'Event 1',
      startTime: 1,
      endTime: 5,
    },
    {
      id: 2,
      title: 'Event 2',
      startTime: 1,
      endTime: 1.5,
    },
    {
      id: 3,
      title: 'Event 3',
      startTime: 1,
      endTime: 1.5,
    },
    {
      id: 4,
      title: 'Event 4',
      startTime: 3,
      endTime: 9,
    },
    {
      id: 5,
      title: 'Event 5',
      startTime: 10,
      endTime: 11,
    },
    {
      id: 6,
      title: 'Event 6',
      startTime: 1,
      endTime: 9,
    },
    {
      id: 7,
      title: 'Event 7',
      startTime: 1,
      endTime: 9,
    },
    {
      id: 8,
      title: 'Event 8',
      startTime: 2,
      endTime: 3,
    },
    {
      id: 9,
      title: 'Event 9',
      startTime: 2,
      endTime: 12,
    },
    {
      id: 10,
      title: 'Event 10',
      startTime: 11,
      endTime: 12,
    },
    {
      id: 11,
      title: 'Event 11',
      startTime: 10,
      endTime: 11,
    },
    {
      id: 12,
      title: 'Event 12',
      startTime: 10,
      endTime: 11,
    },
    {
      id: 13,
      title: 'Event 13',
      startTime: 10,
      endTime: 11,
    },
    {
      id: 14,
      title: 'Event 14',
      startTime: 10,
      endTime: 11,
    },
    {
      id: 15,
      title: 'Event 15',
      startTime: 10,
      endTime: 11,
    },
  ];

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
