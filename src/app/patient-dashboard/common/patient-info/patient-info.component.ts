import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../../services/patient.service';

import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit, OnDestroy {
  @ViewChild('hieVerificationModal') public hieVerificationModal: BsModalRef;
  public patient: Patient;
  public subs: Subscription[] = [];
  public display = false;
  showOtpVericationDialog = false;
  showHieVerificationModal: any;
  showHieModal = false;
  hieVerificationModalRef: BsModalRef;
  public source = 'patient-info';

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService,
    private modalService: BsModalService
  ) {}

  public ngOnInit() {
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
        }
      }
    );
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Patient Info Loaded',
      'ngOnInit'
    );
    this.subs.push(patientSub);
  }

  public ngOnDestroy(): void {
    if (this.subs.length) {
      this.subs.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    }
  }
  showHieOtpDialog() {
    this.showOtpVericationDialog = true;
  }
  hideHieOtpDialog() {
    this.showOtpVericationDialog = false;
  }
  showHeVerificationiDialog() {
    if (!this.showHieVerificationModal) {
      this.showHieModal = true;
      this.hieVerificationModalRef = this.modalService.show(
        this.hieVerificationModal,
        {
          backdrop: 'static',
          keyboard: false
        }
      );
    }
  }
  hideHieDialog() {
    this.showHieModal = false;
    this.hieVerificationModalRef.hide();
  }
}
