import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActiveToast, ToastPackage, ToastrService } from 'ngx-toastr';
import { PatientReminderService } from './patient-reminders.service';
import { PatientService } from '../../services/patient.service';
import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties';
import { take } from 'rxjs/operators';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';

@Component({
  selector: 'patient-reminders',
  templateUrl: './patient-reminders.components.html',
  styleUrls: ['./patient-reminder.component.css']
})
export class PatientRemindersComponent implements OnInit, OnDestroy {
  public patient: any;
  public reminders: any;
  public subscriptions: Array<Subscription> = [];
  public errorMessage: string;
  public toastrConfig: any = {
    extendedTimeOut: 0,
    timeOut: 0,
    positionClass: 'toast-bottom-right',
    closeButton: true,
    reminder: null,
    preventDuplicates: true
  };
  private remindersLoaded = false;

  constructor(
    private toastrService: ToastrService,
    private patientReminderService: PatientReminderService,
    private patientService: PatientService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private programManagerService: ProgramManagerService,
    public patientProgramResourceService: PatientProgramResourceService,
    private appFeatureAnalytics: AppFeatureAnalytics
  ) {}

  public ngOnInit(): void {
    this.getPatient();
    // app feature analytics
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Patient Clinical Summary Loaded',
      'ngOnInit'
    );
  }

  public ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      _.each(this.subscriptions, (sub) => {
        if (sub) {
          sub.unsubscribe();
        }
      });
    }
  }

  public getPatient() {
    let enrolledToPrep = false;
    const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          _.each(this.patient.enrolledPrograms, (p) => {
            if (
              p.enrolledProgram != null &&
              p.enrolledProgram.programUuid ===
                'c19aec66-1a40-4588-9b03-b6be55a8dd1d'
            ) {
              enrolledToPrep = true;
            }
          });
          const patientUuid = patient.person.uuid;
          if (!this.remindersLoaded) {
            const sub2 = this.patientReminderService
              .getPatientReminders(patientUuid, enrolledToPrep)
              .subscribe(
                (data) => {
                  this.remindersLoaded = true;
                  this.reminders = [];
                  if (
                    !patient.person.dead &&
                    data &&
                    data.personUuid === patientUuid
                  ) {
                    this.reminders = data.generatedReminders;
                    this.constructReminders(this.reminders);
                  }
                },
                (error) => {
                  // console.error('error', error);
                  this.errorMessage = error;
                }
              );
            this.subscriptions.push(sub2);
          }
        }
      }
    );
    this.subscriptions.push(sub);
  }

  public constructReminders(reminders) {
    let toast: ActiveToast<any> = null;
    _.each(reminders, (reminder: any) => {
      if (reminder.auto_register) {
        this.toastrConfig.reminder = reminder;
      }
      if (reminder.type === 'success') {
        toast = this.toastrService.success(
          reminder.message,
          reminder.title,
          this.toastrConfig
        );
      }
      if (reminder.type === 'warning') {
        toast = this.toastrService.warning(
          reminder.message,
          reminder.title,
          this.toastrConfig
        );
      }
      if (reminder.type === 'danger') {
        toast = this.toastrService.error(
          reminder.message,
          reminder.title,
          this.toastrConfig
        );
      }

      if (reminder.type === 'info') {
        toast = this.toastrService.info(
          reminder.message,
          reminder.title,
          this.toastrConfig
        );
      }
      if (reminder.auto_register) {
        this.toastrConfig.reminder = reminder;
        const sub3 = toast.onAction.take(1).subscribe((_reminder) => {
          if (_reminder && _reminder.auto_register) {
            const sub4 = this.enrollPatientToProgram(
              {
                patient: this.patient,
                programUuid: _reminder.auto_register
              },
              _reminder,
              toast
            );
          }
        });
        this.subscriptions.push(sub3);
      }
    });
  }

  private enrollPatientToProgram(payload, reminder, toast) {
    const location: any = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    payload.location = location.uuid;
    this.getIncompatiblePrograms(payload.programUuid)
      .pipe(take(1))
      .subscribe((incompatiblePrograms: any[]) => {
        if (incompatiblePrograms && incompatiblePrograms.length > 0) {
          this.programManagerService
            .editProgramEnrollments('stop', this.patient, incompatiblePrograms)
            .subscribe(() => {
              this.programManagerService
                .enrollPatient(payload)
                .pipe(take(1))
                .subscribe((program) => {
                  this.completeEnrollment(program, toast, reminder);
                });
            });
        } else {
          this.programManagerService
            .enrollPatient(payload)
            .pipe(take(1))
            .subscribe((program) => {
              this.completeEnrollment(program, toast, reminder);
            });
        }
      });
  }

  private completeEnrollment(program, toast, reminder) {
    delete this.toastrConfig.reminder;
    this.toastrConfig.positionClass = 'toast-bottom-center';
    this.toastrService.show(
      `Patient has been enrolled in
            ${program.display} at location ${program.location.display}`,
      reminder.title,
      this.toastrConfig,
      'toast-default'
    );
    this.toastrService.remove(toast.toastId);
    this.patientService.reloadCurrentPatient();
  }

  private getIncompatiblePrograms(programUuid) {
    let incompatibleList = [];
    const incompatibleListObs: Subject<boolean | any[]> = new Subject<any[]>();
    // get programs patient has enrolled in
    const enrolledList: Array<any> = _.filter(
      this.patient.enrolledPrograms,
      'isEnrolled'
    );

    this.patientProgramResourceService
      .getPatientProgramVisitConfigs(this.patient.uuid)
      .pipe(take(1))
      .subscribe(
        (programConfigs) => {
          if (programConfigs) {
            if (
              programConfigs[programUuid] &&
              programConfigs[programUuid].incompatibleWith
            ) {
              const _incompatibleList =
                programConfigs[programUuid].incompatibleWith;
              incompatibleList = _.filter(enrolledList, (enrolled) => {
                return _.includes(_incompatibleList, enrolled.programUuid);
              });
            }
            incompatibleListObs.next(incompatibleList);
          } else {
            incompatibleListObs.next(false);
          }
        },
        (error) => {
          incompatibleListObs.error(error);
        }
      );
    return incompatibleListObs;
  }
}
