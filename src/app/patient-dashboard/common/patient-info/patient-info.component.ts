import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../../services/patient.service';
import { HieOtpClientConsentService } from '../../../otp-verification/hie-otp-verification/patient-otp-verification.service';
import { Patient } from '../../../models/patient.model';
import { Subject, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil, tap } from 'rxjs/operators';
import { ValidateHieCustomOtpResponse } from 'src/app/models/hie-registry.model';

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
  private destroy$ = new Subject<boolean>();
  validateOtpResponse: ValidateHieCustomOtpResponse;

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService,
    private modalService: BsModalService,
    private hieOtpClientConsentService: HieOtpClientConsentService
  ) {}

  public ngOnInit() {
    this.listenToHieOtpConsentChanges();
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
    this.destroy$.next(true);
    this.destroy$.complete();
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
  listenToHieOtpConsentChanges() {
    this.hieOtpClientConsentService.otpValidation$
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (
            res &&
            res.data &&
            res.data.status === 'valid' &&
            res.source === this.source
          ) {
            this.validateOtpResponse = res;
            this.showHeVerificationiDialog();
          }
        })
      )
      .subscribe();
  }
}
