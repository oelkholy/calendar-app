import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { CalendarService } from '../../core/services/calendar.service';
import { AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CalendarEvent } from '../../core/models/calendar-event.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CalendarComponent, AsyncPipe],
})
export class HomeComponent implements OnInit {
  events$: Observable<CalendarEvent[]>;

  calendarService = inject(CalendarService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.filterEvents();
  }

  filterEvents() {
    this.calendarService.selectedDate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => {
        this.events$ = this.calendarService.events$.pipe(
          map((events) => {
            return events.filter((event) => {
              return (
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear() &&
                event.date.getDate() === date.getDate()
              );
            });
          })
        );
      });
  }
}
