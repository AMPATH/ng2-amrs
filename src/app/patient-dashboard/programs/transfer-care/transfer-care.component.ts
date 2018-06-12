import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ProgramsTransferCareService } from './transfer-care.service';
import { PatientProgramService } from '../patient-programs.service';
import { DepartmentProgramsConfigService } from
'./../../../etl-api/department-programs-config.service';

@Component({
  selector: 'app-programs-transfer-care',
  templateUrl: './transfer-care.component.html',
  styleUrls: ['./transfer-care.component.css']
})
export class ProgramsTransferCareComponent implements OnInit, OnDestroy {
  @Input()
  public isModal: boolean = false;
  @Output()
  public showFormWizard: EventEmitter<any> = new EventEmitter();
  public department: string;
  public transferType: string;
  public dateOfTransfer: Date;
  public transferToLocation: any;
  public currentDepartmentEnrollments: any[] = [];
  public programDepartments: any = [];
  public transferAll: boolean = false;
  public showLocationSelect: boolean = false;
  public hasTransferError: boolean = false;
  public programsToTransfer: any[] = [];
  public maxDate: string;
  private departmentConf: any[];
  private subscription: Subscription;

  constructor(private transferCareService: ProgramsTransferCareService,
              private router: Router,
              private route: ActivatedRoute,
              private patientService: PatientService,
              private patientProgramService: PatientProgramService,
              private departmentProgramService: DepartmentProgramsConfigService) {
    this.maxDate = moment().format('YYYY-MM-DD');
  }

  public ngOnInit() {
    this.getDepartmentConf();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    this._getEnrolledProgramsByDepartmentName();
  }

  public addAllToTransfer(event) {
    this.currentDepartmentEnrollments = _.map(this.currentDepartmentEnrollments, (program) => {
      this.addToTransfer(program, event);
      return program;
    });
  }

  public addToTransfer(program: any, status: boolean) {
    if (program.transfer !== undefined) {
      program.transfer = status;
    } else {
      _.merge(program, { transfer: true, department: this.department });
    }
    this._setSelectedProgramsForTransfer();
  }

  public toggleLocationSelect(transferType: string) {
    this.transferType = transferType;
    this.showLocationSelect = this.transferType === 'AMPATH';
  }

  public getSelectedLocation(location: any) {
    this.transferToLocation = location;
  }

  public confirmTransfer() {
    this.hasTransferError = false;
    if (this._isValidTransferForm()) {
      let _programsToTransfer = _.map(this.programsToTransfer, (program) => {
        return _.merge(program, {
          transferDate: this.dateOfTransfer,
          transferType: this.transferType
        });
      });

      let payLoad = {
        programs: _programsToTransfer,
        transferDate: this.dateOfTransfer,
        transferType: this.transferType
      };

      if (this.transferToLocation) {
        _.extend(payLoad, {location: this.transferToLocation});
      }
      this.transferCareService.savePayload(payLoad);
      this._goToFormWizard();
    } else {
      this.hasTransferError = true;
    }
  }

  private _goToFormWizard() {
    if (this.isModal) {
      this.showFormWizard.emit(true);
    } else {
      this.router.navigate(['forms'], {
        queryParams: {
          processId: _.uniqueId('component_transfer_care_')
        },
        relativeTo: this.route
      });
    }
  }

  private _isValidTransferForm() {
    return !_.isUndefined(this.transferType) &&
           !_.isEmpty(this.programsToTransfer) &&
           !_.isUndefined(this.dateOfTransfer) &&
           ((!_.isUndefined(this.transferToLocation) && this.showLocationSelect) ||
           (!this.showLocationSelect && _.isUndefined(this.transferToLocation)));
  }

  private _getEnrolledProgramsByDepartmentName() {
    this.patientService.currentlyLoadedPatientUuid.subscribe((patientUuid) => {
      this.patientProgramService.getCurrentlyEnrolledPatientPrograms(patientUuid)
        .subscribe((enrollments) => {
          let currentDepartmentPrograms = this._getProgramsByDepartmentName();
          let _currentDepartmentPrograms = _.map(currentDepartmentPrograms, (program: any) => {
            return {name: program.name, programUuid: program.uuid};
          });
          this.currentDepartmentEnrollments =
            (_.intersectionBy(_.filter(enrollments, 'isEnrolled'),
              _currentDepartmentPrograms, 'programUuid')) || [];
        });
    });
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

  private _setSelectedProgramsForTransfer() {
    this.programsToTransfer = _.filter(this.currentDepartmentEnrollments, (program) => {
      return program.transfer !== undefined && program.transfer === true;
    });
  }
}
