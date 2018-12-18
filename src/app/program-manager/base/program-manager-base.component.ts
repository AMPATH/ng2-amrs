
import {take} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';

import { PatientService } from '../../patient-dashboard/services/patient.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { Patient } from '../../models/patient.model';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from '../../utils/local-storage.service';

@Component({
  selector: 'program-manager-base',
  template: `<ng-content></ng-content>`,
  styleUrls: []
})
export class ProgramManagerBaseComponent implements OnInit {
  public department: string;
  public program: any;
  public title = 'Start Program';
  public steps: number[] = [1, 2, 3, 4, 5, 6];
  public showForms: boolean = false;
  public customTitleClass: string = '';
  public jumpStep: number = -1;
  public currentStep: number = 1;
  public nextStep: boolean = false;
  public prevStep: boolean = false;
  public patient: Patient = new Patient({});
  public currentError: string;
  public currentNotice: string;
  public availablePrograms: any[] = [];
  public requiredProgramQuestions: any[] = [];
  public hasError: boolean = false;
  public hasNotice: boolean = false;
  public hasValidationErrors: boolean = false;
  public loaded: boolean = false;
  public isReferral: boolean = false;
  public submittedEncounter: any = {};
  public selectedProgram: any;
  public errors: any[] = [];
  public enrolledProgramsByDepartment: any[] = [];
  public enrollmentCompleted: boolean  = false;
  public locations: any = [];
  public dateEnrolled: string;
  public dateCompleted: string;
  public programIncompatible: boolean = false;
  public refreshingPatient: boolean = false;
  public incompatibleMessage: any = [];
  public incompatibleCount: number = 0;
  public enrolledProgrames: any = [];
  public selectedLocation: any;
  public allPatientProgramVisitConfigs: any = {};
  public programDepartments: any = [];
  public programVisitConfig: any;
  public parentComponent: string = 'landing-page';
  public stepInfo: any = {};
  public availableDepartmentPrograms: any[] = [];
  public departmentConf: any[];
  public enrollmentEncounters: string[] = [];
  constructor(public patientService: PatientService,
              public programService: ProgramService,
              public router: Router,
              public route: ActivatedRoute,
              public departmentProgramService: DepartmentProgramsConfigService,
              public userDefaultPropertiesService: UserDefaultPropertiesService,
              public patientProgramResourceService: PatientProgramResourceService,
              public cdRef: ChangeDetectorRef,
              public localStorageService: LocalStorageService) {

  }

  public ngOnInit() {
  }

  public loadPatientProgramConfig(): Observable<any> {
    let programConfigLoaded: Subject<boolean> = new Subject<boolean>();
    this.patientService.currentlyLoadedPatient.subscribe((patient) => {
        if (patient) {
          this.patient = patient;
          this.availablePrograms  =  _.filter(patient.enrolledPrograms,  (item) => {
            return item.program.uuid !== '781d8a88-1359-11df-a1f1-0026b9348838' &&
              item.program.uuid !== '781d8880-1359-11df-a1f1-0026b9348838' && !item.isEnrolled;
          });

          this.enrolledProgrames = _.filter(patient.enrolledPrograms, 'isEnrolled');
          this.patientProgramResourceService.getPatientProgramVisitConfigs(this.patient.uuid).pipe(
            take(1)).subscribe((programConfigs) => {
            if (programConfigs) {
              this.allPatientProgramVisitConfigs = programConfigs;
              this.loaded = true;
              programConfigLoaded.next(true);
            }
          }, (error) => {
            this.loaded = true;
              programConfigLoaded.error(error);
          });
        }
      }, (err) => {
      this.loaded = true;
      programConfigLoaded.error(err);
      });

    return programConfigLoaded;
  }

