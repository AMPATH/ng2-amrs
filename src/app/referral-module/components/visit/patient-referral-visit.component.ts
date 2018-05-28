import {
  Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges
} from '@angular/core';

import * as _ from 'lodash';

import { Patient } from '../../../models/patient.model';
import { ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';

import { PatientReferralService } from '../../services/patient-referral-service';
import { PatientService } from '../../../patient-dashboard/services/patient.service';
import { UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';

@Component({
  selector: 'patient-referral-visit',
  templateUrl: './patient-referral-visit.component.html',
  styleUrls: ['./patient-referral-visit.component.css']
})
export class PatientReferralVisitComponent implements OnInit, OnChanges {
  @Input() public program: any;
  @Input() public patient: Patient;
  public currentWorkflowState: any;
  public currentWorkflow: any;
  public programWorkflows: any[] = [];
  public selectedWorkFlowState: string;
  public workflowStates: any[] = [];
  public location: any;
  public inCare: boolean = false;
  public enrolledInProviderLocation: boolean = false;
  public display: boolean = false;
  public isUpdating: boolean = false;
  public showButton: boolean = false;
  constructor(private patientReferralService: PatientReferralService,
              private userDefaultPropertiesService: UserDefaultPropertiesService,
              private programWorkFlowResourceService: ProgramWorkFlowResourceService,
              private patientService: PatientService,
              private programWorkFlowStateResourceService: ProgramWorkFlowStateResourceService) {
  }

  public ngOnInit() {
    this._init();
  }

  public ngOnChanges(changes: SimpleChanges) {

  }

  public getWorkFlowStates() {
    this.programWorkFlowStateResourceService.getProgramWorkFlowState(this.currentWorkflow.uuid)
      .subscribe((states) => {
        this.workflowStates = _.filter(states, (state: any) => {
          return state.uuid !== this.currentWorkflowState.uuid && !state.initial;
        });
      });

  }

  public getWorkFlowState(state) {
    this.selectedWorkFlowState = state;
    this.toggleUpdateButton(true);
  }

  public updateEnrollmentState() {
    this.isUpdating = true;
    // 1. Update enroll patient
    this.patientReferralService.enrollPatient(this.program.programUuid,
      this.patient, this.location, this.selectedWorkFlowState, this.program.uuid)
      .subscribe((enrollment) => {
          this.patientService.fetchPatientByUuid(this.patient.uuid);
          // this.toggleUpdateButton(false);
          this.display = false;
          this.isUpdating = false;
        },
        (error) => {
          this.handleError(error);
        });
  }

  public changeState() {
    // in care state
    this.display = true;
    let inCareWorkflowState = _.filter(this.currentWorkflow.states, (state: any) => {
      return state.concept.uuid === '72443cac-4822-4dce-8460-794af7af8167';
    });
    if (!_.isEmpty(inCareWorkflowState)) {
      this.selectedWorkFlowState = _.first(inCareWorkflowState);
      this.updateEnrollmentState();
    }

  }

  private toggleUpdateButton(state) {
    this.showButton = state;
  }

  private _init() {
    this.setCurrentWorkflowState();
    this.checkEnrollmentInProviderLocation();
    this.programWorkFlowResourceService.getProgramWorkFlows(this.program.programUuid)
      .subscribe((workflows: any) => {
        this.programWorkflows = _.filter(workflows.allWorkflows,
          (w) => !w.retired );
        this.setCurrentWorkflow();
      });
  }

  private setCurrentWorkflow() {
    let currentWorkflowStateUuid = this.currentWorkflowState.uuid;
    let currentWorkflow = _.filter(this.programWorkflows, (workflow) => {
      let workflowStates = _.get(workflow, 'states');
      let mergingState = _.find(workflowStates, (state) => {
        return state.uuid === currentWorkflowStateUuid;
      });

      return !_.isUndefined(mergingState);
    });

    if (!_.isEmpty(currentWorkflow)) {
      this.currentWorkflow = _.first(currentWorkflow);
      this.getWorkFlowStates();
    }
  }

  private setCurrentWorkflowState() {
    let currentState = _.find(this.program.states, (programState) => {
      return programState.endDate === null;
    });

    if (!_.isNil(currentState)) {
      this.currentWorkflowState = currentState.state;
      if (currentState.state.concept.uuid === '72443cac-4822-4dce-8460-794af7af8167') {
        this.inCare = true;
      }
    }
  }

  private checkEnrollmentInProviderLocation() {
    let providerLocation = (this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject())
      .uuid;
    console.log('this.program.enrolledProgram', this.program);
    if (this.program) {
      let hasLocation = this.program.location;
      if (!_.isNil(hasLocation) && hasLocation.uuid === providerLocation) {
        this.enrolledInProviderLocation = true;
      }
    }
  }

  private handleError(err) {
    console.log(err);
  }
}
