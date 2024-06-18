import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarEvent } from '../../../core/models/calendar-event.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { timelots } from '../../../core/consts/timeslots';
import { CalendarService } from '../../../core/services/calendar.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Timeslot } from '../../../core/models/timeslot.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-add-event-popup',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './add-event-popup.component.html',
  styleUrl: './add-event-popup.component.scss',
})
export class AddEventPopupComponent implements OnInit {
  eventForm: FormGroup;
  timeslots: Timeslot[] = timelots;
  filteredEndTimes: Timeslot[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEventPopupComponent>,
    public calendarService: CalendarService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.filterTimeTo();
  }

  initForm() {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    });
  }

  filterTimeTo() {
    this.eventForm
      .get('startTime')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(this.eventForm.get('startTime')?.value)
      )
      .subscribe((startTime) => {
        this.eventForm.get('endTime')?.reset();
        this.filteredEndTimes = this.timeslots.filter(
          (timeSlot) => timeSlot.value > startTime
        );
      });
  }

  getTimeFromValue(value: number): string {
    const timeSlot = this.timeslots.find((slot: any) => slot.value === value);
    return timeSlot ? timeSlot.title : '';
  }

  onSave(): void {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.valid) {
      const eventData: CalendarEvent = {
        id: 0,
        title: this.eventForm.value.title,
        startTime: this.eventForm.value.startTime,
        endTime: this.eventForm.value.endTime,
        date: this.calendarService.dateSubject.value,
      };
      this.dialogRef.close(eventData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
