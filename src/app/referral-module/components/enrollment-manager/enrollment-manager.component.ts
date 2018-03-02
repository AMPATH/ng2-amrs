import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientService } from '../../../patient-dashboard/services/patient.service';
import { Patient } from '../../../models/patient.model';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PatientReferralService } from '../../services/patient-referral-service';
import { EnrollementWorkflowService } from '../../services/enrollment-workflow-service';
import { UserService } from '../../../openmrs-api/user.service';
import { UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';
import { ProgramsTransferCareService
} from '../../../patient-dashboard/programs/transfer-care/transfer-care.service';
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'program-enrollment-manager',
  templateUrl: './enrollment-manager.component.html',
  styleUrls: ['./enrollment-manager.component.css']
})
export class EnrollmentManagerComponent implements OnInit, OnDestroy {
  public onReloadPrograms: Subject<boolean> = new Subject();
  public showFormWizard: boolean = false;
  public patient: Patient;
  public stateChangeForms: any[];
  public showModal: boolean = false;
  public hasError: boolean = false;
  public patientOnReferral: boolean = false;
  public modalProcessOnSuccess: boolean = false;
  public newEnrollment: any;
  public isBusy: boolean = false;
  public referralReason: string;
  public inputError: string;
  public newProgram: string;
  public availablePrograms: any[];
  public availableProgramsOptions: any[];
  private location: any;
  private stateChangeRequiresModal: boolean = false;
  private program: any;
  private state: any;
  private configs: any[];
  private confirmMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  private subscription: Subscription;

  constructor(private patientService: PatientService,
              private patientReferralService: PatientReferralService,
              private confirmationService: ConfirmationService,
              private enrollementWorkflowService: EnrollementWorkflowService,
              private userService: UserService,
              private userDefaultPropertiesService: UserDefaultPropertiesService) {

  }

