import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Subscription , Observable , Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ProgramService } from '../programs/program.service';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../models/patient.model';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class GeneralLandingPageComponent implements OnInit, OnDestroy {
  @Input()
  public hideList: boolean = false;
  public patient: Patient = new Patient({});
  public currentError: string;
  public availablePrograms: any[] = [];
  public availableProgramsOptions: any[] = [];
  public hasError: boolean = false;
  public hasValidationErrors: boolean = false;
  public programsBusy: boolean = false;
  public program: string = '';
  public errors: any[] = [];
  public enrollmentButtonActive: boolean  = false;
  public enrollmentCompleted: boolean  = false;
  public isFocused: boolean = false;
  public locations: any = [];
  public dateEnrolled: string;
  public isEditLocation: any;
  public addBackground: any;
  public isEdit: boolean = false;
  public dateCompleted: string;
  public programIncompatible: boolean = false;
  public incompatibleMessage: any = [];
  public confirmationMesssage: string;
  public incompatibleCount: number = 0;
  public enrolledProgrames: any = [];
  public incompatibleProgrames: any = [];
  public reasonForUnenroll: string = `
  The selected program is incompatible with the following programs, please unenroll to continue.`;
  public selectedLocation: any;
  public allProgramVisitConfigs: any = {};
  public programHasWorkflows: boolean = false;
  public selectedWorkflow: any;
  public programWorkflows: any[] = [];
  public selectedWorkFlowState: any;
  public workflowStates: any[] = [];
