import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as Moment from 'moment';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import { PatientCareStatusResourceService }
  from '../../etl-api/patient-care-status-resource.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'patient-banner',
  templateUrl: 'patient-banner.component.html',
  styleUrls: ['patient-banner.component.css'],
  providers: [PatientCareStatusResourceService]
})

export class PatientBannerComponent implements OnInit, OnDestroy {

  patient: Patient = new Patient({});
  searchIdentifiers: Object;
  birthdate;
  careStatus: string;
  loadingHistory = true;
  careStatusHistory = [];
  error = false;
  subscription: Subscription;
  historySubscription: Subscription;
  careStatusSubscription: Subscription;
  @ViewChild('modal')
  modal: ModalComponent;

  constructor(private patientService: PatientService,
    private patientCareStatusResourceService: PatientCareStatusResourceService) { }

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.searchIdentifiers = patient.searchIdentifiers;
          this.birthdate = Moment(patient.person.birthdate).format('l');
          this.getCurrentCareStus(patient);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.resetSubscriptions();
  }
  resetSubscriptions() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.careStatusSubscription) {
      this.careStatusSubscription.unsubscribe();
    }
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
    }
  }
  getCurrentCareStus(patient) {
    this.careStatusSubscription = this.patientCareStatusResourceService
      .getDailyPatientCareStatus({
        patient_uuid: patient.uuid,
        referenceDate: Moment().format('YYYY-MM-DD')
      }).subscribe((result) => {
        if (result.result && result.result.length > 0) {
          this.careStatus = result.result[0].patient_daily_care_status;
        }
      }, (error) => {
        this.error = true;
      });
  }
  getCareStatusHistory() {
    if (this.patient) {
      this.modal.open();
      let endDate = Moment().format('YYYY-MM-DD');
      let startDate = Moment().subtract(12, 'months').format('YYYY-MM-DD');
      this.loadingHistory = true;
      this.historySubscription = this.patientCareStatusResourceService.getMonthlyPatientCareStatus({
        startDate: startDate,
        endDate: endDate, patient_uuid: this.patient.uuid
      }).subscribe((result) => {
        console.log('Result', result);
        this.loadingHistory = false;
        this.careStatusHistory = result.result;
      }, (error) => {
        this.loadingHistory = false;
        this.error = true;
      });
    }
  }
}

