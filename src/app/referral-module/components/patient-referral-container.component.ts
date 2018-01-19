import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { Form } from 'ng2-openmrs-formentry';

@Component({
  selector: 'patient-referral-container',
  templateUrl: './patient-referral-container.component.html'
})
export class PatientReferralContainerComponent implements OnInit {
  @Input() public programs: string[];
  @Input() public patient: Patient = null;
  @Input() public form: Form;
  @Output() public onAborting: EventEmitter<any> = new EventEmitter();
  @Output() public onSuccess: EventEmitter<boolean> = new EventEmitter();
  constructor() {
  }

  public ngOnInit() {

  }

  public referPatient() {
    setTimeout(() => {
      this.onSuccess.emit(true);
    }, 3000);
  }

  public cancelReferral() {
    this.onAborting.emit(true);
  }
}
