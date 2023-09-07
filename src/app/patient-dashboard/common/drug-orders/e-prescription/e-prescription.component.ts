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

    const DrugConcepts = [
      {
        drug_name: 'TDF 300mg/3TC 300mg/DTG 50mg',
        concept: 'b71e5ea4-2f34-4315-996a-4474711deead',
        drug_uuid: '18e86e1f-92b8-40cd-8266-0df0ab0a4a50',
        drug_code: '3TC + TDF + DTG'
      },
      {
        drug_name: 'TDF 300mg/3TC 300mg/EFV 400mg',
        concept: 'b7735b8a-22f2-41d6-b450-65ec7588839c',
        drug_uuid: 'b58a28d2-36de-11e0-93be-0026b9348838',
        drug_code: 'ABC + 3TC'
      },
      {
        drug_name: '3TC 150mg /ZDV 300mg',
        concept: 'b7735b8a-22f2-41d6-b450-65ec7588839c',
        drug_uuid: 'e4ef489e-0ff1-4876-aab6-0d198cadb6b1',
        drug_code: 'ABC + 3TC'
      },
      {
        drug_name: '3TC 300mg /TDF 300mg',
        concept: 'b7735b8a-22f2-41d6-b450-65ec7588839c',
        drug_uuid: 'e78843da-fdb6-446d-8e99-873c278b3540',
        drug_code: 'ABC + 3TC'
      },
      {
        drug_name: 'ABC 600mg/3TC 300mg',
        concept: '1c4a75d0-cc91-4752-b0a5-4b833326ff7a',
        drug_uuid: 'ea501f4e-cbc5-4942-b9c8-0ac415929f08',
        drug_code: 'TDF + 3TC + EFV'
      },
      {
        drug_name: 'Efavirenz 200 mg',
        concept: 'a896758e-1350-11df-a1f1-0026b9348838',
        drug_uuid: '25c753d8-870f-11e0-85d3-000d6014b64c',
        drug_code: 'ZDV + 3TC'
      },
      {
        drug_name: 'Abacavir 300mg ',
        concept: '6a73f32d-1870-4527-af6e-74443251ded2',
        drug_uuid: '20185c04-9334-11df-8193-000d6014b64c',
        drug_code: 'ZDV + 3TC + NVP'
      },
      {
        drug_name: 'Lamivudine 150mg ',
        concept: '6a73f32d-1870-4527-af6e-74443251ded2',
        drug_uuid: '8ddf2f66-9333-11df-8193-000d6014b64c',
        drug_code: 'ZDV + 3TC + NVP'
      },
      {
        drug_name: 'Zidovudine 300mg ',
        concept: 'a896758e-1350-11df-a1f1-0026b9348838',
        drug_uuid: 'fd4cd670-3115-11e0-8090-0026b9348838',
        drug_code: '3TC + ZDV'
      },
      {
        drug_name: 'Lopinavir 200mg/Ritonavir 50mg) such as Aluvia',
        concept: 'a89cc876-1350-11df-a1f1-0026b9348838',
        drug_uuid: 'b9da84e8-3127-11e0-8090-0026b9348838',
        drug_code: '3TC + TDF',
        adt_drug_code: 'PRP1B, TDF + 3TC (PrEP)'
      },
      {
        drug_name: 'Atazanavir/Ritonavir 300/100mg',
        concept: '1c4a75d0-cc91-4752-b0a5-4b833326ff7a',
        drug_uuid: 'e0037172-87ce-11e0-85d3-000d6014b64c',
        drug_code: 'TDF + 3TC + EFV'
      },
      {
        drug_name: 'FTC 200mg /TDF 300mg  such as Truvada',
        concept: 'a897e7c0-1350-11df-a1f1-0026b9348838',
        drug_uuid: 'f8b6299e-6bbf-446a-b3f1-a88f5d6b9da2',
        drug_code: 'LPV + RIT'
      },
      {
        drug_name: 'Raltegravir400mg ',
        concept: 'a897e7c0-1350-11df-a1f1-0026b9348838',
        drug_uuid: 'ddefd319-fb5d-4c0e-a125-ff7bdb6fe44f',
        drug_code: 'LPV + RIT'
      },
      {
        drug_name: 'Darunavir 600mg',
        concept: 'a897e7c0-1350-11df-a1f1-0026b9348838',
        drug_uuid: 'LPV + RIT',
        drug_code: 'fa8266f6-36df-11e0-93be-0026b9348838'
      },
      {
        drug_name: 'Etravirine 100mg',
        concept: 'a897e7c0-1350-11df-a1f1-0026b9348838',
        drug_uuid: '3115e231-1077-4488-a7d5-83167263b9a2',
        drug_code: 'LPV + RIT'
      },
      {
        drug_name: 'Ritonavir 100mg',
        concept: 'a8afc066-1350-11df-a1f1-0026b9348838',
        drug_uuid: '3cbfb0b9-721e-4d42-92a3-7d37269aab24',
        drug_code: 'ATAZANAVIR/RITONAVIR'
      },
      {
        drug_name: 'Isoniazid',
        concept: 'a8afcf84-1350-11df-a1f1-0026b9348838',
        drug_uuid: '',
        drug_code: 'TRUVADA'
      },
      {
        drug_name: 'Septrin',
        concept: 'a8967656-1350-11df-a1f1-0026b9348838',
        drug_uuid: '2fc1f68c-9939-44d4-b5f4-e064ed4073ca',
        drug_code: 'NVP'
      },
      {
        drug_name: 'Dapsone 100 mg',
        concept: 'a8967656-1350-11df-a1f1-0026b9348838',
        drug_uuid: '0485075a-3111-11e0-8090-0026b9348838',
        drug_code: 'NVP'
      }
    ];

    this.drugList = DrugConcepts;

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
