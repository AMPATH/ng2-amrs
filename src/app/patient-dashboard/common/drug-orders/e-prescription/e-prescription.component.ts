import { DrugOrderService } from './../drug-order.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-e-prescription',
  templateUrl: './e-prescription.component.html',
  styleUrls: ['./e-prescription.component.css']
})
export class EPrescriptionComponent implements OnInit {
  drugList: any[] = [];
  frequencyList: any[] = [];
  routesList: any[] = [];
  durationUnits: any[] = [];

  selectedDrug: string;
  slUuid = '';
  selectedFrequency = 'ONCE A DAY';
  sfUuid = 'bc1369f2-6795-11e7-843e-a0d3c1fcd41c';
  selectedRoute = 'ORAL';
  srUuid = 'db0c5937-3874-4eae-9566-9a645ad7ac65';
  selectedDuration = 'HOURS';
  sdUuid = 'a899b9c4-1350-11df-a1f1-0026b9348838';
  drugConcept = 'a899b9c4-1350-11df-a1f1-0026b9348838';
  drugDuration = '';

  displayedColumns = ['position', 'name'];
  dataSource = [];

  requestPayload: any;

  constructor(private drugOrderService: DrugOrderService) {}

  ngOnInit() {
    this.drugOrderService.getActiveDrugs().subscribe((res) => {
      this.drugList = res;
    });

    this.drugOrderService.getDrugFrequency().subscribe((res) => {
      this.frequencyList = res.results;
    });

    this.drugOrderService.getDrugRoutes().subscribe((res) => {
      this.routesList = res.answers;
      console.log('routesList ', this.routesList);
    });

    this.drugOrderService.getDurationUnits().subscribe((res) => {
      this.durationUnits = res.answers;
    });
  }

  public onDrugChange(value) {
    this.selectedDrug = value.drug_name;
    this.slUuid = value.drug_uuid;
    this.drugConcept = value.concept;
  }

  public onFrequencyChange(value) {
    this.selectedFrequency = value.display;
    this.sfUuid = value.uuid;
  }

  public onDurationChange(value) {
    this.drugDuration = value;
  }

  public onDurationUnitChange(value) {
    this.selectedDuration = value.display;
    this.sdUuid = value.uuid;
  }

  public onRouteChange(value) {
    this.selectedRoute = value.display;
    this.srUuid = value.uuid;
  }

  public addDrug() {
    const prescriptionStatement: ISelectedDrug = {
      position: this.dataSource.length + 1,
      name: `${this.selectedDrug} - ${this.selectedFrequency}  - ${this.drugDuration} ${this.selectedDuration} - ${this.selectedRoute}`,
      uuid: this.slUuid
    };

    this.dataSource.push(prescriptionStatement);
    this.resetValues();
  }

  public postDrugRequest() {
    const drugOrders = [];
    this.dataSource.forEach((e) => {
      drugOrders.push({
        drug_name: this.selectedDrug,
        uuid: this.drugConcept,
        display: this.selectedDrug,
        dose: 20,
        doseUnits: 'a8a07f8e-1350-11df-a1f1-0026b9348838',
        route: this.srUuid,
        frequency: this.sfUuid,
        quantity: 30,
        duration: this.drugDuration,
        durationUnits: this.sdUuid,
        numRefills: 1,
        quantityUnits: 'a8a07f8e-1350-11df-a1f1-0026b9348838',
        instructions: 'Take 20 minutes after meal',
        drug: this.slUuid
      });
    });
    return drugOrders;
  }

  public drugPayload() {
    const drugOrders = this.postDrugRequest();
    this.requestPayload = {
      encounter: '14f8ca24-148b-4094-80d0-6723bd42b9d8',
      patient: '80ed1b8e-0437-4d22-9d0c-ef5b93b1b5d8',
      type: 'drugorder',
      dateActivated: '2021-10-27T13:00:22.000+0300',
      careSetting: 'INPATIENT',
      action: 'new',
      urgency: 'ROUTINE',
      drugOrders
    };

    this.drugOrderService
      .postPrescription(this.requestPayload)
      .subscribe((res) => {
        console.log('RESPONSE ', res);
      });
  }

  public removeItem(target) {
    this.dataSource = this.deleteItem(this.dataSource, target.uuid);
  }

  public deleteItem(arr, value) {
    return arr.filter(function (d) {
      return d.uuid !== value;
    });
  }

  public resetValues() {
    this.selectedFrequency = 'ONCE A DAY';
    this.selectedRoute = 'ORAL';
    this.selectedDuration = 'HOURS';
    this.drugDuration = '';
  }
}

export interface ISelectedDrug {
  name: string;
  position: number;
  uuid: string;
}
