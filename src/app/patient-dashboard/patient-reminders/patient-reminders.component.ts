import { ToastrService, ToastrConfig } from 'toastr-ng2';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientReminderService } from './patient-reminders.service';
import { PatientService } from '../patient.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'patient-reminders',
  templateUrl: './patient-reminders.components.html',
  styleUrls: ['patient-reminder.component.css']
})

export class PatientRemindersComponent implements OnInit, OnDestroy {
  patientUuid: any;
  reminders: any;
  subscription: Subscription;
  public errorMessage: string;

  constructor(private toastrService: ToastrService,
    private patientReminderService: PatientReminderService,
    private patientService: PatientService,
    private toastrConfig: ToastrConfig) {

    toastrConfig.timeOut = 0;
    toastrConfig.closeButton = true;
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.extendedTimeOut = 0;
    toastrConfig.preventDuplicates = true;

  }

  ngOnInit(): void {
    this.getPatient();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patientUuid = patient.person.uuid;
          let request = this.patientReminderService.getPatientReminders(this.patientUuid);
          request
            .subscribe(
            (data) => {
              if (data && data.personUuid === this.patientUuid) {
                this.reminders = data.generatedReminders;
                this.constructReminders(this.reminders);
              }

            },
            (error) => {
              console.log('error', error);
              this.errorMessage = error;
            }
            );
        }
      }
    );
  }

  constructReminders(reminders) {
    _.each(reminders, (reminder) => {
      if (reminder.type === 'success') {
        this.toastrService.success(reminder.message, reminder.title);
      }
      if (reminder.type === 'warning') {
        this.toastrService.warning(reminder.message, reminder.title);
      }
      if (reminder.type === 'danger') {
        this.toastrService.error(reminder.message, reminder.title);
      }
    });

  }


}
