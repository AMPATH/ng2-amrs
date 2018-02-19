import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';

import { Form } from 'ng2-openmrs-formentry';

import { Patient } from '../../../models/patient.model';
import * as _ from 'lodash';

@Component({
  selector: 'patient-referral-container',
  templateUrl: './patient-referral-container.component.html'
})
export class PatientReferralContainerComponent implements OnInit {
  @Input() public programs;
  @Input() public submittedEncounter: any;
  @Input() public location: string;
  @Input() public form: Form;
  @Input() public patient: Patient;
  @Output() public onAborting: EventEmitter<any> = new EventEmitter();
  @Output() public onSuccess: EventEmitter<boolean> = new EventEmitter();
  public loadingPatientPrograms: boolean = false;
  public programsForReferral: any[] = [];
  public refer: boolean;
  public referralAborting: boolean = false;
  public abortedReferrals: number = 0;
  public successfulReferrals: number = 0;
  constructor() {

  }

  public ngOnInit() {
    this._init();
  }

  public referPatient() {
    this.refer = true;
  }

  public closeReferralDialog() {
    this.refer = false;
    // close dialog on demand(at least one program has been referred)
    this.onSuccess.emit(true);
  }

  public cancelReferral() {
    this.refer = false;
    this.onAborting.emit(true);
  }

  public patientReferralSuccess() {
    this.successfulReferrals++;
    // autoclose dialog if all programs have been referred. disabled for now
    if (this.successfulReferrals === this.programs.length) {
      // this.onSuccess.emit(true);
    }
  }

  public patientReferralAborted(program: any) {
    this.refer = false;
    this.referralAborting = true;
    this.abortedReferrals++;
  }

  private _init() {
    this.programsForReferral = _.map(this.programs, (program: any) => {
      return _.extend(program, {isReferring : false});
    });
  }
}
