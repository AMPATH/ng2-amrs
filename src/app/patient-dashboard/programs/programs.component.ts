import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../services/patient.service';
import { ProgramService } from './program.service';
import { Patient } from '../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';

@Component({
    selector: 'app-programs',
    templateUrl: './programs.component.html',
    styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public enrolledProgrames: ProgramEnrollment[] = [];
  public availablePrograms: Program[] = [];
  public selectedProgram: string = '';
  public errors: any[] = [];
  public notEnrolled: boolean = false;
  public loadingPatientPrograms: boolean = false;
  public programsBusy: boolean = false;
  public enrollmentUuid: string = '';
  public program: string = '';
  public dateCompleted: any;
  public dateEnrolled: any;
  public selectedLocation: string;
  public displayDialog: boolean = false;
  public hasError: boolean = false;
  public errorMessage: string = '';
  public locations: any[] = [];
  public subscription: Subscription;
  private _datePipe: DatePipe;

    constructor(private appFeatureAnalytics: AppFeatureAnalytics,
                private patientService: PatientService,
                private programService: ProgramService,
                private locationResourceService: LocationResourceService
    ) {
        this._datePipe = new DatePipe('en-US');
    }

  public ngOnInit() {
        this.appFeatureAnalytics
            .trackEvent('Patient Dashboard', 'Program Loaded', 'ngOnInit');
        this.subscribeToPatientChangeEvent();
        this.getAvailablePrograms();
        this.fetchLocations();
    }

    public ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

  public subscribeToEnrollmentChangeEvent(payload) {
        this.programService.saveUpdateProgramEnrollment(payload).subscribe(
            (enrollment) => {
                if (enrollment) {
                    this.patientService.fetchPatientByUuid(this.patient.uuid);
                }
            }
        );
    }

  public subscribeToPatientChangeEvent() {
        this.programsBusy = true;
        this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient) {
                    this.patient = patient;
                    this.loadProgramsPatientIsEnrolledIn(patient.person.uuid);
                }
            }
        );
    }

  public openNewEnrollmentDialog(programUuid: string) {
      let selectedProgram = {};
      selectedProgram = this.programService.
            getSelectedProgram(this.availablePrograms, programUuid);
      console.log('selectedProgram', selectedProgram);
      this.hasError = false;
      this.dateCompleted = undefined;
      this.dateEnrolled = undefined;
      this.selectedLocation = undefined;
      this.selectedProgram = (selectedProgram as any).display;
      this.program = (selectedProgram as any).uuid;
      this.displayDialog = true;
    }

  public enrollToProgram() {
    let payload = {};
    let isFormValid = {};
    isFormValid = this.validateFormFields(this.dateEnrolled, this.dateCompleted,
          this.selectedLocation);
    payload = this.programService.createEnrollmentPayload(
    this.program, this.patient, this.dateEnrolled, this.dateCompleted,
    this.selectedLocation, this.enrollmentUuid);

    if (isFormValid === true && payload) {
      this.subscribeToEnrollmentChangeEvent(payload);
      this.displayDialog = false;
    }
    }

    public updateEnrollment(enrollmentProgram) {
        this.hasError = false;
        this.displayDialog = true;
        this.selectedProgram = enrollmentProgram.display;
        this.enrollmentUuid = enrollmentProgram.uuid;
        if (enrollmentProgram.dateCompleted) {
            this.dateCompleted = this._datePipe.transform(
                enrollmentProgram.dateCompleted, 'yyyy-MM-dd');
        } else {
            this.dateCompleted = undefined;
            delete this.dateCompleted;
        }

        this.dateEnrolled = this._datePipe.transform(enrollmentProgram.dateEnrolled, 'yyyy-MM-dd');
        this.program = enrollmentProgram.programUuid;
        if (enrollmentProgram.openmrsModel.location ) {
          this.selectedLocation = enrollmentProgram.openmrsModel.location.uuid;
        } else {
          this.selectedLocation = undefined;
        }

    }

    public loadProgramsPatientIsEnrolledIn(patientUuid: string) {
        this.resetVariables();
        if (patientUuid) {
            this.loadingPatientPrograms = true;
            this.programService.getPatientEnrolledProgramsByUuid(patientUuid)
                .subscribe(
                (data) => {

                    if (data) {
                      this.enrolledProgrames = data;
                      this.programsBusy = false;
                      this.loadingPatientPrograms = false;
                    }

                },
                (error) => {

                    this.errors.push({
                        id: 'Patient Program Enrollment',
                        message: 'error fetching patient program enrollment'
                    });
                    this.loadingPatientPrograms = false;
                    this.programsBusy = false;
                }
                );
        }
    }

    public getAvailablePrograms() {
        this.programService.getAvailablePrograms().subscribe(
            (programs) => {
                if (programs) {
                    this.availablePrograms = programs;
                }
            },
            (error) => {
                this.errors.push({
                    id: 'Patient Care Programs',
                    message: 'error fetching available programs'
                });
                this.loadingPatientPrograms = false;
                this.programsBusy = false;
            }
        );
    }
  public getSelectedLocation(event) {
    this.selectedLocation = event;
  }

  public resetVariables() {
        this.enrolledProgrames = [];
        this.programsBusy = false;
        this.loadingPatientPrograms = false;
        this.enrollmentUuid = '';
        this.hasError = false;

    }

  public closeDialog() {
      this.displayDialog = false;
  }

    private validateFormFields(enrolledDate, completedDate, location) {

        if (this.isNullOrUndefined(enrolledDate)) {
            this.setErroMessage('Date Enrolled is required.');
            return false;
        }
        if (this.isNullOrUndefined(location)) {
          this.setErroMessage('Location Enrolled is required.');
          return false;
        }

        if (this.isDateValid(enrolledDate) !== true) {
            this.setErroMessage('Date Enrolled should be a valid date.');
            return false;
        }

        if (!this.isNullOrUndefined(completedDate) && this.isDateValid(completedDate) !== true) {
            this.setErroMessage('Date Completed should be a valid date.');
            return false;
        }

        if (this.isDateValid(completedDate) === true &&
            !moment(completedDate).isAfter(enrolledDate)) {
            this.setErroMessage('Date Completed should be after Date Enrolled');
            return false;
        }

        if (this.isFutureDates(enrolledDate, completedDate) === true) {
            this.setErroMessage('Date Enrolled or Date Completed should not be in future');
            return false;
        }

        return true;
    }

  private isFutureDates(enrolledDate, completedDate) {
      let today: Date ;
      today = new Date();
      if (moment(completedDate).isAfter(today) || moment(completedDate).isAfter(today)) {
          return true;
      }
      return false;
  }

  private isNullOrUndefined(val) {
      return val === null || val === undefined || val === ''
          || val === 'null' || val === 'undefined';
  }

  private setErroMessage(message) {

      this.hasError = true;
      this.errorMessage = message;
  }
  private isDateValid(inputValue) {
      if (inputValue && inputValue !== undefined) {
          return moment(inputValue).isValid();
      }
      return false;
  }
  private fetchLocations(): void {
    this.locationResourceService.getLocations().subscribe(
      (locations: any[]) => {
        this.locations = [];
        for (const item of locations) {
          this.locations.push({label: item.name, value: item.uuid});
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
