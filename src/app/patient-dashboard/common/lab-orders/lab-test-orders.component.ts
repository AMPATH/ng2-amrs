import { Component, OnInit, OnDestroy } from '@angular/core';

import * as Moment from 'moment';
import * as _ from 'lodash';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../../services/patient.service';
import { OrderResourceService } from '../../../openmrs-api/order-resource.service';
import { LabelService } from './labels/label-service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'lab-test-orders',
  templateUrl: './lab-test-orders.html',
  styleUrls: [],
  providers: [LabelService]
})
export class LabTestOrdersComponent implements OnInit, OnDestroy {
  public patient: any;
  public labOrders = [];
  public error: string;
  public page: number = 1;
  public fetchingResults: boolean;
  public isBusy: boolean;
  public subscription: Subscription;
  public displayDialog: boolean = false;
  public currentOrder: any;
  public allItemsSelected = false;
  public copies = 2;
  public patientIdentifer: any;
  public isPrinting = false;
  public collectionDate = new Date();

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService,
    private orderResourceService: OrderResourceService,
    private labelService: LabelService) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Lab Orders Loaded', 'ngOnInit');
    this.getCurrentlyLoadedPatient();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          let amrsId = _.find(this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (identifer.identifierType.uuid === '58a4732e-1359-11df-a1f1-0026b9348838') {
                return true;
              }
            });
          if (amrsId) {
            this.patientIdentifer = amrsId.identifier;
          }
          this.getPatientLabOrders();
        }
      }
    );
  }

  public getPatientLabOrders() {
    this.fetchingResults = true;
    this.isBusy = true;
    let patientUuId = this.patient.uuid;
    this.orderResourceService.getOrdersByPatientUuid(patientUuId)
      .subscribe((result) => {
        this.labOrders = result.results;
        this.labOrders.sort((a, b) => {
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
        console.error('error', this.error);
      });
  }

  public postOrderToEid(order: any) {
    this.currentOrder = null;
    this.displayDialog = true;
    this.currentOrder = order;
  }

  public handleResetEvent(event) {
    this.displayDialog = false;
    this.currentOrder = null;
  }
  public collectionDateChanged(event) {
  }

  public printLabel(order) {
    this.labelService.directPrint(this.getLabel(order), this.copies);
  }

  private generateLabLabels() {
    let labels = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.labOrders.length; i++) {
      let order = this.labOrders[i];
      if (order.isChecked) {
        for (let c = 0; c < this.copies; c++) {
          let label = this.getLabel(order);
          labels.push(label);
        }
      }
    }
    this.printLabels(labels);
  }


  private printLabels(labels) {
    // this.isPrinting = true;
    // this.labelService.generateBarcodes(labels)
    //   .subscribe((blobUrl) => {
    //     this.isPrinting = false;
    //     // window.open(blobUrl);
    //   });
  }

  private selectAll() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.labOrders.length; i++) {
      this.labOrders[i].isChecked = this.allItemsSelected;
    }
  }

  private selectOrder() {
    // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
    for (let labOrder of this.labOrders) {
      if (labOrder.isChecked) {
        this.allItemsSelected = false;
        return;
      }
    }

    // If not the check the "allItemsSelected" checkbox
    this.allItemsSelected = true;
  }

  private getLabel(order) {
    return {
      orderDate: Moment(order.dateActivated).format('DD-MM-YYYY'),
      testName: order.display,
      identifier: this.patientIdentifer,
      orderNumber: order.orderNumber
    };
  }
  private generateLabLabel(order) {
    let labels = [];
    for (let c = 0; c < this.copies; c++) {
      let label = this.getLabel(order);
      labels.push(label);
    }
    this.printLabels(labels);
  }
}