//  public programList: any[] = require('../programs/programs.json');
  private _datePipe: DatePipe;
  private subscription: Subscription;

  constructor(private patientService: PatientService,
              private programService: ProgramService,
              private patientProgramResourceService: PatientProgramResourceService) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.updateEnrollmentButtonState();
    this.loadProgramBatch();
    this.fetchAllProgramVisitConfigs();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadProgramsPatientIsEnrolledIn(patientUuid: string) {
    return Observable.create((observer: Subject <any>) => {
      if (patientUuid) {
        this.programService.getPatientEnrolledProgramsByUuid(patientUuid).subscribe(
          (data) => {
            if (data) {
              this.enrolledProgrames = data;
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

  public toggleDropDown(row: any) {
    row.isEdit = _.isNil(row.isEdit) ? true : !(row.isEdit) as boolean;
  }

  public getSelectedLocation(loc) {
    this.selectedLocation = loc;
    this.updateEnrollmentButtonState();
  }

  public editPatientEnrollment(row: any) {
    row.isFocused = true;
    this.isEdit = true;
    let payload = {};
    let location;
    if (typeof this.isEditLocation === 'undefined') {
        location = row.enrolledProgram.openmrsModel.location.uuid;
    }else {
        location = this.isEditLocation.locations;
    }
    if (this.isValidForm(row)) {
      if (_.isNil(row.dateCompleted)) {
        delete row.enrolledProgram.uuid;
      }
      payload = this.programService.createEnrollmentPayload(
        row.program.uuid, this.patient, row.dateEnrolled, row.dateCompleted, location,
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
    this.checkIncompatibility(this.program);
    if (this.programIncompatible === true) {
          this.isFocused = false;
    } else {
       if (this.isValidForm({
           dateEnrolled: this.dateEnrolled,
           dateCompleted: this.dateCompleted
       })) {
       payload = this.programService.createEnrollmentPayload(
        this.program, this.patient, this.dateEnrolled,
        this.dateCompleted, this.selectedLocation.locations, '');
       if (payload) {
         if (this.programHasWorkflows) {
           _.merge(payload, {'states': [{
             'state': this.selectedWorkFlowState.uuid,
             'startDate': this.toOpenmrsDateFormat(new Date())
           }]});
         }
         this._updatePatientProgramEnrollment(payload);
      }
    }

   }

  }

  public onAddBackground(color) {
    this.addBackground = color;
  }

  public getSelectedLocationToEdit(loc) {
    this.isEditLocation = loc;
  }

  public onProgramChange($event) {
      let programUuid = $event ? $event.value : null;
      if (programUuid) {
       this.programIncompatible = false;
       this.incompatibleProgrames = [];
       this.getProgramWorkflows(programUuid);
      // check the compatibility of the program
       this.checkIncompatibility(programUuid);
      }
      this.updateEnrollmentButtonState();

  }

  public getWorkFlowState(state) {
    this.selectedWorkFlowState = state;
  }

  public getProgramWorkflows(programUuid) {
    this.programService.getProgramWorkFlows(programUuid).subscribe((workflows: any[]) => {
        this.programWorkflows = workflows;
        this.programHasWorkflows = this.programWorkflows.length > 0;
        // we don't need to select states any more. Default state is 'In Care'
        this.selectedWorkflow = _.first(this.programWorkflows);
        this.workflowStates = _.filter(this.selectedWorkflow.states, (state: any) => {
          return state.concept.uuid === 'e517d6e2-6236-42db-9f71-0b6270c6cfa9';
        });

        if (!_.isEmpty(this.workflowStates)) {
          this.selectedWorkFlowState = _.first(this.workflowStates);
        }
      });
  }

  public setWorkFlowStates() {
    this.workflowStates = this.selectedWorkflow.states;
  }

  public fetchAllProgramVisitConfigs() {
    this.allProgramVisitConfigs = {};
    let sub = this.patientProgramResourceService.
    getAllProgramVisitConfigs().subscribe(
      (programConfigs) => {
        this.allProgramVisitConfigs = programConfigs;
      },
      (error) => {
        this.errors.push({
          id: 'program configs',
          message: 'There was an error fetching all the program configs'
        });
        console.error('Error fetching program configs', error);
      });
  }

  public isUnenrollmentCancel(event) {
    if (event) {
      this.program = '';
      this.programIncompatible = false;
    }
  }
  public isUnenrollmentComplete(event) {
    if (event) {
      this.programIncompatible = false;
      this.patientService.fetchPatientByUuid(this.patient.uuid);
    }
  }

  private toOpenmrsDateFormat(dateToConvert: any): string {
    let date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }

  private updateEnrollmentButtonState() {
    this.enrollmentButtonActive = !_.isNil(this.selectedLocation) && !_.isNil(this.program) &&
      !_.isNil(this.dateEnrolled);
  }
  private loadProgramBatch(): void {
    this._resetVariables();
    this.programsBusy = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.programsBusy = false;
        if (patient) {
          this.patient = patient;
         // this.availablePrograms = patient.enrolledPrograms;
          this.availablePrograms  =  _.filter( patient.enrolledPrograms,  (item) => {
              return item.program.uuid !== '781d8a88-1359-11df-a1f1-0026b9348838' &&
                item.program.uuid !== '781d8880-1359-11df-a1f1-0026b9348838';
            });
          this.availableProgramsOptions = _.map(this.availablePrograms,
            (availableProgram) => {
            return {
              label: availableProgram.program.display,
              value: availableProgram.program.uuid
            }
          });
          // sort alphabetically;
          this.availableProgramsOptions = _.orderBy(this.availableProgramsOptions,
            ['label'],['asc']);
          this.enrolledProgrames = _.filter(patient.enrolledPrograms, 'isEnrolled');
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
    let location;
    if (typeof this.isEditLocation === 'undefined') {
        location = this.selectedLocation.locations;
    }else {
        location = this.isEditLocation.locations;
    }
    if (row.enrolledProgram && row.enrolledProgram.openmrsModel &&
      row.enrolledProgram.openmrsModel.location) {
      currentLocation = row.enrolledProgram.openmrsModel.location.uuid;
    }
    if (!this._formFieldsValid(row.dateEnrolled, row.dateCompleted, location || currentLocation
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
          this.enrollmentCompleted = true;
          let currentProgram: any = _.first(_.filter(this.availablePrograms,
            (_program: any) => {
              return !_program.isEnrolled && (_program.programUuid === this.program);
            }));
          if (currentProgram) {
            this.confirmationMesssage = 'The patient has been enrolled in ' +
              currentProgram.program.display  + ' at ' + enrollment.location.display +
              ' starting ' + moment(enrollment.dateEnrolled).format('MMM Do, YYYY');
          }
          setTimeout(() => {
            this._resetVariables();
            this.patientService.fetchPatientByUuid(this.patient.uuid);
            this.enrollmentCompleted = false;
          }, 2500);
        }
      }
    );
  }

  private _formFieldsValid(enrolledDate, completedDate, location) {
    if (!this.isEdit && this.program === '') {
      this._showErrorMessage('Program is required.');
      return false;
    }

    if (this.programHasWorkflows
      && (_.isNil(this.selectedWorkflow) || _.isNil(this.selectedWorkFlowState))) {
      this._showErrorMessage('You must assign a workflow and state to the program');
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
    this.isEditLocation = undefined;
    this.selectedWorkFlowState = undefined;
    this.selectedWorkflow = undefined;
  }

  private checkIncompatibility(programUUid) {
      this.incompatibleCount = 0;
      this.incompatibleMessage = [];
      let patientPrograms = this.enrolledProgrames;
      // get programs patient has enrolled in

      let enrolledList: Array<any> = [];
      let incompatibleList: Array<any> = [];

      let programList = this.allProgramVisitConfigs;

      _.forEach(patientPrograms, (program: any) => {
             if (program.dateEnrolled !== null) {
               enrolledList.push(
                 {uuid: program.program.uuid,
                 enrolledDate: program.dateEnrolled,
                 enrollmentUuid: program.enrolledProgram.uuid,
                 name: program.program.display
                 }
                 );
             }
      });

      /* for the selected program.Check if it has compatibilty
         issues with any of the enrolled programs
      */

      _.forEach(programList, (list: any, index) => {
           // get program
           if (index === programUUid) {

               // get incompatibilies
           if (list.incompatibleWith) {

                let incompatibleWith = list.incompatibleWith;
                if (incompatibleWith.length > 0) {
                  _.forEach(incompatibleWith, (incompatibleProgram) => {
                      incompatibleList.push(incompatibleProgram);
                  });
                }

             }

           }
      });

      /* With the list of incompatible programs for selected
         program and enrolled programs we can check if there is a match
         i.e an enrolled program should not be in an incompatibility list
         for the selected program
      */

      _.forEach(enrolledList, (enrolled) => {
        for (let incompatible of incompatibleList){
          if (incompatible === enrolled.uuid) {
                this.programIncompatible = true;
                // get the program name for the message
                let progName = programList[incompatible].name;
                this.incompatibleProgrames.push(enrolled);
                this.incompatibleCount++;
              }
        }
      });

      if (this.incompatibleCount > 0) {
           this.programIncompatible = true;
      }else {
           this.programIncompatible = false;
      }

  }

}
