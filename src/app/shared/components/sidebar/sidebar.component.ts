import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarService } from '../../../core/services/calendar.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    AsyncPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements AfterViewInit {
  // Services
  calendarService = inject(CalendarService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>;

  ngAfterViewInit(): void {
    this.subscribeToDateChange();
  }

  subscribeToDateChange() {
    this.calendarService.selectedDate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => {
        this.goToDate(date);
      });
  }

  // Switch calendar view to show the month related to the selected date
  goToDate(date: Date) {
    this.calendar._goToDateInView(date, 'month');
  }
}
