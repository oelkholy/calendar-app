import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private drawerOpenSubject = new BehaviorSubject<boolean>(true);
  drawerOpen$ = this.drawerOpenSubject.asObservable();

  toggleDrawer() {
    this.drawerOpenSubject.next(!this.drawerOpenSubject.value);
  }
}
