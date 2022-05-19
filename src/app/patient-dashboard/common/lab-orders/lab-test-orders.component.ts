import { take } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";

import * as Moment from "moment";
import * as _ from "lodash";
import { AppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytics.service";
import { PatientService } from "../../services/patient.service";
import { OrderResourceService } from "../../../openmrs-api/order-resource.service";
import { LabelService } from "./labels/label-service";

import { Subscription } from "rxjs";
import { ClinicLabOrdersResourceService } from "../../../etl-api/clinic-lab-orders-resource.service";
import { ObsResourceService } from "../../../openmrs-api/obs-resource.service";
import { DatePipe } from "@angular/common";

interface IdentifierType {
  format: string;
  formatDescription: string;
  name: string;
  uuid: string;
  validator: string;
}

interface Identifier {
  identifier: string;
  identifierType: IdentifierType;
  preferred: boolean;
  uuid: string;
  display?: string;
}

@Component({
  selector: "lab-test-orders",
  templateUrl: "./lab-test-orders.html",
  styleUrls: [],
  providers: [LabelService],
})
export class LabTestOrdersComponent implements OnInit, OnDestroy {
  public patient: any;
  public labOrders = [];
  public labOrdersEtl = [];
  public error: string;
  public page = 1;
  public fetchingResults: boolean;
  public isBusy: boolean;
  public subscription: Subscription;
  public displayDialog = false;
  public currentOrder: any;
  public allItemsSelected = false;
  public copies = 2;
  public patientIdentifer: any;
  public isPrinting = false;
  public collectionDate = new Date();
  public labPatient: any;
  public labEncouonters: any;
  public sampleCollectedOptions = [
    { label: "Yes", val: "a899b35c-1350-11df-a1f1-0026b9348838" },
    { label: "No", val: "a899b42e-1350-11df-a1f1-0026b9348838" },
  ];
  public sampleCollected: any;
  public displaySampleDialog = false;
  public showErrorAlert = false;
  public showSuccessAlert = false;
  public successAlert = "";
  public errors: any = [];
  public orderUuid: string;
  public obsUuid: string;
  public displayConfirmDialog = false;
  public hideDateField = false;
  public disableButton = false;
  public maxDate = new Date();
  public heiIdentifierType = 'ead42a8f-203e-4b11-a942-df03a460d617';
  public cccIdentifierType = 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e';
  private _datePipe: DatePipe;

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService,
    private orderResourceService: OrderResourceService,
    private labelService: LabelService,
    private clinicLabOrdersResourceService: ClinicLabOrdersResourceService,
    private obsResourceService: ObsResourceService
  ) {
    this._datePipe = new DatePipe("en-US");
  }

  public ngOnInit() {
    this.appFeatureAnalytics.trackEvent(
      "Patient Dashboard",
      "Lab Orders Loaded",
      "ngOnInit"
    );
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
          const identifiers = this.patient.identifiers.openmrsModel
            ? this.patient.identifiers.openmrsModel
            : [];
          const hasCcc = this.hasIdentifierType(
            this.cccIdentifierType,
            identifiers
          );
          const hasHeiNo = this.hasIdentifierType(
            this.heiIdentifierType,
            identifiers
          );
          if (hasCcc && !hasHeiNo) {
            this.patientIdentifer = this.getIdentifierByTypeUuid(
              this.cccIdentifierType,
              identifiers
            ).identifier;
          }
          if (hasHeiNo && !hasCcc) {
            this.patientIdentifer = this.getIdentifierByTypeUuid(
              this.heiIdentifierType,
              identifiers
            ).identifier;
          }
          this.getLabOrdersByPatientUuid();
          this.getPatientLabOrders();
        }
      }
    );
  }

  public hasIdentifierType(
    identifierTypeUuid: string,
    identifiers: Identifier[]
  ): boolean {
    return identifiers.some((i: Identifier) => {
      return i.identifierType.uuid === identifierTypeUuid;
    });
  }

  public getIdentifierByTypeUuid(
    identifierTypeUuid: string,
    identifiers: Identifier[]
  ): Identifier {
    return identifiers.find((i: Identifier) => {
      return i.identifierType.uuid === identifierTypeUuid;
    });
  }

  public getPatientLabOrders() {
    this.fetchingResults = true;
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.orderResourceService
      .getOrdersByPatientUuid(patientUuId)
      .pipe(take(1))
      .subscribe(
        (result) => {
          console.log("result", result);
          // this.getCorrespingLabOrdersFromAmrs(result.results);
          this.labPatient = result.results[0].patient;
          this.labEncouonters = result.results;
          this.labOrders = result.results;

          this.labOrders.sort((a, b) => {
            const key1 = a.dateActivated;
            const key2 = b.dateActivated;
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
        },
        (err) => {
          this.error = err;
          console.error("error", this.error);
        }
      );
  }
  public getLabOrdersByPatientUuid() {
    this.fetchingResults = true;
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.clinicLabOrdersResourceService
      .getLabOrdersByPatientUuid(patientUuId)
      .pipe(take(1))
      .subscribe((result) => {
        this.labOrdersEtl = result;
        console.log("this.labOrdersEtl", this.labOrdersEtl);
        this.labOrdersEtl.sort((a, b) => {
          const key1 = a.date_activated;
          const key2 = b.date_activated;
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
      });
  }

  public postOrderToEid(order: any) {
    this.currentOrder = null;
    this.displayDialog = true;
    this.currentOrder = this.getCorrespingLabOrdersFromAmrs(
      this.labEncouonters,
      order.orderNumber
    );
    // this.currentOrder = order;
  }

  public handleResetEvent(event) {
    this.displayDialog = false;
    this.currentOrder = null;
  }
  public collectionDateChanged(event) {}

  public printLabel(order) {
    this.labelService.directPrint(this.getLabel(order), this.copies);
  }
  public collectedSample(order) {
    this.hideDateField = false;
    this.errors = [];
    if (order.sample_drawn === "YES") {
      this.sampleCollected = "a899b35c-1350-11df-a1f1-0026b9348838";
      this.collectionDate = this._datePipe.transform(
        order.sample_collection_date,
        "yyyy-MM-dd"
      ) as any;
      this.disableButton = false;
    }
    if (order.sample_drawn === "NO") {
      this.hideDateField = true;
      this.sampleCollected = "a899b42e-1350-11df-a1f1-0026b9348838";
      this.disableButton = false;
    }
    if (
      order.sample_drawn === null ||
      order.sample_drawn === "null" ||
      this.sampleCollected === ""
    ) {
      this.sampleCollected = " ";
      this.disableButton = true;
      this.maxDate = this._datePipe.transform(new Date(), "yyyy-MM-dd") as any;
      this.collectionDate = "" as any;
    }

    this.orderUuid = order.uuid;
    this.obsUuid = order.obs_uuid;

    this.displaySampleDialog = true;
  }
  public dismissSampleDialog() {
    this.displayConfirmDialog = true;
  }
  public saveSampleCollectedObs() {
    if (this.sampleCollected === " ") {
      const clone = { sampleMessage: "Sample collected is required" };
      this.errors.push(clone);
      this.errors = this.errors[0];
      console.log("this.errors", this.errors);
      return;
    }
    if (this.collectionDate === ("" as any)) {
      const clone = { message: "Date sample collected is required" };
      this.errors.push(clone);
      this.errors = this.errors[0];
      return;
    }
    const patientUuId = this.patient.uuid;
    const obsPayload = {
      person: patientUuId,
      order: this.orderUuid,
      concept: "dfcdcaf9-5317-4651-9846-9b4fd9334fb9",
      value: this.sampleCollected,
      obsDatetime: this.toDateString(this.collectionDate),
    };
    if (this.obsUuid !== null) {
      this.obsResourceService
        .voidObs(this.obsUuid)
        .pipe(take(1))
        .subscribe(
          (success) => {
            if (success) {
              this.displaySuccessAlert("saved successfully");
              this.getCurrentlyLoadedPatient();
              this.getLabOrdersByPatientUuid();
              setTimeout(() => {
                this.displaySampleDialog = false;
              }, 1000);
            }
          },
          (error) => {
            console.error("error", error);
            this.errors.push({
              id: "patient",
              message: "error posting obs",
            });
            this.displaySampleDialog = true;
          }
        );
    }

    this.obsResourceService
      .saveObs(obsPayload)
      .pipe(take(1))
      .subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert("saved successfully");
            this.getCurrentlyLoadedPatient();
            this.getLabOrdersByPatientUuid();
            setTimeout(() => {
              this.displaySampleDialog = false;
            }, 1000);
          }
        },
        (error) => {
          console.error("error", error);
          this.errors.push({
            id: "patient",
            message: "error posting obs",
          });
          this.displaySampleDialog = true;
        }
      );
  }
  public onSampleSelectedChange(selected) {
    this.errors = [];

    if (selected.target.value === "a899b42e-1350-11df-a1f1-0026b9348838") {
      this.collectionDate = this._datePipe.transform(
        new Date(),
        "yyyy-MM-dd"
      ) as any;
      this.hideDateField = true;
      this.disableButton = false;
      this.errors = [];
    }
    if (selected.target.value === "a899b35c-1350-11df-a1f1-0026b9348838") {
      this.hideDateField = false;
      this.disableButton = false;
      this.errors = [];
    }
    if (this.sampleCollected !== "" && this.collectionDate === ("" as any)) {
      this.disableButton = true;
    }
  }
  public onDateSelectedChange(event) {
    this.errors = [];
    this.disableButton = false;
    if (this.collectionDate !== ("" as any)) {
      this.disableButton = false;
    }
    if (this.sampleCollected === "a899b42e-1350-11df-a1f1-0026b9348838") {
      this.disableButton = false;
    }
    if (this.collectionDate !== ("" as any) && this.sampleCollected === "") {
      this.disableButton = true;
    }
  }
  public closeConfirmationDialog() {
    this.displayConfirmDialog = false;
  }
  public clearSampleCollectedList() {
    this.sampleCollected = "";
    this.collectionDate = "" as any;
    this.errors = [];
    this.displayConfirmDialog = false;
    this.displaySampleDialog = false;
  }
  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }

  private generateLabLabels() {
    const labels = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.labOrders.length; i++) {
      const order = this.labOrders[i];
      if (order.isChecked) {
        for (let c = 0; c < this.copies; c++) {
          const label = this.getLabel(order);
          labels.push(label);
        }
      }
    }
    this.printLabels(labels);
  }

  private printLabels(labels) {
    // this.isPrinting = true;
    // this.labelService.generateBarcodes(labels)
    //   .take(1).subscribe((blobUrl) => {
    //     this.isPrinting = false;
    //     // window.open(blobUrl);
    //   });
  }

  private getCorrespingLabOrdersFromAmrs(result, uuid) {
    for (let i = 0; i < result.length; i++) {
      if (result[i].orderNumber === uuid) {
        this.currentOrder = null;
        this.displayDialog = true;
        this.currentOrder = result[i];
      }
    }
    return this.currentOrder;
  }

  private selectAll() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.labOrders.length; i++) {
      this.labOrders[i].isChecked = this.allItemsSelected;
    }
  }

  private selectOrder() {
    // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
    for (const labOrder of this.labOrders) {
      if (labOrder.isChecked) {
        this.allItemsSelected = false;
        return;
      }
    }

    // If not the check the "allItemsSelected" checkbox
    this.allItemsSelected = true;
  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset("+03:00").format();
  }

  private getLabel(order) {
    return {
      orderDate: Moment(order.dateActivated).format("DD-MM-YYYY"),
      testName: order.display,
      identifier: this.patientIdentifer,
      orderNumber: order.orderNumber,
    };
  }
  private generateLabLabel(order) {
    const labels = [];
    for (let c = 0; c < this.copies; c++) {
      const label = this.getLabel(order);
      labels.push(label);
    }
    this.printLabels(labels);
  }
}
