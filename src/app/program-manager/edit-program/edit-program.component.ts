import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { ProgramManagerBaseComponent } from '../base/program-manager-base.component';
import { PatientService } from '../../patient-dashboard/services/patient.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import {
  UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { ProgramManagerService } from '../program-manager.service';

@Component({
  selector: 'program-edit',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.css']
})
export class EditProgramComponent extends ProgramManagerBaseComponent implements OnInit {
  public programsToEdit: any[] = [];
  public updating = false;
  public theChange: string;
  public theChangeComplete = false;
  public successValue: any;
  public formsFilled = false;

  constructor(public patientService: PatientService,
              public programService: ProgramService,
              public router: Router,
              public route: ActivatedRoute,
              public departmentProgramService: DepartmentProgramsConfigService,
              public userDefaultPropertiesService: UserDefaultPropertiesService,
              public patientProgramResourceService: PatientProgramResourceService,
              public cdRef: ChangeDetectorRef,
              public localStorageService: LocalStorageService,
              private programManagerService: ProgramManagerService) {
    super(patientService,
      programService,
      router,
      route,
      departmentProgramService,
      userDefaultPropertiesService,
      patientProgramResourceService, cdRef, localStorageService);
  }

  public ngOnInit() {
    this.steps = [1, 2, 3, 4];
    this.title = 'Select Programs to edit';
    this.route.params.subscribe((params) => {
      this.getDepartmentConf();
      this.loadPatientProgramConfig().pipe(take(1)).subscribe((loaded) => {
        if (loaded) {
          this.mapEnrolledProgramsToDepartment(true);
          if (loaded && params['step']) {
            this.loadOnParamInit(params);
          }
        }
      }, () => {
        this.loaded = true;
        this.hasError = true;
      });
    });

  }

  public updateProgramsToEdit(event, program) {
    this.programVisitConfig = _.get(this.allPatientProgramVisitConfigs, program.programUuid);
    if (this.programVisitConfig && this.hasStateChangeEncounterTypes()) {
      _.extend(program, {
        stateChangeEncounterTypes:
        this.programVisitConfig.enrollmentOptions.stateChangeEncounterTypes
      });
    }
    if (event.target.checked) {
      this.programsToEdit.push(program);
    } else {
      _.remove(this.programsToEdit, (_program) => {
        return _program.uuid === program.uuid;
      });
    }
    this.addToStepInfo({
      programsToEdit: this.programsToEdit
    });
    this.serializeStepInfo('pm-edit-data');
  }

  public goBack() {
    this.theChange = undefined;
    this.back();
  }

  public goToEditOptions() {
    if (_.isEmpty(this.programsToEdit)) {
      this.showMessage('Please select at least one program to proceed');
    } else {
      this.removeMessage();
      this.title = 'Edit Programs';
      this.addToStepInfo({
        programsToEdit: this.programsToEdit
      });
      this.next();
    }
  }

  public changeLocation() {
    this.title = 'Change Location';
    this.theChange = 'location';
    this.next();
  }

  public replyToChildComponent(reply) {
    if (reply) {
      if (!this.program) {
        this.next();
      } else {
        this.jumpStep = this.currentStep;
      }
      this.theChangeComplete = true;
      this.successValue = reply;
      this.localStorageService.remove('pm-edit-data');
      this.localStorageService.remove('transferLocation');
      this.tick(3000).then(() => {
        this.refreshPatient();
      });

    }
  }

  public startAgain() {
    this.resetNext();
    this.currentStep = 1;
    this.jumpStep = 1;
    const _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/program-manager/edit-program';
    this.router.navigate([_route], {});
  }

  public stopPrograms() {
    this.title = 'Stop Program(s)';
    this.theChange = 'stop';
    // only pick discharge in the statechange forms
    this.pickStateChangeEncounters(['discharge']);
    this.addToStepInfo({
      theChange: this.theChange
    });
    this.serializeStepInfo('pm-edit-data');
    this.next();
  }

