import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import * as _ from 'lodash';
import queue from 'async/queue';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';

import { Subject } from 'rxjs/Subject';
import { Patient } from '../../models/patient.model';
import { PatientReferralService } from '../../referral-module/services/patient-referral-service';

@Component({
  selector: 'program-enrollment',
  templateUrl: './program-enrollment.component.html',
  styles: [`
    .dropdown-menu:before {
      left: 9px;
      right: auto;
      border-right: 7px solid transparent;
      border-bottom: 7px solid #fff;
      border-left: 7px solid transparent;
      border-bottom-color: #fff;
    }
    .dropdown-menu:after {
      display: none;
    }

  `]
})
export class ProgramEnrollmentComponent implements OnInit {
  @Output() public onManageProgram: EventEmitter<any> = new EventEmitter();
  @Input() public onReloadPrograms: Subject<boolean>;
  public loadingPatientPrograms: boolean = false;
  public enrolledPrograms: ProgramEnrollment[];
  private patient: Patient;
  constructor(private patientService: PatientService,
              private patientReferralService: PatientReferralService,
              private userDefaultPropertiesService: UserDefaultPropertiesService) {}

  public ngOnInit() {
    this._init();
  }

  public updateState(enrolledProgram: any, state: any) {
    this.onManageProgram.emit({
      program: enrolledProgram,
      actionState: state
    });
  }

  public hasActiveWorkflows(row) {
    let activeWorkflow = _.filter(row.program.openmrsModel.allWorkflows,
      (w) => !w.retired );
    if (activeWorkflow.length > 0) {
      row.program.openmrsModel.allWorkflows = activeWorkflow;
      return true;
    }
    return false;
  }

  private _init() {
    this.onReloadPrograms.subscribe((reload) => {
      if (reload) {
        this.patientService.fetchPatientByUuid(this.patient.uuid);
      }
    });
    this.loadingPatientPrograms = true;
    this.patientService.currentlyLoadedPatient.subscribe((patient) => {
        if (patient) {
          this.patient = patient;
          this.enrolledPrograms = _.filter(patient.enrolledPrograms, 'isEnrolled');

          let q = queue((row, callback) => {
            if (this.hasActiveWorkflows(row)) {
                _.extend(row, {hasWorkflows : true});
                this.patientReferralService.getReferredByLocation(row.enrolledProgram.uuid)
                  .subscribe((reply) => {
                    if (reply) {
                      _.extend(row, {programWasReferred : true});
                      this._filterState(row, callback);
                    }
                  }, (error) => {
                    _.extend(row, {programWasReferred : false});
                    this._filterState(row, callback);
                  });
            } else {
              _.extend(row, {programWasReferred : false, hasWorkflows : false});
              callback();
            }
          }, 2);

          q.drain = () => {
            this.loadingPatientPrograms = false;
          };
          q.push(this.enrolledPrograms, (err) => {});

        }
      }
    );
  }

  private _programEnrolledInCurrentLocation(program) {
    let currentLocation = (this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject())
      .uuid;
    let programLocation = program.location.uuid;

    return currentLocation === programLocation;
  }

  private _filterState(row: any, callback: () => void) {
    let states = row.program.openmrsModel.allWorkflows[0].states;
    _.each(states, (patientState) => {
      let visible: boolean = true;
      let rowState: any = _.first(_.filter(row.enrolledProgram.states, (_activeState) => {
        return _.isNull(_activeState.endDate);
      }));
      // active state should not be visible
      if (rowState && (patientState.concept.uuid === rowState.state.concept.uuid)) {
        visible = false;
      }
      // only switch if enrolled in provider location
      if (!this._programEnrolledInCurrentLocation(row.enrolledProgram)
        && (patientState.concept.uuid === 'eee00e63-a565-4f60-9fae-416abd8a6d3c' ||
          patientState.concept.uuid === '5520f234-258e-49f0-97ab-701b98fab608')) {
        visible = false;
      }
      // only refer out or back if the patient is in care in the provider location and is a refer
      if (!(rowState && rowState.state.concept.uuid === '72443cac-4822-4dce-8460-794af7af8167' &&
          row.programWasReferred && this._programEnrolledInCurrentLocation(row.enrolledProgram))
        && (patientState.concept.uuid === '15977097-13b7-4186-80a7-a78535f27866' ||
          patientState.concept.uuid === '24a2769a-296b-44bc-b50c-70089e0958db')) {

        visible = false;
      }

      // refer should not be visible
      if (patientState.concept.uuid === '0c5565c5-45cf-40ab-aa6d-5694aeabae18') {
        visible = false;
      }
      // you can only put the patient into care from a refer state in the provider location
      if ((rowState && !this._programEnrolledInCurrentLocation(row.enrolledProgram)
          && patientState.concept.uuid === '72443cac-4822-4dce-8460-794af7af8167' &&
          rowState.state.concept.uuid === '0c5565c5-45cf-40ab-aa6d-5694aeabae18') ||
        (rowState && this._programEnrolledInCurrentLocation(row.enrolledProgram)
          && patientState.concept.uuid === '72443cac-4822-4dce-8460-794af7af8167' &&
          rowState.state.concept.uuid !== '0c5565c5-45cf-40ab-aa6d-5694aeabae18')) {
        visible = false;
      }

      // only put in care from pending transfer if enrolled in same location
      if (rowState && this._programEnrolledInCurrentLocation(row.enrolledProgram)
        && patientState.concept.uuid === '72443cac-4822-4dce-8460-794af7af8167' &&
        rowState.state.concept.uuid === '3f16fc88-d7b7-4a6d-bd3e-6e9b43bf2f51') {
        visible = true;
      }

      _.extend(patientState, {visible: visible});
      // return visible;
    });
    callback();
  }

}
