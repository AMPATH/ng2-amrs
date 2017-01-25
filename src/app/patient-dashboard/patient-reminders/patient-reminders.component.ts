import { ToastrService, ToastrConfig } from 'toastr-ng2';
import { Component, OnInit } from '@angular/core';
import { PatientReminderService } from './patient-reminders.service';
import { PatientService } from '../patient.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'patient-reminders',
  template: ''
})

export class PatientRemindersComponent implements OnInit {
  patientUuid: any;
  reminders: any;
  public errorMessage: string;

  constructor(private toastrService: ToastrService,
    private patientReminderService: PatientReminderService,
    private patientService: PatientService,
    private toastrConfig: ToastrConfig,
    private router: Router) {

    toastrConfig.timeOut = 0;
    toastrConfig.closeButton = true;
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.extendedTimeOut = 0;

    router.events.subscribe(event => {
      this.toastrService.clear();
    });
  }

  ngOnInit(): void {
    let reminders = [];
    this.getPatient();
  }

  getPatient() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patientUuid = patient.person.uuid;
          let request = this.patientReminderService.getPatientReminders(this.patientUuid);
          request
            .subscribe(
            (data) => {
              if (data.length > 0) {
                this.reminders = data;
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
    });

  }


}
