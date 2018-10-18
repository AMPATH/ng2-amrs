import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientReminderService } from './patient-reminders.service';
import { PatientService } from '../../services/patient.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';

@Component({
  selector: 'patient-reminders',
  templateUrl: './patient-reminders.components.html',
  styleUrls: ['./patient-reminder.component.css']
})

export class PatientRemindersComponent implements OnInit, OnDestroy {
  public patientUuid: any;
  public reminders: any;
  public subscription: Subscription;
  public errorMessage: string;
  public toastrConfig = {
    timeOut: 0,
    positionClass: 'toast-bottom-right',
    closeButton: true,
    preventDuplicates: true
  };

  constructor(private toastrService: ToastrService,
    private patientReminderService: PatientReminderService,
    private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics) {

    // toastrConfig.timeOut = 0;
    // toastrConfig.closeButton = true;
    // toastrConfig.positionClass = 'toast-bottom-right';
    // toastrConfig.extendedTimeOut = 0;

  }

  public ngOnInit(): void {
    this.getPatient();
    // app feature analytics
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Clinical Summary Loaded', 'ngOnInit');
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patientUuid = patient.person.uuid;
          this.patientReminderService.getPatientReminders(this.patientUuid)
          .take(1).subscribe(
              (data) => {
                this.reminders = [];
                if (!patient.person.dead && data && data.personUuid === this.patientUuid) {
                  this.reminders = data.generatedReminders;
                  this.constructReminders(this.reminders);
                }
              },
              (error) => {
                // console.error('error', error);
                this.errorMessage = error;
              }
            );
        }
      }
    );
  }

  public constructReminders(reminders) {
    _.each(reminders, (reminder: any) => {
      if (reminder.type === 'success') {
        this.toastrService.success(reminder.message, reminder.title, this.toastrConfig);
      }
      if (reminder.type === 'warning') {
        this.toastrService.warning(reminder.message, reminder.title, this.toastrConfig);
      }
      if (reminder.type === 'danger') {
        this.toastrService.error(reminder.message, reminder.title, this.toastrConfig);
      }

      if (reminder.type === 'info') {
        this.toastrService.info(reminder.message, reminder.title, this.toastrConfig);
      }
      // app feature analytics
      this.appFeatureAnalytics
        .trackEvent('Patient Dashboard', 'Patient Reminder Displayed', 'constructReminders');
    });

  }

}
