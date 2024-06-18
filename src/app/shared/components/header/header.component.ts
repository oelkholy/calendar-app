import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  date = new Date();

  setTodaysDate() {
    this.date = new Date();
  }
  setPrevDate() {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() - 1);
    this.date = newDate;
  }

  setNextDate() {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() + 1);
    this.date = newDate;
  }
}
