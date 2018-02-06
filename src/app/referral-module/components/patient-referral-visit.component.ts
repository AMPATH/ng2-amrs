import {
  Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges
} from '@angular/core';

import * as _ from 'lodash';

import { Patient } from '../../models/patient.model';
import { ProgramWorkFlowResourceService
} from '../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../openmrs-api/program-workflow-state-resource.service';

import { PatientReferralService } from '../services/patient-referral-service';
import { PatientService } from '../../patient-dashboard/services/patient.service';

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
  public showButton: boolean = false;
  constructor(private patientReferralService: PatientReferralService,
              private patientService: PatientService,
              private programWorkFlowResourceService: ProgramWorkFlowResourceService,
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
        this.workflowStates = _.filter(states, (state) => {
          return state.uuid !== this.currentWorkflowState.uuid;
        });
      });

  }

  public getWorkFlowState(state) {
    this.selectedWorkFlowState = state;
    this.toggleUpdateButton();
  }

  public updateEnrollmentState() {
    // 1. Update enroll patient
    this.patientReferralService.enrollPatient(this.program.programUuid,
      this.patient, this.location, this.selectedWorkFlowState, this.program.uuid)
      .subscribe((enrollment) => {
      this.patientService.fetchPatientByUuid(this.patient.uuid);
      this.toggleUpdateButton();
      },
      (error) => {
        this.handleError(error);
      });
  }

  private toggleUpdateButton() {
    this.showButton = !this.showButton;
  }

  private _init() {
    this.setCurrentWorkflowState();
    this.programWorkFlowResourceService.getProgramWorkFlows(this.program.programUuid)
      .subscribe((workflows: any) => {
        this.programWorkflows = workflows.allWorkflows;
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
    }
  }

  private handleError(err) {
    console.log(err);
  }
}
