import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatDatepickerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  selected = model<Date | null>(null);
}
