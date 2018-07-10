import {
  Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges
} from '@angular/core';

import * as _ from 'lodash';
import { Form } from 'ng2-openmrs-formentry';

import { Patient } from '../../../models/patient.model';
import { ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';

import { PatientReferralService } from '../../services/patient-referral-service';
import { UserService } from '../../../openmrs-api/user.service';

@Component({
  selector: 'patient-referral-item',
  templateUrl: './patient-referral-item.component.html',
  styleUrls: ['./patient-referral-item.component.css']
})
export class PatientReferralItemComponent implements OnInit, OnChanges {
  @Input() public refer: boolean;
  @Input() public program: any;
  @Input() public selectedState: any;
  @Input() public submittedEncounter: any;
  @Input() public referredFromLocation: any;
  @Input() public locationUuid: any;
  @Input() public form: Form;
  @Input() public patient: Patient;
  @Output() public onAborting: EventEmitter<any> = new EventEmitter();
  @Output() public onSuccess: EventEmitter<boolean> = new EventEmitter();
  public patientReferralOnSuccess: boolean = false;
  public currentWorkflowState: string = '';
  public selectedWorkflow: any;
  public programWorkflows: any[] = [];
  public selectedWorkFlowState: any;
  public workflowStates: any[] = [];
  public referralReason: string;
  public location: any;
  public newErollment: any;
  public patientOnRefferal: boolean = false;
  public inputError: string;
  constructor(private patientReferralService: PatientReferralService,
              private programWorkFlowResourceService: ProgramWorkFlowResourceService,
              private userService: UserService,
              private programWorkFlowStateResourceService: ProgramWorkFlowStateResourceService) {
  }

  public ngOnInit() {
    this._init();
  }

  public ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (changes[propName]) {
        let change = changes[propName];
        let cur  = change.currentValue;
        let prev = change.previousValue;
        if (propName === 'refer') {
          if (this.locationUuid) {
            this.location = this.locationUuid.value;
          }
        }

        if (propName === 'refer' && cur === true) {
          let encounter: any = _.first(this.submittedEncounter);
          let programInfo = {
            referredToLocation: this.location,
            referredFromLocation: _.isObject(this.referredFromLocation) ?
              this.referredFromLocation.value : this.referredFromLocation,
            notificationStatus: null,
            referralReason: _.isUndefined(this.referralReason) ?  '' : this.referralReason,
            state: this.selectedState ? this.selectedState.uuid : this.selectedWorkFlowState.uuid
          };
          if (encounter) {
            _.extend(programInfo, { encounter: encounter.uuid});
            this.patientReferralService.getEncounterProvider(encounter.uuid)
              .subscribe((provider) => {
                if (provider) {
                  _.extend(programInfo, { provider: provider.uuid});
                  this._completeReferral(programInfo);
                }
              });
          } else {
            let currentUser = this.userService.getLoggedInUser();
            this.patientReferralService.getUserProviderDetails(currentUser)
              .then((provider) => {
              if (provider) {
                _.extend(programInfo, { provider: provider.uuid});
                this._completeReferral(programInfo);
              }
              });
          }
        }
      }
    }
  }

  public getWorkFlowStates(workflow) {
    this.programWorkFlowStateResourceService.getProgramWorkFlowState(workflow.uuid)
      .subscribe((states) => {
        this.workflowStates = _.filter(states, (state: any) => {
          return state.initial;
        });
        this.hasValidInput();
      });

  }

  public getWorkFlowState(state) {
    console.log('statestatestate', state);
    this.selectedWorkFlowState = state;
    this.hasValidInput();
  }

  public getSelectedLocation(location) {
    this.location = location.locations.value;
    // check if this patient is enrolled in this location
    if (this.patientEnrolledInSameLocation()) {
      this.setCurrentWorkflowState();
      // this.patientOnRefferal = true;
      // this.onAborting.emit(this.program);
    }
    this.hasValidInput();

  }

  public undoReferral() {
      this.patientOnRefferal = false;
      this._abortReferral(this.program);
  }

  private _completeReferral(programInfo) {
    if (this.hasValidInput()) {
      this.refer = true;
      this.enrollPatientInReferredProgram(programInfo);
    } else {
      this._abortReferral(programInfo);
    }
  }

  private _abortReferral(programInfo) {
    this.program.isReferring = false;
    this.refer = false;
    this.onAborting.emit(programInfo);
  }

  private hasValidInput() {
    if (_.isUndefined(this.location) && this.refer) {
        this.patientOnRefferal = false;
        this.inputError = 'All inputs are required except `reason`';
        return false;
    } else {
      this.refer = false;
      this.inputError = undefined;
    }
    return true;
  }

  private enrollPatientInReferredProgram(programInfo) {
    console.log('this.program', this.program);
    // 1. Enroll patient
    this.patientReferralService.enrollPatient(this.program.programUuid,
      this.patient, this.location, this.selectedWorkFlowState, '')
      .subscribe((enrollment) => {
          this.newErollment = enrollment;
          // 2. Save encounter
          _.extend(programInfo, {
            patientProgram: enrollment.uuid
          });
          this.patientReferralService.saveReferralEncounter(programInfo)
            .subscribe((savedEncounter) => {
              console.log('savedEncounter', savedEncounter);
              // 3. complete referral if its referring back
              if (this.program.patient_referral_id) {
                this.patientReferralService.updateReferalNotificationStatus({
                  patient_referral_id: this.program.patient_referral_id,
                  notificationStatus: 1
                }).subscribe((response) => {
                  this.handleSuccessfulReferral();
                }, (error) => {
                  console.log('updateReferalNotificationStatus error ====> ', error);
                  // complete the referral anyway
                  this.handleSuccessfulReferral();
                });
              } else {
                this.handleSuccessfulReferral();
              }
            }, (error) => {
              this.handleError(error);
            });
        },
        (error) => {
          this.handleError(error);
        });
  }

  private _init() {
    this.programWorkFlowResourceService.getProgramWorkFlows(this.program.programUuid)
      .subscribe((workflows: any) => {
        this.programWorkflows = workflows.allWorkflows;
        if (this.programWorkflows.length === 0) {
          this.program.isReferring = false;
          this.onAborting.emit(this.program);
        } else {
          this.program.isReferring = true;
          // assuming there is only one active workflow. More stricter way is to check the concept
          // uuid
          let workflow = _.first(_.filter(this.programWorkflows, (w) => !w.retired ));
          this.programWorkFlowStateResourceService.getProgramWorkFlowState(workflow.uuid)
            .subscribe((states) => {
              this.workflowStates = _.filter(states, (state: any) => {
                return state.initial &&
                  state.concept.uuid === '0c5565c5-45cf-40ab-aa6d-5694aeabae18';
              });

              if (this.workflowStates.length > 0) {
                this.selectedWorkFlowState = _.first(this.workflowStates);
              }
            });
        }
      });
  }

  private setCurrentWorkflowState() {
    let currentState = _.find(this.program.enrolledProgram.states, (programState: any) => {
      return programState.endDate === null;
    });

    if (!_.isNil(currentState)) {
      this.currentWorkflowState = currentState.state.concept.display;
    }
  }

  private patientEnrolledInSameLocation() {
    let patientEnrolled = !_.isNil(this.program.enrolledProgram);
    if (this.program.enrolledProgram) {
      let hasLocation = this.program.enrolledProgram.location;
      return patientEnrolled && !_.isNil(hasLocation) && hasLocation.uuid === this.location;
    }
    return false;
  }

  private handleError(err) {
    console.log(err);
  }

  private handleSuccessfulReferral() {
    this.patientReferralOnSuccess = true;
    this.program.isReferring = false;
    this.patientOnRefferal = false;
    this.inputError = undefined;
    this.refer = false;
    this.onSuccess.emit(true);
  }
}
