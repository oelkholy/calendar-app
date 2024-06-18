import { Component } from '@angular/core';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CalendarComponent],
})
export class HomeComponent {}
