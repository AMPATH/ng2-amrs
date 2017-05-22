import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ProgramService } from '../programs/program.service';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import { Subscription, Observable, Subject } from 'rxjs';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.css']
})

export class LandingPageComponent implements OnInit, OnDestroy {

  patient: Patient  = new Patient({});
  subscription: Subscription;
  enrolledProgrames: Array<ProgramEnrollment> = [];
  currentError: string;
  availablePrograms: Array<any> = [];
  hasError: boolean = false;
  hasValidationErrors: boolean = false;
  programsBusy: boolean = false;
  program: string = '';
  errors: Array<any> = [];
  private _datePipe: DatePipe;
  constructor(private patientService: PatientService,
              private routesProviderService: RoutesProviderService,
              private programService: ProgramService) {
    this._datePipe = new DatePipe('en-US');
  }

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.loadProgramBatch(patient.person.uuid);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProgramBatch(patientUuid: string): void {
    this._resetVariables();
    this.programsBusy = true;
    let dashboardRoutesConfig: any = this.routesProviderService.patientDashboardConfig;
    let programBatch: Array<Observable<any>> = [];
    programBatch.push(this.loadProgramsPatientIsEnrolledIn(patientUuid));
    programBatch.push(this.getAvailablePrograms());
    this.subscription = Observable.forkJoin(programBatch).subscribe(data => {
        this.programsBusy = false;
        this.enrolledProgrames = data[0];
        let _programs = [];
        // data[1] = availablePrograms
        _.each(data[1], (program) => {
          let _enrolledPrograms: Array<any> = _.filter(this.enrolledProgrames,
            (enrolledProgram) => {
            return enrolledProgram.programUuid === program.uuid &&
              _.isNil(enrolledProgram.dateCompleted);
          });
          let _enrolledProgram: any;
          if (_enrolledPrograms.length > 0) {
            _enrolledProgram = _.last(_enrolledPrograms);
          }

          let route: any = _.find(dashboardRoutesConfig.programs, (_route) => {
            return _route['requiresPatientEnrollment'] && _route['programUuid'] === program.uuid;
          });

          _programs.push({
            program: program,
            enrolledProgram: _enrolledProgram,
            programUuid: _.isNil(_enrolledProgram) ? '' : _enrolledProgram.uuid,
            isFocused: false,
            dateEnrolled: (!_.isNil(_enrolledProgram) && _.isNil(_enrolledProgram.dateCompleted)) ?
              this._datePipe.transform(_enrolledProgram.dateEnrolled, 'yyyy-MM-dd') : null,
            dateCompleted: null,
            validationError: '',
            baseRoute: route ? route.baseRoute : '',
            buttons: {
              link: {
                display: 'Go to program',
                url: route ? '/patient-dashboard/' + patientUuid + '/' +
                route.baseRoute + '/visit' : null
              },
              enroll: {
                display: 'Enroll patient'
              },
              edit: {
                display: 'Complete Program',
              }
            },
            isEnrolled: !_.isNil(_enrolledProgram) && _.isNil(_enrolledProgram.dateCompleted)
          });
        });
        this.availablePrograms = _programs;
      },
      err => {
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

  loadProgramsPatientIsEnrolledIn(patientUuid: string) {
    return Observable.create((observer: Subject<Array<ProgramEnrollment>>) => {
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

  getAvailablePrograms() {
    return Observable.create((observer: Subject<Array<Program>>) => {
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

  createOrEditPatientEnrollment(row: any, isNew: boolean) {
    row.isFocused = true;
    if (this.isValidForm(row)) {
      if (isNew) {
        delete row.programUuid;
      }
      let payload = this.programService.createEnrollmentPayload(
        row.program.uuid, this.patient, row.dateEnrolled, row.dateCompleted, row.programUuid);
      if (payload) {
        this._updatePatientProgramEnrollment(payload);
      }
    }
  }

  isValidForm(row: any) {
    if (!this._formFieldsValid(row.dateEnrolled, row.dateCompleted)) {
      row.validationError = this.currentError;
    } else {
      row.validationError = '';
      this.hasValidationErrors = false;
    }
    return !this.hasValidationErrors;
  }

  editEnrollment(programEnrollment: any) {
    this.createOrEditPatientEnrollment(programEnrollment, false);
  }

  cancelEnrollment(row: any) {
    row.isFocused = false;
    row.dateCompleted = null;
    row.dateEnrolled = null;
    row.validationError = '';
  }

  private _updatePatientProgramEnrollment(payload) {
    this.programService.saveUpdateProgramEnrollment(payload).subscribe(
      (enrollment) => {
        if (enrollment) {
          this.patientService.fetchPatientByUuid(this.patient.uuid);
        }
      }
    );
  }

  private _formFieldsValid(enrolledDate, completedDate) {

    if (_.isNil(enrolledDate) || (!_.isNil(completedDate) && _.isNil(completedDate))) {
      this._showErrorMessage('Date Enrolled is required.');
      return false;
    }

    if (!_.isNil(completedDate) && !moment(completedDate).isAfter(enrolledDate)) {
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
    let today = new Date();
    if (moment(enrolledDate).isAfter(today) || moment(completedDate).isAfter(today)) {
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
    this.errors = [];
  }

}

