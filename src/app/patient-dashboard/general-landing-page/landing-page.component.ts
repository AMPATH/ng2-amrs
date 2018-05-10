import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Subscription , Observable , Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ProgramService } from '../programs/program.service';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../models/patient.model';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralLandingPageComponent implements OnInit, OnDestroy {
  @Input()
  public hideList: boolean = false;
  public patient: Patient = new Patient({});
  public currentError: string;
  public availablePrograms: any[] = [];
  public requiredProgramQuestions: any[] = [];
  public hasError: boolean = false;
  public hasValidationErrors: boolean = false;
  public programsBusy: boolean = false;
  public program: any;
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
  public programDepartments: any = [];
  public department: string;
//  public programList: any[] = require('../programs/programs.json');
  public availableDepartmentPrograms: any[] = [];
  private departmentConf: any[];
  private _datePipe: DatePipe;
  private subscription: Subscription;

  constructor(private patientService: PatientService,
              private programService: ProgramService,
              private patientProgramResourceService: PatientProgramResourceService,
              private departmentProgramService: DepartmentProgramsConfigService) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.updateEnrollmentButtonState();
    this.loadProgramBatch();
    this.getDepartmentConf();
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
    if (loc.locations) {
      this.selectedLocation = loc;
    } else {
      this.selectedLocation = null;
    }
    this._removeErrorMessage();
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
    this.checkIncompatibility(this.program.value);
    if (this.programIncompatible === true) {
          this.isFocused = false;
    } else {
       if (this.isValidForm({
           dateEnrolled: this.dateEnrolled,
           dateCompleted: this.dateCompleted
       })) {
       payload = this.programService.createEnrollmentPayload(
        this.program.value, this.patient, this.dateEnrolled,
        this.dateCompleted, this.selectedLocation.locations.value, '');
       if (payload) {
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
       this.hasValidationErrors = false;
       this.currentError = undefined;
       this.incompatibleProgrames = [];
       this.checkForRequiredQuestions();
      // check the compatibility of the program
       this.checkIncompatibility(programUuid);
      }
      this.updateEnrollmentButtonState();

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
      this.program = undefined;
      this.programIncompatible = false;
    }
  }
  public isUnenrollmentComplete(event) {
    if (event) {
      this.programIncompatible = false;
      this.patientService.fetchPatientByUuid(this.patient.uuid);
      this.loadProgramBatch();
      this.getSelectedDepartment(this.department);
    }
  }

  public checkForRequiredQuestions(): void {
    this.requiredProgramQuestions = [];
    let program: any = this.allProgramVisitConfigs[this.program.value];
    if (program && !_.isUndefined(program.enrollmentOptions)
      && !_.isUndefined(program.enrollmentOptions.requiredProgramQuestions)) {
      this.requiredProgramQuestions = program.enrollmentOptions.requiredProgramQuestions;
    }
  }

  public onRequiredQuestionChange(event: string, question: any) {
    this._preQualifyProgramEnrollment(question);
  }

  public getDepartmentConf() {
    this.departmentProgramService.getDartmentProgramsConfig()
      .subscribe((results) => {
        if (results) {
          this.departmentConf = results;
          this._filterDepartmentConfigByName();
        }
      });

  }

  public getSelectedDepartment(department: string) {
    this.department = department;
    this.program = undefined;
    let departmentPrograms = _.map(this._getProgramsByDepartmentName(), 'uuid');
    this.availableDepartmentPrograms = _.filter(this.availablePrograms, (program: any) => {
      return _.includes(departmentPrograms, program.program.uuid) && !program.isEnrolled;
    });
    this.availableDepartmentPrograms = _.map(this.availableDepartmentPrograms,
      (availableProgram) => {
        return {
          label: availableProgram.program.display,
          value: availableProgram.program.uuid
        };
      });
    // sort alphabetically;
    this.availableDepartmentPrograms = _.orderBy(this.availableDepartmentPrograms,
      ['label'], ['asc']);
  }

  private updateEnrollmentButtonState() {
    // just return true. disabling the button is a bad idea
    this.enrollmentButtonActive = true;
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
    if (row.enrolledProgram && row.enrolledProgram.openmrsModel &&
      row.enrolledProgram.openmrsModel.location) {
      currentLocation = row.enrolledProgram.openmrsModel.location.uuid;
    }
    if (!this._formFieldsValid(row.dateEnrolled, row.dateCompleted,
        this.selectedLocation || currentLocation
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

  private _preQualifyProgramEnrollment(question: any) {
    let requiredStatus = _.find(question.answers, (ans) => ans.value === question.enrollIf);
    if (requiredStatus && question.value !== question.enrollIf) {
      this._showErrorMessage(question.name + ' MUST be ' + question.enrollIf + ' to be able to' +
        ' enroll the patient into this program');
    } else {
      this._removeErrorMessage();
    }
    this.updateEnrollmentButtonState();
  }

  private _filterDepartmentConfigByName() {
    this.programDepartments = _.map(this.departmentConf, (config: any) => {
      return {name: config.name};
    });
  }

  private _getProgramsByDepartmentName() {
    let department = _.find(this.departmentConf, (config: any) => {
      return config.name === this.department;
    });
    return department ? department.programs : [];
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
              return !_program.isEnrolled && (_program.programUuid === this.program.value);
            }));
          if (currentProgram) {
            this.confirmationMesssage = 'The patient has been enrolled in ' +
              currentProgram.program.display  + ' at ' + enrollment.location.display +
              ' starting ' + moment(enrollment.dateEnrolled).format('MMM Do, YYYY');
          }
          this.loadProgramBatch();
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

    if (!this._isAllRequiredQuestionsAnswered()) {
      return false;
    }

    if (!this.isEdit && _.isUndefined(this.program)) {
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

  private _isAllRequiredQuestionsAnswered(): boolean {
    let program: any = this.allProgramVisitConfigs[this.program.value];
    if (program && !_.isUndefined(program.enrollmentOptions)
      && !_.isUndefined(program.enrollmentOptions.requiredProgramQuestions)) {
      let unAnsweredQuestions = _.filter(program.enrollmentOptions.requiredProgramQuestions,
        (question) => {
        return _.isNil(question.value);
      });
      if (unAnsweredQuestions.length > 0) {
        this._showErrorMessage('All required questions must be filled');
        return false;
      }
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

  private _removeErrorMessage() {
    this.hasValidationErrors = false;
    this.currentError = undefined;
  }

  private _resetVariables() {
    this.availablePrograms = [];
    this.programsBusy = false;
    this.hasError = false;
    this.hasValidationErrors = false;
    this.currentError = '';
    this.program = undefined;
    this.department = undefined;
    this.isEdit = false;
    this.errors = [];
    this.dateEnrolled = undefined;
    this.dateCompleted = undefined;
    this.selectedLocation = undefined;
    this.isEditLocation = undefined;
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
