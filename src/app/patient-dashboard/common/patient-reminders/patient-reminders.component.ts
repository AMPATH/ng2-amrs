import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActiveToast, ToastPackage, ToastrService } from "ngx-toastr";
import { PatientReminderService } from "./patient-reminders.service";
import { PatientService } from "../../services/patient.service";
import * as _ from "lodash";
import { Subject, Subscription } from "rxjs";
import { AppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytics.service";
import { ProgramManagerService } from "../../../program-manager/program-manager.service";
import { UserDefaultPropertiesService } from "../../../user-default-properties";
import { take } from "rxjs/operators";
import { PatientProgramResourceService } from "../../../etl-api/patient-program-resource.service";

@Component({
  selector: "patient-reminders",
  templateUrl: "./patient-reminders.components.html",
  styleUrls: ["./patient-reminder.component.css"],
})
export class PatientRemindersComponent implements OnInit, OnDestroy {
  public patient: any;
  public reminders: any;
  public subscriptions: Array<Subscription> = [];
  public errorMessage: string;
  public toastrConfig: any = {
    extendedTimeOut: 0,
    timeOut: 0,
    positionClass: "toast-bottom-right",
    closeButton: true,
    reminder: null,
    preventDuplicates: true,
  };
  private remindersLoaded = false;
  private familyTestingEnc: any;

  constructor(
    private toastrService: ToastrService,
    private patientReminderService: PatientReminderService,
    private patientService: PatientService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private programManagerService: ProgramManagerService,
    public patientProgramResourceService: PatientProgramResourceService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private encounterResource: EncounterResourceService,
    private localStorageService: LocalStorageService,
    private obsResourceService: ObsResourceService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getPatient();
    // app feature analytics
    this.appFeatureAnalytics.trackEvent(
      "Patient Dashboard",
      "Patient Clinical Summary Loaded",
      "ngOnInit"
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
    const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.getFamilyHistoryEncounter(patient.encounters);
          const patientUuid = patient.person.uuid;
          if (!this.remindersLoaded) {
            const sub2 = this.patientReminderService
              .getPatientReminders(patientUuid)
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
      if (reminder.action) {
        this.toastrConfig.reminder = reminder;
      } else {
        this.toastrConfig.reminder = null;
      }
      if (reminder.type === "success") {
        toast = this.toastrService.success(
          reminder.message,
          reminder.title,
          this.toastrConfig
        );
      }
      if (reminder.type === "warning") {
        toast = this.toastrService.warning(
          reminder.message,
          reminder.title,
          this.toastrConfig
        );
      }
      if (reminder.type === "danger") {
        toast = this.toastrService.error(
          reminder.message,
          reminder.title,
          this.toastrConfig
        );
      }

      if (reminder.type === "info") {
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
                programUuid: _reminder.auto_register,
              },
              _reminder,
              toast
            );
          }
        });
        this.subscriptions.push(sub3);
      }

      if (reminder.addContacts) {
        this.toastrConfig.reminder = reminder;
        const sub5 = toast.onAction.take(1).subscribe((_reminder) => {
          if (_reminder && _reminder.addContacts) {
            const sub6 = this.addContacts(toast);
          }
        });
        this.subscriptions.push(sub5);
      }

      if (reminder.updateContacts) {
        this.toastrConfig.reminder = reminder;
        const sub5 = toast.onAction.take(1).subscribe((_reminder) => {
          if (_reminder && _reminder.updateContacts) {
            const sub6 = this.updateContacts(toast);
          }
        });
        this.subscriptions.push(sub5);
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
            .editProgramEnrollments("stop", this.patient, incompatiblePrograms)
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
    this.toastrConfig.positionClass = "toast-bottom-center";
    this.toastrService.show(
      `Patient has been enrolled in
            ${program.display} at location ${program.location.display}`,
      reminder.title,
      this.toastrConfig,
      "toast-default"
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
      "isEnrolled"
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

  public addContacts(toast) {
    const url = `/patient-dashboard/patient/${this.patient.uuid}/general/general/formentry/3fbc8512-b37b-4bc2-a0f4-8d0ac7955127`;
    this.router.navigate([url], {});
    this.toastrService.remove(toast.toastId);
  }

  public updateContacts(toast) {
    const url = `/patient-dashboard/patient/${this.patient.uuid}/general/general/formentry/3fbc8512-b37b-4bc2-a0f4-8d0ac7955127`;
    const elicitationAction = this.localStorageService.getItem(
      'elicitationAction'
    );
    if (elicitationAction === 'addContacts') {
      this.router.navigate([url], {
        queryParams: {
          encounter: this.familyTestingEnc.uuid,
          visitTypeUuid: ''
        }
      });
    }

    if (elicitationAction === 'updateDate') {
      this.voidObs(this.familyTestingEnc);
    }
    this.toastrService.remove(toast.toastId);
    this.localStorageService.remove('elicitationAction');
  }

  public getFamilyHistoryEncounter(data) {
    let encounters = [];
    const dates = [];
    data.forEach((enc) => {
      if (enc.encounterType.uuid === '975ae894-7660-4224-b777-468c2e710a2a') {
        encounters.push(enc);
        dates.push(new Date(enc.encounterDatetime));
      }
    });

    encounters = encounters.filter(
      (enc) =>
        new Date(enc.encounterDatetime) >= new Date(Math.max.apply(null, dates))
    );
    this.familyTestingEnc = encounters[0];
  }

  public updateElicitationDate(enc: any) {
    const payload = {
      encounterDatetime: enc.encounterDatetime,
      encounterProviders: [
        {
          provider: enc.encounterProviders.slice(-1)[0].provider.uuid,
          encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
        }
      ],
      location: enc.location.uuid,
      encounterType: enc.encounterType.uuid,
      form: enc.form.uuid,
      patient: this.patient.person.uuid,
      obs: [
        {
          concept: 'af9b3035-8570-4d32-af7d-4f1ae0374f7c',
          value: new Date()
        }
      ],
      orders: []
    };

    this.encounterResource.updateEncounter(enc.uuid, payload).subscribe((r) => {
      console.log('ELICITATION DATE UPDATED');
    });
  }

  public voidObs(enc: any) {
    this.encounterResource.getEncounterByUuid(enc.uuid).subscribe((r) => {
      r.obs.forEach((ob) => {
        if (ob.concept.uuid === 'af9b3035-8570-4d32-af7d-4f1ae0374f7c') {
          console.log('ob.concept.uuid ', ob.concept.uuid);
          this.obsResourceService.voidObs(ob.uuid).subscribe(r);
        }
      });
      this.updateElicitationDate(enc);
    });
  }
}
