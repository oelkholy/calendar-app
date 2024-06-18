import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private dateSubject = new BehaviorSubject<Date>(new Date());
  selectedDate$ = this.dateSubject.asObservable();

  setDate(date: Date) {
    this.dateSubject.next(date);
  }
}
