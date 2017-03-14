import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../patient.service';
import { OrderResourceService } from '../../openmrs-api/order-resource.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'lab-test-orders',
  templateUrl: './lab-test-orders.html',
  styleUrls: []
})
export class LabTestOrdersComponent implements OnInit, OnDestroy {
  patient: any;
  labOrders = [];
  error: string;
  page: number = 1;
  fetchingResults: boolean;
  isBusy: boolean;
  subscription: Subscription;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
              private patientService: PatientService,
              private orderResourceService: OrderResourceService) {
  }

  ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Lab Orders Loaded', 'ngOnInit');
    this.getCurrentlyLoadedPatient();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.getPatientLabOrders();
        }
      }
    );
  }
  getPatientLabOrders() {
    this.fetchingResults = true;
    this.isBusy = true;
    let patientUuId = this.patient.uuid;
    this.orderResourceService.getOrdersByPatientUuid(patientUuId)
      .subscribe((result) => {
        this.labOrders = result.results;
        this.labOrders.sort( (a, b) => {
          let key1 = a.dateActivated;
          let key2 = b.dateActivated;
          if (key1 > key2) {
            return -1;
          } else if (key1 === key2) {
            return 0;
          } else {
            return 1;
          }
        });
        this.fetchingResults = false;
        this.isBusy = false;
      }, (err) => {
        this.error = err;
        console.log('error', this.error);
      });
  }
}
