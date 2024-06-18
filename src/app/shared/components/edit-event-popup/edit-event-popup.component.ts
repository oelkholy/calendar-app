import { Component, DestroyRef, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-event-popup',
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
    MatIconModule,
  ],
  templateUrl: './edit-event-popup.component.html',
  styleUrl: './edit-event-popup.component.scss',
})
export class EditEventPopupComponent implements OnInit {
  eventForm: FormGroup;
  timeslots: Timeslot[] = timelots;
  filteredEndTimes: Timeslot[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditEventPopupComponent>,
    public calendarService: CalendarService,
    private destroyRef: DestroyRef,
    @Inject(MAT_DIALOG_DATA) public data: CalendarEvent
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.filterTimeTo();
  }

  initForm() {
    this.eventForm = this.formBuilder.group({
      title: [this.data.title, Validators.required],
      startTime: [this.data.startTime, Validators.required],
      endTime: [this.data.endTime, Validators.required],
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
        this.filteredEndTimes = this.timeslots.filter(
          (timeSlot) => timeSlot.value > startTime
        );
      });
  }

  getTimeFromValue(value: number): string {
    const timeSlot = this.timeslots.find(
      (slot: Timeslot) => slot.value === value
    );
    return timeSlot ? timeSlot.title : '';
  }

  onSave(): void {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.valid) {
      const eventData: CalendarEvent = {
        id: this.data.id,
        title: this.eventForm.value.title,
        startTime: this.eventForm.value.startTime,
        endTime: this.eventForm.value.endTime,
        date: this.calendarService.dateSubject.value,
      };
      this.dialogRef.close(eventData);
    }
  }

  onDelete() {
    this.calendarService.deleteEvent(this.data.id);
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