  public transferOut() {
    this.title = 'Transfer out of AMPATH';
    this.theChange = 'transfer';
    // only pick nonAmpath transfer in the statechange forms
    this.pickStateChangeEncounters(['nonAmpath']);
    this.addToStepInfo({
      theChange: this.theChange
    });
    this.serializeStepInfo('pm-edit-data');
    this.next();
  }

  public onStepChangeComplete(stepInfo) {
    if (stepInfo) {
      this.replyToChildComponent(stepInfo);
    }
  }

  private showNoticeIfPossible() {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams && !_.isEmpty(queryParams) && queryParams.notice) {
      switch (queryParams.notice) {
        case 'outreach':
          this.showMessage('Please complete transfer care process. ' +
            'Select target programs to continue.', 'info');
          break;
        case 'pmtct':
          this.showMessage('The patient has been transferred to MCH and successfully enrolled in PMTCT.', 'info');
          break;
        case 'adherence':
          this.title = 'Program Successfully Started';
          this.showMessage('The patient has been enrolled in Viremia Program successfully.', 'info');
          break;
        default:
      }
    } else {
      this.removeMessage();
    }
  }

  private quickEditProgram(program: string) {
    const selectedProgram = _.find(this.availablePrograms, (_program: any) => {
      return _program.programUuid === program;
    });
    this.programVisitConfig = this.allPatientProgramVisitConfigs[program];
    if (this.isIncompatibleChoice() && selectedProgram && this.patient) {
      const programs: any[] = [];
      _.each(this.enrolledProgrames, (enrolled: any) => {
        if (_.includes(_.map(this.incompatibleProgrames, 'uuid'), enrolled.programUuid)) {
          _.merge(enrolled, {
            dateCompleted: new Date()
          });
          programs.push(enrolled);
        }
      });
      const location = this.localStorageService.getItem('transferLocation');
      this.programManagerService.editProgramEnrollments(
        'stop', this.patient, programs, location)
        .pipe(take(1)).subscribe((editedPrograms) => {
        if (editedPrograms) {
          this.autoEnroll(selectedProgram);
        }
      }, (err) => {
        console.log('failed to autenroll', err);
      });
    } else if (this.incompatibleCount === 0 && selectedProgram && this.patient) {
      this.autoEnroll(selectedProgram);
    }
  }

  private autoEnroll(selectedProgram: any) {
    this.updateProgramsToEdit({target: {checked: true}}, selectedProgram);
    this.goToEditOptions();
    --this.currentStep;
    this.changeLocation();
    this.showNoticeIfPossible();
  }

  private patientEnrolled(program) {
    return _.includes(_.map(this.enrolledProgrames, 'programUuid'), program);
  }

  private pickStateChangeEncounters(target: string[]) {
    const updatedPrograms = _.map(this.programsToEdit, (program) => {
      program.stateChangeEncounterTypes = _.pick(program.stateChangeEncounterTypes,
        target);
      return program;
    });
    this.addToStepInfo({
      programsToEdit: updatedPrograms
    });
  }

  private loadOnParamInit(params: any) {
    this.currentStep = parseInt(params.step, 10);
    const queryParams: any = this.route.snapshot.queryParams;
    if (queryParams && queryParams.program && !this.theChangeComplete) {
      this.formsFilled = true;
      this.program = queryParams.program;
      if (!this.patientEnrolled(this.program)) {
        this.quickEditProgram(queryParams.program);
      } else {
        this.removeMessage();
        this.showMessage('The patient is already enrolled in the program.', 'error');
      }
    } else {
      this.jumpStep = this.currentStep;
      this.deserializeStepInfo();
      if (this.currentStep === 3) {
        this.formsFilled = true;
      }
    }
    this.showNoticeIfPossible();
  }

  private deserializeStepInfo() {
    const stepInfo = this.localStorageService.getObject('pm-edit-data');
    if (stepInfo) {
      this.programsToEdit = stepInfo.programsToEdit;
      this.theChange = stepInfo.theChange;
    } else {
      this.currentStep = 1;
      this.jumpStep = -1;
      const _route = '/patient-dashboard/patient/' + this.patient.uuid
        + '/general/general/program-manager/edit-program';
      this.router.navigate([_route], {});
    }
  }
}
