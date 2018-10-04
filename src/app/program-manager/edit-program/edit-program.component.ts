import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { ProgramManagerBaseComponent } from '../base/program-manager-base.component';
import { PatientService } from '../../patient-dashboard/services/patient.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';

@Component({
  selector: 'program-edit',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.css']
})
export class EditProgramComponent extends ProgramManagerBaseComponent implements OnInit {
  public programsToEdit: any[] = [];
  public updating: boolean = false;
  public theChange: string;
  public theChangeComplete: boolean = false;
  public successValue: any;
  public formsFilled: boolean = false;
  constructor(public patientService: PatientService,
              public programService: ProgramService,
              public router: Router,
              public route: ActivatedRoute,
              public departmentProgramService: DepartmentProgramsConfigService,
              public userDefaultPropertiesService: UserDefaultPropertiesService,
              public patientProgramResourceService: PatientProgramResourceService,
              public cdRef: ChangeDetectorRef,
              public localStorageService: LocalStorageService) {
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
      this.loadPatientProgramConfig().take(1).subscribe((loaded) => {
        if (loaded) {
          this.mapEnrolledProgramsToDepartment(true);
          if (loaded && params['step']) {
            this.loadOnParamInit(params);
          }
          this.showOutreachNoticeIfPossible();
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
        stateChangeEncounterTypes :
        this.programVisitConfig.enrollmentOptions.stateChangeEncounterTypes
      });
    }
    if (event.target.checked) {
      this.programsToEdit.push(program);
    } else {
      _.remove(this.programsToEdit, (_program) => {
        return _program.uuid === program.uuid;
      });
      this.addToStepInfo({
        programsToEdit: this.programsToEdit
      });
      this.serializeStepInfo();
    }
  }

  public goBack() {
    this.theChange = undefined;
    this.back();
  }

  public gotToEditOptions() {
    if (_.isEmpty(this.programsToEdit)) {
      this.showMessage('Please select at least one program to proceed')
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
      this.theChangeComplete = true;
      this.successValue = reply;
      this.next();
      this.localStorageService.remove('pm-edit-data');
      this.tick(3000).then(() => {
        this.refreshPatient();
      });

    }
  }

  public startAgain() {
    this.title = 'Select Programs to edit';
    this.resetNext();
    this.currentStep = 1;
    this.jumpStep = 1;
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

  private showOutreachNoticeIfPossible() {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams && !_.isEmpty(queryParams) && queryParams.notice) {
      this.showMessage('Please complete transfer care process. ' +
        'Select target programs to continue.', 'info');
    } else {
      this.removeMessage();
    }
  }

  private pickStateChangeEncounters(target: string[]) {
    let updatedPrograms = _.map(this.programsToEdit, (program) => {
      program.stateChangeEncounterTypes = _.pick(program.stateChangeEncounterTypes,
        target);
      return program;
    });
    this.addToStepInfo({
      programsToEdit: updatedPrograms
    })
  }

  private loadOnParamInit(params: any) {
    this.currentStep = parseInt(params.step, 10);
    this.jumpStep = this.currentStep;
    this.deserializeStepInfo();
    if (this.currentStep === 3) {
      this.formsFilled = true;
    }
  }

  private deserializeStepInfo() {
    let stepInfo = this.localStorageService.getObject('pm-edit-data');
    if (stepInfo) {
      this.programsToEdit = stepInfo.programsToEdit;
      this.theChange = stepInfo.theChange;
    } else {
      this.currentStep = 1;
      this.jumpStep = -1;
      let _route = '/patient-dashboard/patient/' + this.patient.uuid
        + '/general/general/program-manager/edit-program';
      this.router.navigate([_route], {});
    }
  }
}
