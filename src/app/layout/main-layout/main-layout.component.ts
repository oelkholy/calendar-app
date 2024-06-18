import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerService } from '../../core/services/drawer.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
    MatSidenavModule,
    AsyncPipe,
  ],
})
export class MainLayoutComponent {
  drawerService = inject(DrawerService);
}
