import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ProgramService } from '../programs/program.service';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../models/patient.model';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class GeneralLandingPageComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
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
              private programService: ProgramService,
              private locationResourceService: LocationResourceService) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.fetchLocations();
    this.loadProgramBatch();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
        delete row.enrolledProgram.uuid;
      }
      payload = this.programService.createEnrollmentPayload(
        row.program.uuid, this.patient, row.dateEnrolled, row.dateCompleted,
        this.isEditLocation || row.enrolledProgram.openmrsModel.location.uuid,
        row.enrolledProgram.uuid);
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

  private loadProgramBatch(): void {
    this._resetVariables();
    this.programsBusy = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.programsBusy = false;
        if (patient) {
          this.patient = patient;
          this.availablePrograms = patient.enrolledPrograms;
        }
      }, (err) => {
        this.hasError = true;
        this.errors.push({
          id: 'Patient Care Programs',
          message: 'error fetching available programs',
          error: err
        });
        this.programsBusy = false;
      });
  }

  private isValidForm(row: any) {
    let currentLocation;
    if (row.enrolledProgram && row.enrolledProgram.openmrsModel &&
      row.enrolledProgram.openmrsModel.location) {
      currentLocation = row.enrolledProgram.openmrsModel.location.uuid;
    }
    if (!this._formFieldsValid(row.dateEnrolled, row.dateCompleted,
        this.isEditLocation || this.selectedLocation
        || currentLocation
      )) {
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
          this._resetVariables();
          this.patientService.fetchPatientByUuid(this.patient.uuid);
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
    this.availablePrograms = [];
    this.programsBusy = false;
    this.hasError = false;
    this.hasValidationErrors = false;
    this.currentError = '';
    this.program = '';
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
