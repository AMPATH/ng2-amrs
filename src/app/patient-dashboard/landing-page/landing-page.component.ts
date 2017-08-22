import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Subscription, Observable, Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ProgramService } from '../programs/program.service';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';

@Component({
  selector: 'landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public enrolledProgrames: ProgramEnrollment[] = [];
  public currentError: string;
  public availablePrograms: any[] = [];
  public hasError: boolean = false;
  public hasValidationErrors: boolean = false;
  public programsBusy: boolean = false;
  public program: string = '';
  public errors: any[] = [];
  public isFocused: boolean = false;
  public locations: any = [];
  public dateEnrolled: string;
  public isEditLocation: string;
  public addPinkBackground: boolean = false;
  public isEdit: boolean = false;
  public dateCompleted: string;
  public selectedLocation: string;
  private _datePipe: DatePipe;
  private subscription: Subscription;

  constructor(private patientService: PatientService,
              private routesProviderService: RoutesProviderService,
              private programService: ProgramService,
              private locationResourceService: LocationResourceService) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.fetchLocations();
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.loadProgramBatch(patient.person.uuid);
        }
      }
    );
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadProgramBatch(patientUuid: string): void {
    this._resetVariables();
    this.programsBusy = true;
    let dashboardRoutesConfig: any;
    dashboardRoutesConfig = this.routesProviderService.patientDashboardConfig;
    const programBatch: Array<Observable<any>> = [];
    programBatch.push(this.loadProgramsPatientIsEnrolledIn(patientUuid));
    programBatch.push(this.getAvailablePrograms());
    this.subscription = Observable.forkJoin(programBatch).subscribe((data) => {
        this.programsBusy = false;
        this.enrolledProgrames = data[0];
        const _programs: any[] = [];
        // data[1] = availablePrograms
        _.each(data[1], (program: any) => {
          let _enrolledPrograms: any[];
          _enrolledPrograms = _.filter(this.enrolledProgrames,
            (enrolledProgram: any) => {
              return enrolledProgram.programUuid === program.uuid &&
                _.isNil(enrolledProgram.dateCompleted) && !enrolledProgram.voided;
            });
          let _enrolledProgram: any;
          if (_enrolledPrograms.length > 0) {
            _enrolledProgram = _.last(_enrolledPrograms);
          }
          let route: any;
          route = _.find(dashboardRoutesConfig.programs, (_route: any) => {
            return _route['requiresPatientEnrollment'] && _route['programUuid'] === program.uuid;
          });

          _programs.push({
            program,
            enrolledProgram: _enrolledProgram,
            programUuid: _.isNil(_enrolledProgram) ? '' : _enrolledProgram.uuid,
            isFocused: false,
            isEdit: false,
            dateEnrolled: (!_.isNil(_enrolledProgram) && _.isNil(_enrolledProgram.dateCompleted)) ?
              this._datePipe.transform(_enrolledProgram.dateEnrolled, 'yyyy-MM-dd') : null,
            dateEnrolledView: (!_.isNil(_enrolledProgram)
            && _.isNil(_enrolledProgram.dateCompleted)) ?
              this._datePipe.transform(_enrolledProgram.dateEnrolled, 'dd-MM-yyyy') : null,
            dateCompleted: null,
            validationError: '',
            baseRoute: route ? route.baseRoute : '',
            buttons: {
              landing: {
                display: 'Go to Program',
                url: route ? '/patient-dashboard/patient/' + patientUuid + '/' +
                  route.baseRoute + '/landing-page' : null
              },
              visit: {
                display: 'Start Visit',
                url: route ? '/patient-dashboard/patient/' + patientUuid + '/' +
                  route.baseRoute + '/visit' : null
              }
            },
            isEnrolled: !_.isNil(_enrolledProgram) && _.isNil(_enrolledProgram.dateCompleted)
          });
        });
        this.availablePrograms = _programs;
      },
      (err) => {
        this.hasError = true;
        this.errors.push({
          id: 'Patient Care Programs',
          message: 'error fetching available programs',
          error: err
        });
        this.programsBusy = false;
      }
    );
  }

  public loadProgramsPatientIsEnrolledIn(patientUuid: string) {
    return Observable.create((observer: Subject<ProgramEnrollment[]>) => {
      if (patientUuid) {
        this.programService.getPatientEnrolledProgramsByUuid(patientUuid).subscribe(
          (data) => {
            if (data) {
              observer.next(data);
            }
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('patientUuid is required');
      }
    }).first();
  }

  public getAvailablePrograms() {
    return Observable.create((observer: Subject<Program[]>) => {
      this.programService.getAvailablePrograms().subscribe(
        (programs) => {
          if (programs) {
            observer.next(programs);
          }
        },
        (error) => {
          observer.error(error);
        }
      );
    }).first();
  }

  public toggleDropDown(row: any) {
    row.isEdit = _.isNil(row.isEdit) ? true : !(row.isEdit) as boolean;
  }
  public getSelectedLocation(loc) {
    this.selectedLocation = loc;
  }

  public editPatientEnrollment(row: any) {
    row.isFocused = true;
    this.isEdit = true;
    let payload = {};
    if (this.isValidForm(row)) {
      if (_.isNil(row.dateCompleted)) {
        delete row.programUuid;
      }
      payload = this.programService.createEnrollmentPayload(
      row.program.uuid, this.patient, row.dateEnrolled, row.dateCompleted,
        this.isEditLocation, row.programUuid);
      if (payload) {
        setTimeout(() => {
          this._updatePatientProgramEnrollment(payload);
        }, 2000);
      }
    }
  }

  public enrollPatientToProgram() {
    this.isFocused = true;
    this.isEdit = false;
    let payload = {};
    if (this.isValidForm({dateEnrolled: this.dateEnrolled, dateCompleted: this.dateCompleted})) {
       payload = this.programService.createEnrollmentPayload(
        this.program, this.patient, this.dateEnrolled,
        this.dateCompleted, this.selectedLocation, '');
       if (payload) {
        this._updatePatientProgramEnrollment(payload);
      }
    }
  }

  public onAddPinkBackground(hasPink: boolean) {
    this.addPinkBackground = hasPink;
  }
  public getSelectedLocationToEdit(loc) {
    this.isEditLocation = loc;
  }

  private isValidForm(row: any) {
    if (!this._formFieldsValid(row.dateEnrolled, row.dateCompleted,
        this.isEditLocation || this.selectedLocation )) {
      row.validationError = this.currentError;
      this.isFocused = false;
      if (this.isEdit) {
        this.currentError = '';
        if (!_.isNil(row.isFocused)) {
          row.isFocused = false;
        }
      }
    } else {
      row.validationError = '';
      this.hasValidationErrors = false;
    }
    return !this.hasValidationErrors;
  }

  private _updatePatientProgramEnrollment(payload) {
    this.programService.saveUpdateProgramEnrollment(payload).subscribe(
      (enrollment) => {
        this.isFocused = false;
        this.isEdit = false;
        if (enrollment) {
          this.patientService.fetchPatientByUuid(this.patient.uuid);
          this._resetVariables();
        }
      }
    );
  }

  private _formFieldsValid(enrolledDate, completedDate, location) {
    if (!this.isEdit && this.program === '') {
      this._showErrorMessage('Program is required.');
      return false;
    }

    if (!_.isNil(enrolledDate) && !_.isNil(completedDate) && !this.isEdit) {
      this._showErrorMessage('Date Completed should not be specified while enrolling');
      return false;
    }

    if (_.isNil(enrolledDate) || (!_.isNil(completedDate) && _.isNil(completedDate))) {
      this._showErrorMessage('Date Enrolled is required.');
      return false;
    }
    if (_.isNil(location) || (!_.isNil(completedDate) && _.isNil(completedDate))
    || (!_.isNil(enrolledDate) && _.isNil(enrolledDate))) {
      this._showErrorMessage('Location Enrolled is required.');
      return false;
    }

    if ((!_.isNil(completedDate) && !moment(completedDate).isAfter(enrolledDate))) {
      this._showErrorMessage('Date Completed should be after Date Enrolled');
      return false;
    }

    if (this._isFutureDates(enrolledDate, completedDate) === true) {
      this._showErrorMessage('Date Enrolled or Date Completed should not be in future');
      return false;
    }

    return true;
  }

  private _isFutureDates(enrolledDate, completedDate) {
    let today: Date;
    today = new Date();
    if (moment(enrolledDate).isAfter(today) || (!_.isNil(completedDate)
      && moment(completedDate).isAfter(today))) {
      return true;
    }
    return false;
  }

  private _showErrorMessage(message) {
    this.hasValidationErrors = true;
    this.currentError = message;
  }

  private _resetVariables() {
    this.enrolledProgrames = [];
    this.availablePrograms = [];
    this.programsBusy = false;
    this.hasError = false;
    this.hasValidationErrors = false;
    this.currentError = '';
    this.isEdit = false;
    this.errors = [];
    this.dateEnrolled = undefined;
    this.dateCompleted = undefined;
    this.selectedLocation = undefined;
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
