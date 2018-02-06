import {
  Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges
} from '@angular/core';

import * as _ from 'lodash';
import { Form } from 'ng2-openmrs-formentry';

import { Patient } from '../../models/patient.model';
import { ProgramWorkFlowResourceService
} from '../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../openmrs-api/program-workflow-state-resource.service';

import { PatientReferralService } from '../services/patient-referral-service';

@Component({
  selector: 'patient-referral-item',
  templateUrl: './patient-referral-item.component.html',
  styleUrls: ['./patient-referral-item.component.css']
})
export class PatientReferralItemComponent implements OnInit, OnChanges {
  @Input() public refer: boolean;
  @Input() public program: any;
  @Input() public form: Form;
  @Input() public patient: Patient;
  @Output() public onAborting: EventEmitter<any> = new EventEmitter();
  @Output() public onSuccess: EventEmitter<boolean> = new EventEmitter();
  public patientRefferalOnSuccess: boolean = false;
  public currentWorkflowState: string = '';
  public selectedWorkflow: any;
  public programWorkflows: any[] = [];
  public selectedWorkFlowState: string;
  public workflowStates: any[] = [];
  public referralReason: string;
  public location: any;
  public newErollment: any;
  public patientOnRefferal: boolean = false;
  public inputError: string;
  private enrollmentConcept = '65cb2cac-3cfe-40f8-ae0e-374e2e1cef04';
  constructor(private patientReferralService: PatientReferralService,
              private programWorkFlowResourceService: ProgramWorkFlowResourceService,
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
          console.log('refer changed to', cur);
        }

        if (propName === 'refer' && cur === true) {
          let programInfo = {
            location: this.location,
            patient: this.patient.person.uuid,
            encounterProviders: [{
              provider: this.form.valueProcessingInfo.providerUuid,
              encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
            }],
          };
          if (this.hasValidInput()) {
            this.refer = true;
            this.enrollPatientInRefferedProgram(programInfo);
          } else {
            this.program.isReferring = false;
            this.refer = false;
            this.onAborting.emit(true);
          }
        }
      }
    }
  }

  public getWorkFlowStates(workflow) {
    this.programWorkFlowStateResourceService.getProgramWorkFlowState(workflow.uuid)
      .subscribe((states) => {
        this.workflowStates = states;
        this.hasValidInput();
      });

  }

  public getWorkFlowState(state) {
    this.selectedWorkFlowState = state;
    this.hasValidInput();
  }

  public getSelectedLocation(location) {
    this.location = location.locations;
    // check if this patient is enrolled in this location
    if (this.patientEnrolledInSameLocation()) {
      this.setCurrentWorkflowState();
      this.patientOnRefferal = true;
      this.onAborting.emit(this.program);
    }
    this.hasValidInput();

  }

  public undoReferral() {
    this.patientOnRefferal = !this.patientOnRefferal;
  }

  private hasValidInput() {
    if ((_.isUndefined(this.selectedWorkflow)
      || _.isUndefined(this.selectedWorkFlowState)
      || _.isUndefined(this.location)) && this.refer) {
        this.patientOnRefferal = false;
        this.inputError = 'All inputs are required except `reason`';
        return false;
    } else {
      this.refer = false;
      this.inputError = undefined;
    }
    return true;
  }

  private enrollPatientInRefferedProgram(programInfo) {
    // 1. Enroll patient
    this.patientReferralService.enrollPatient(this.program.programUuid,
      this.patient, this.location, this.selectedWorkFlowState).subscribe((enrollment) => {
        this.newErollment = enrollment;
        // 2. Save encounter
        this.patientReferralService.generateReferralEncounterPayload(programInfo)
          .subscribe((payload) => {
            if (payload) {
              _.extend(payload, {
                obs: [{
                  concept: this.enrollmentConcept,
                  value: enrollment.uuid
                }]
              });
              this.patientReferralService.saveReferralEncounter(payload)
                .subscribe((savedEncounter) => {
                  this.patientRefferalOnSuccess = true;
                  this.program.isReferring = false;
                  this.patientOnRefferal = false;
                  this.inputError = undefined;
                  this.refer = false;
                  this.onSuccess.emit(true);
                }, (error) => {
                  this.handleError(error);
                });
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
    let hasLocation = patientEnrolled && this.program.enrolledProgram.location;
    return !_.isNil(hasLocation) && hasLocation.uuid === this.location;
  }

  private handleError(err) {
    console.log(err);
  }
}
