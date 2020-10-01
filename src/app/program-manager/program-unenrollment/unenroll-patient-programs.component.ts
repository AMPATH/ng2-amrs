import { take } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ProgramService } from '../../patient-dashboard/programs/program.service';

import { Patient } from '../../models/patient.model';

@Component({
  selector: 'unenroll-patient-programs',
  templateUrl: 'unenroll-patient-programs.component.html',
  styleUrls: ['./unenroll-patient-programs.component.css']
})
export class UnenrollPatientProgramsComponent implements OnInit, OnDestroy {
  public enrollmentUdateErrors: any[] = [];
  public enrollmentDetails: any = {};
  public message = '';
  @Input() public showForms = false;
  @Input() public encounterTypeFilter: string[] = [];
  @Input() public patient: Patient;
  @Input() public unenrollExpressely = false;

  @Input()
  public get enrollments(): any {
    return this.enrolledPrograms;
  }

  public set enrollments(v: any) {
    this.enrolledPrograms = v;
  }

  @Input()
  public get reason(): any {
    return this.message;
  }

  public set reason(v: any) {
    this.message = v;
  }

  @Output() public unenrollmentCompleted = new EventEmitter();
  @Output() public unEnrollmentCancelled = new EventEmitter();
  public enrolledPrograms: any;
  public hasValidationErrors = true;
  public currentError: any = '';
  private _datePipe: DatePipe;

  constructor(private programService: ProgramService, private router: Router) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.init();
  }

  public ngOnDestroy() {}

  public unEnrollPatientFromPrograms() {
    this.unEnrollFromPrograms(this.enrollmentDetails);
  }

  public onUnenrollmentCancelled() {
    this.unEnrollmentCancelled.emit(true);
    this.showForms = false;
  }

  public showUnenrollmentFormsOrUnenrollOnValidation() {
    if (this.encounterTypeFilter.length > 0) {
      this.showForms = true;
    } else {
      this.unEnrollPatientFromPrograms();
    }
  }

  public fillUnenrollmentForm(form) {
    const _route =
      '/patient-dashboard/patient/' +
      this.patient.uuid +
      '/general/general/formentry';
    const routeOptions = {
      queryParams: {
        step: 3,
        parentComponent: 'programManager:new'
      }
    };
    this.showForms = false;
    this.router.navigate([_route, form.uuid], routeOptions);
  }

  private initCompletedDate() {
    for (const enrolled of this.enrolledPrograms) {
      this.enrollmentDetails[enrolled.enrollmentUuid] = moment()
        .subtract(1, 'm')
        .format('YYYY-MM-DDTHH:mm:ssZ');
    }
  }

  private unEnrollFromPrograms(enrollmentDetails) {
    for (const property in enrollmentDetails) {
      if (enrollmentDetails.hasOwnProperty(property)) {
        this.unenrollPatient(property, enrollmentDetails[property]);
      }
    }
  }

  private init() {
    this.initCompletedDate();
    this.enrollmentUdateErrors = [];
    if (this.unenrollExpressely) {
      this.unEnrollPatientFromPrograms();
    }
  }

  private unenrollPatient(enrollmentUuid, completedDate) {
    const enrolled: any = this.getEnrollmentDetails(enrollmentUuid);
    const enrolledDate = enrolled ? enrolled[0].enrolledDate : null;
    const program = enrolled ? enrolled[0].name : null;

    if (this._formFieldsValid(enrolledDate, completedDate, enrollmentUuid)) {
      const payload = this.createPayload(enrollmentUuid, completedDate);
      this.programService
        .saveUpdateProgramEnrollment(payload)
        .pipe(take(1))
        .subscribe(
          (enrollment) => {
            if (enrollment) {
              this.removeEnrolledProgram(enrollmentUuid);
            }
          },
          (error) => {
            this.enrollmentUdateErrors.push(
              'An error occurred while unenrolling ' + program
            );
            console.error(error);
          }
        );
    }
  }

  private removeEnrolledProgram(enrollmentUuid) {
    _.remove(this.enrolledPrograms, (o: any) => {
      return o.enrollmentUuid === enrollmentUuid;
    });

    if (this.enrolledPrograms.length === 0) {
      this.unenrollExpressely = false;
      this.unenrollmentCompleted.emit(true);
    }
  }

  private createPayload(enrollmentUuid, completedDate) {
    return { uuid: enrollmentUuid, dateCompleted: completedDate };
  }

  private getEnrollmentDetails(enrollmentUuid) {
    const enrolled: any = _.filter(this.enrolledPrograms, (e: any) => {
      return e.enrollmentUuid === enrollmentUuid;
    });
    return enrolled ? enrolled : null;
  }

  private _formFieldsValid(enrolledDate, completedDate, enrollmentUuid) {
    if (!enrollmentUuid || enrollmentUuid === '') {
      this._showErrorMessage('Patient enrollment uuid is required.');
      return false;
    }

    if (!_.isNil(enrolledDate) && _.isNil(completedDate)) {
      this._showErrorMessage('Date Completed is required.');
      return false;
    }

    if (_.isNil(enrolledDate)) {
      this._showErrorMessage('Date Enrolled is required.');
      return false;
    }

    if (
      !_.isNil(completedDate) &&
      !moment(completedDate).isAfter(enrolledDate) &&
      !moment(completedDate).isSame(enrolledDate)
    ) {
      this._showErrorMessage('Date Completed should be after Date Enrolled');
      return false;
    }

    if (this._isFutureDate(completedDate) === true) {
      this._showErrorMessage('Date Completed should not be in future');
      return false;
    }
    return true;
  }

  private _showErrorMessage(message) {
    this.hasValidationErrors = true;
    this.enrollmentUdateErrors.push(message);
  }

  private _isFutureDate(completedDate) {
    let today: Date;
    today = new Date();
    if (!_.isNil(completedDate) && moment(completedDate).isAfter(today)) {
      return true;
    }
    return false;
  }
}