  public ngOnInit() {
    this.showFormWizard = false;
      this.patientReferralService.getProcessPayload().subscribe((stateChange) => {
        if (stateChange) {
          this.state = stateChange;
          this.program = stateChange.program;
          this.showFormWizard = stateChange.showFormWizard;
          this.stateChangeForms = stateChange.forms;
          if (stateChange.stateChangeRequiresModal) {
            this.stateChangeRequiresModal = true;
          }
        }
      });
      this.patientService.currentlyLoadedPatient.subscribe((patient) => {
      if (patient !== null) {
        this.patient = patient;
      }
      this.patientReferralService.fetchAllProgramManagementConfigs().subscribe((configs) => {
        if (configs) {
          this.configs = configs;
        }
      });
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public manageProgram(target: any) {
    this.program = target.program;
    this.state = target.actionState;
    this._confirmAction();
  }

  public onProgramChange(event) {
    this.newProgram = event.value;
  }

  public formsCompleted(event) {
    if (this.stateChangeRequiresModal) {
      this.showModal = true;
    } else {
      let targetState: any = this.state;
      if (this.state.type === 'transferIn' || this.state.type === 'referIn') {
        targetState = this._getSpecificStateByConceptUuid('e517d6e2-6236-42db-9f71-0b6270c6cfa9');
        targetState.type = this.state.type;
        this.location = (this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject())
          .uuid;
      }
      this.enrollementWorkflowService.processWorkflowStateChange(this.program.programUuid,
        this.patient, this.program.enrolledProgram.location.uuid, targetState,
        this.program.enrolledProgram.uuid,
        this.location, this.program.dateEnrolled).subscribe((response: any) => {
        if (_.isArray(response)) {
          this.newEnrollment = _.find(response,
            (program) => _.isNull(program.dateCompleted));
        } else {
          this.newEnrollment = response;
        }
        this._processComplete();
        if (this.modalProcessOnSuccess) {
          this.modalProcessOnSuccess = false;
        }
        this.patientService.fetchPatientByUuid(this.patient.uuid);
        this.onReloadPrograms.next(true);
      });
    }
  }

  public undoReferral() {
    this.patientOnReferral = false;
  }

  public getSelectedLocation(location) {
    this.location = location.locations;
    this._hasValidInput();
    if (this._patientEnrolledInSameLocation() && this.state.type === 'referred') {
      this.patientOnReferral = true;
    }
  }

  public closeDialog() {
    this.modalProcessOnSuccess = false;
    this.showModal = false;
    this.state = undefined;
    this.program = undefined;
    this.onReloadPrograms.next(true);
  }

  public cancelProcess() {
    this.showModal = false;
    this.state = undefined;
    this.program = undefined;
    this.showFormWizard = false;
    this.modalProcessOnSuccess = false;
  }

  public referPatient() {
    this.isBusy = true;
    let currentUser = this.userService.getLoggedInUser();
    this.patientReferralService.getUserProviderDetails(currentUser).then((provider) => {
      let programInfo = {
        referredToLocation: this.location,
        referredFromLocation: this.program.enrolledProgram.location.uuid,
        notificationStatus: null,
        referralReason: _.isUndefined(this.referralReason) ?  '' : this.referralReason,
        provider: provider.uuid,
        state: this.state.uuid
      };
      if (this._hasValidInput()) {
        this.enrollementWorkflowService.enrollPatient(
          this.program.programUuid, this.patient, this.location, this.state, '')
          .subscribe((enrollment) => {
            if (enrollment) {
              this.newEnrollment = enrollment;
              // 2. Save encounter
              _.extend(programInfo, {
                patientProgram: enrollment.uuid
              });
              this.patientReferralService.saveReferralEncounter(programInfo)
                .subscribe((savedEncounter) => {
                  this._processComplete();
                }, (error) => {
                });
            } else {
              console.log('Referral Failed');
            }
          });
      }
    }).catch((err) => {
      console.log('provider error', err);
    });
  }

  public completeLocationChangeProcess() {
    let targetState: any = this.state;
    let program = this.program.programUuid;
    if (this.state.type === 'switchProgram') {
      targetState = this._getSpecificStateByConceptUuid('e517d6e2-6236-42db-9f71-0b6270c6cfa9');
      targetState.type = 'switchProgram';
      program = this.newProgram;
    }

    if (this.state.type === 'transferOut') {
      targetState = this._getSpecificStateByConceptUuid('56003eb5-d300-457d-badb-371e030e2580');
      targetState.type = 'transferOut';
    }

    this.enrollementWorkflowService.processWorkflowStateChange(program, this.patient,
      this.program.enrolledProgram.location.uuid, targetState, this.program.enrolledProgram.uuid,
      this.location, this.program.dateEnrolled, this.program.programUuid)
      .subscribe((response: any) => {
        if (_.isArray(response)) {
          this.newEnrollment = _.find(response,
            (program) => _.isNull(program.dateCompleted));
        } else {
          this.newEnrollment = response;
        }
      this._processComplete();
      this.onReloadPrograms.next(true);

    });
  }

  private _getSpecificStateByConceptUuid(uuid: string) {
    let states = (_.first(this.program.program.openmrsModel.allWorkflows) as any).states;
    return _.first(_.filter(states, (state) => state.concept.uuid === uuid));
  }

  private _provideActionStep() {
    this._filterCurrentProgram().then((target: any) => {
        _.extend(this.state, {
          type: target.type,
          forms: target.forms
        }, {
          program: this.program
        });
        if (!_.isEmpty(target.forms)) {
          this.showFormWizard = true;
          _.extend(this.state, {
            showFormWizard : true,
            stateChangeRequiresModal: this.stateChangeRequiresModal
          });
          this.stateChangeForms = target.forms;
          this.patientReferralService.saveProcessPayload(this.state);
        } else {
          this.formsCompleted({});
        }
    }).catch(() => {
      this.hasError = true;
    });
  }

  private _filterCurrentProgram() {
    return new Promise((resolve, reject) => {
      if (!_.isEmpty(this.configs)) {
        let _config = this.configs[this.program.programUuid];
        let targetStateChange: any;
        if (_config) {
          let enrollmentOptions = _.get(_config, 'enrollmentOptions');
          _.extend(this.program, enrollmentOptions);
          let stateChangeForms = _.get(_config, 'stateChangeForms');
          if (!_.isEmpty(stateChangeForms)) {
            targetStateChange = _.find(stateChangeForms, (state) => {
              return state.uuid === this.state.concept.uuid;
            });
          }
          resolve(targetStateChange);
        } else {
          reject();
        }
      }
    });
  }

  private _confirmAction() {
    let msg;
    switch (this.state.concept.uuid) {
      // discharge
      case '4e6d4fd4-d923-439e-9b6e-6baaffd20bfa':
        msg = 'You are about to ' + this.state.concept.display.toLowerCase() +
          ' a patient from ' + this.program.enrolledProgram.display + '. Proceed?';
        this.stateChangeRequiresModal  = false;
        this._confirmWithMessage(msg);
        break;
      // refer
      case '98d8131e-973d-4082-9115-2a848daee5a2':
        msg = 'Refer patient for ' + this.program.enrolledProgram.display + '?';
        this.stateChangeRequiresModal = true;
        this._confirmWithMessage(msg);
        break;
      // refer out
      case '9872d3e8-0a31-459d-b160-1a393a055894':
        msg = 'Refer patient out for ' + this.program.enrolledProgram.display + '?';
        this.stateChangeRequiresModal = true;
        this._confirmWithMessage(msg);
        break;
      // incare
      case 'e517d6e2-6236-42db-9f71-0b6270c6cfa9':
        msg = 'You are about to put the patient to a state of In Care for ' +
          this.program.enrolledProgram.display + '. Proceed?';
        this.stateChangeRequiresModal  = false;
        this._confirmWithMessage(msg);
        break;
      // switch
      case 'a68566e2-67f9-49e8-b81e-2e5af7ffa9ac':
        msg = 'Switch patient from ' + this.program.enrolledProgram.display +
          ' to another program. Proceed?';
        this.stateChangeRequiresModal = true;
        this.availableProgramsOptions = _.map(this.patient.enrolledPrograms,
          (availableProgram) => {
          if (!availableProgram.isEnrolled) {
            return {
              label: availableProgram.program.display,
              value: availableProgram.program.uuid
            }
          }
          });
        // sort alphabetically;
        this.availableProgramsOptions = _.compact(_.orderBy(this.availableProgramsOptions,
          ['label'],['asc']));
        this.newProgram = (_.first(this.availableProgramsOptions)).value;
        this._confirmWithMessage(msg);
        break;
      // refer in
      case '78526af3-ef12-4f53-94de-51c455ef0a88':
        msg = 'You are about to receive the patient(referred) to this facility for ' +
          this.program.enrolledProgram.display + '. Proceed?';
        this.stateChangeRequiresModal  = false;
        this._confirmWithMessage(msg);
        break;
      // refer back
      case '631ebf7a-e000-4220-9038-e70079ceafca':
        msg = 'Refer the patient back to referring facility for ' +
          this.program.enrolledProgram.display + '?';
        this.stateChangeRequiresModal = true;
        this._confirmWithMessage(msg);
        break;
      // transfer out
      case '5d488b21-d08e-4e5f-b195-1ea1b5bb9c28':
        msg = 'Transfer patient out to another facility?';
        this.stateChangeRequiresModal = true;
        this._confirmWithMessage(msg);
        break;
      // transfer in
      case 'e293229b-4e74-445c-bfd2-602bbe4a91fb':
        msg = 'Transfer patient in to this facility?';
        this.stateChangeRequiresModal  = false;
        this._confirmWithMessage(msg);
        break;
      // pending transfer
      case '56003eb5-d300-457d-badb-371e030e2580':
        msg = 'Put patient in pending transfer? The patient will still remain enrolled ' +
          'in this facility under ' + this.program.enrolledProgram.display +
          ' until transferred in in ' +
          'the new location';
        this.stateChangeRequiresModal  = false;
        this._confirmWithMessage(msg);
        break;
    }
    this.confirmationService.confirm(this.confirmMessage.getValue());
  }

  private _confirmWithMessage(msg: string) {
    this.confirmMessage.next({
      icon: 'fa fa-exclamation-triangle fa-3x',
      header: this.state.concept.display,
      message: msg,
      rejectVisible: true,
      acceptVisible: true,
      accept: () => {
        this._provideActionStep();
        console.log('availableProgramsOptions', this.availableProgramsOptions);
      },
      reject: () => {
        this._cancelAction();
      }
    });
  }

  private _cancelAction() {
    this.confirmMessage.next(null);
    this.state = undefined;
    this.program = undefined;
  }

  private _processComplete() {
    this.showFormWizard = false;
    this.isBusy = false;
    this.hasError = false;
    this.modalProcessOnSuccess = true;
    this.patientReferralService.saveProcessPayload(null);
  }

  private _patientEnrolledInSameLocation() {
    let hasLocation = this.program.enrolledProgram.location;
    return !_.isNil(hasLocation) && hasLocation.uuid === this.location;
  }

  private _hasValidInput() {
    if (_.isUndefined(this.location)) {
      this.patientOnReferral = false;
      this.inputError = 'All inputs are required except `reason`';
      return false;
    } else {
      this.inputError = undefined;
    }
    return true;
  }
}