  public mapEnrolledProgramsToDepartment(excludeCompleted: boolean = false) {
        if (this.enrolledProgrames) {
          let enrolledProgrames = _.filter(this.patient.enrolledPrograms, (eProgram) => {
            return !_.isNull(eProgram.enrolledProgram);
          });
          _.each(this.departmentConf, (config: any) => {
            let deparmtentPrograms = _.intersectionWith(enrolledProgrames, config.programs,
              (enrolledProgram: any, departmentProgram: any) => {
              return enrolledProgram.programUuid === departmentProgram.uuid;
            });
            if (excludeCompleted) {
              deparmtentPrograms = _.filter(deparmtentPrograms, (program) => {
                return _.isNil(program.dateCompleted);
              });
            }
            if (deparmtentPrograms.length > 0) {
              config['show'] = true;
              deparmtentPrograms.sort(this.sortByDateEnrolled);
              config.programs = deparmtentPrograms;
              this.enrolledProgramsByDepartment.push(config);
            }
          });
        }
  }

  public getDepartmentConf() {
    this.departmentProgramService.getDartmentProgramsConfig().pipe(
      take(1)).subscribe((results) => {
        if (results) {
          this.departmentConf = results;
          this._filterDepartmentConfigByName();
        }
      });
  }

  public getProgramsByDepartmentName(): any[] {
    let department = _.find(this.departmentConf, (config: any) => {
      return config.name === this.department;
    });
    if (department) {
      // Remove already enrolled programs
      return _.filter(department.programs, (program) => {
        let programs = _.map(this.availablePrograms,
          (a) => a.programUuid);
        return _.includes(programs, program.uuid);
      });
    }
    return [];
  }

  public hasStateChangeEncounterTypes(): boolean {
    return this.programVisitConfig && !_.isUndefined(this.programVisitConfig.enrollmentOptions)
      && !_.isUndefined(this.programVisitConfig.enrollmentOptions.stateChangeEncounterTypes);
  }

  public showMessage(message: string, type: string = 'error') {
    if (type === 'info') {
      this.hasNotice = true;
      this.currentNotice = message;
    } else {
      this.hasValidationErrors = true;
      this.currentError = message;
    }
  }

  public removeMessage() {
    this.hasValidationErrors = false;
    this.currentError = undefined;
    this.hasNotice = false;
    this.currentNotice = undefined;
  }

  public tick(time = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.cdRef.markForCheck();
        resolve();
      }, time);
    });
  }

  public resetNext() {
    this.tick(50).then(() => {
      this.nextStep = false;
      this.prevStep = false;
    });
  }

  public back() {
    this.prevStep = true;
    --this.currentStep;
  }

  public next() {
    this.nextStep = true;
    this.currentStep++;
  }

  public goToProgramSummary() {
    let _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/program-manager/program-summary';
    let routeOptions = {

    };
    this.router.navigate([_route], routeOptions);
  }

  public isFutureDate(checkDate) {
    let today: Date;
    today = new Date();
    return moment(checkDate).isAfter(today);
  }
  public addToStepInfo(row) {
    _.extend(this.stepInfo, row);
  }

  public serializeStepInfo(key: string = 'pm-data') {
    let currentPmData = this.localStorageService.getObject(key) || {};
    this.localStorageService.setObject(key, _.merge(currentPmData, this.stepInfo));
  }

  public getSerializedStepInfo(key: string, data: string = 'pm-data') {
    let currentPmData = this.localStorageService.getObject(data) || {};
    if (!_.isEmpty(currentPmData)) {
      return currentPmData[key];
    }
    return null;
  }

  public refreshPatient() {
    this.patientService.reloadCurrentPatient();
    return this.patientService.isBusy;
  }

  private _filterDepartmentConfigByName() {
    this.programDepartments = _.map(this.departmentConf, (config: any) => {
      return {name: config.name};
    });
  }

  private sortByDateEnrolled(a: any, b: any) {
      if (new Date(a.enrolledProgram.dateEnrolled) < new Date(b.enrolledProgram.dateEnrolled)) {
        return 1;
      }
      if (new Date(a.enrolledProgram.dateEnrolled) > new Date(b.enrolledProgram.dateEnrolled)) {
        return -1;
      }
      return 0;
  }

}
