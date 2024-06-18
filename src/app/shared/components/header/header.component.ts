import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { DrawerService } from '../../../core/services/drawer.service';
import { CalendarService } from '../../../core/services/calendar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatMenuModule,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  date = new Date();

  // Services
  drawerService = inject(DrawerService);
  calendarService = inject(CalendarService);

  setTodaysDate() {
    this.date = new Date();
    this.setCalendarDate();
  }
  setPrevDate() {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() - 1);
    this.date = newDate;
    this.setCalendarDate();
  }

  setNextDate() {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() + 1);
    this.date = newDate;
    this.setCalendarDate();
  }

  private setCalendarDate() {
    this.calendarService.setDate(this.date);
  }
}
