import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { CalendarEvent } from '../../../core/models/calendar-event.model';
import { timelots } from '../../../core/consts/timeslots';
import { CalendarService } from '../../../core/services/calendar.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Timeslot } from '../../../core/models/timeslot.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
  CdkDragEnd,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, AsyncPipe, CdkDropList, CdkDrag, CdkDropListGroup],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  timeSlots: Timeslot[] = timelots;
  isDragging: boolean;

  @Input({ required: true }) events: CalendarEvent[] = [];

  // Services
  calendarService = inject(CalendarService);
  private destroyRef = inject(DestroyRef);

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

  onClickEvent(event: CalendarEvent, eventId: string) {
    if (this.isDragging) {
      return;
    }
    const { translateY, top } = this.extractValues(
      document.getElementById(eventId)?.getAttribute('style')!
    );
    event = translateY
      ? {
          ...event,
          startTime: translateY + top,
          endTime: translateY + top + (event.endTime - event.startTime),
        }
      : event;
    this.calendarService
      .openEditEventDialog(event)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updatedEvent: CalendarEvent | undefined) => {
        if (updatedEvent) {
          document.getElementById(eventId)!.style.transform = 'translateY(0)';
          this.calendarService.editEvent(updatedEvent);
        }
      });
  }

  extractValues(styleString: string): { top: number; translateY: number } {
    const topRegex = /top:\s*calc\(([\d.-]+)px\);/;
    const translateY3dRegex =
      /transform:\s*translate3d\(.*,\s*([\d.-]+)px,\s*.*\);/;
    const translateYRegex = /transform:\s*translateY\(([-\d.]+)px\);/;

    const topMatch = styleString.match(topRegex);
    const translateY3dMatch = styleString.match(translateY3dRegex);
    const translateYMatch = styleString.match(translateYRegex);

    let translateYValue = 0;

    if (translateY3dMatch) {
      translateYValue = parseFloat(translateY3dMatch[1]);
    } else if (translateYMatch) {
      translateYValue = parseFloat(translateYMatch[1]);
    }

    if (topMatch) {
      const topValue = parseFloat(topMatch[1]);
      return {
        top: topValue / 40,
        translateY: Math.round(translateYValue / 40),
      };
    } else {
      // Handle case where top value is not found
      return { top: 0, translateY: Math.round(translateYValue / 40) };
    }
  }

  onDragStarted() {
    this.isDragging = true;
  }

  onDrop(eventId: string) {
    setTimeout(() => {
      this.isDragging = false;
    }, 0);
    const { translateY } = this.extractValues(
      document.getElementById(eventId)?.getAttribute('style')!
    );
    document.getElementById(eventId)!.style.transform = ` translateY(${
      translateY * 40
    }px)`;
  }
}
