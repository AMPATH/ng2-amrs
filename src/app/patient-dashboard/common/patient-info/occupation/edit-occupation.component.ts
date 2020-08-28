import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PatientService } from './../../../services/patient.service';
import { ConceptResourceService } from './../../../../openmrs-api/concept-resource.service';
import { PersonAttributeResourceService } from './../../../../openmrs-api/person-attribute-resource.service';
import { Patient } from './../../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-occupation',
  templateUrl: './edit-occupation.component.html',
  styleUrls: ['./edit-occupation.component.css'],
})
export class EditOccupationComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public subscription: Subscription;
  public display = false;
  public occupations: any;
  public occupation = [];
  public selectedOccupation = '';
  public occupationConceptUuid = 'a8a0a00e-1350-11df-a1f1-0026b9348838';
  public occupationAttributeTypeUuid = '9e86409f-9c20-42d0-aeb3-f29a4ca0a7a0';
  public concept: any;
  public saveMode = 'add';
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public successAlert = '';
  @Input() public patient: any;

  constructor(
    private patientService: PatientService,
    private conceptService: ConceptResourceService,
    private personAttributeService: PersonAttributeResourceService
  ) { }
  public ngOnInit(): void {
    this.getOccupatonConcept();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getOccupatonConcept() {
     this.conceptService.getConceptByUuid(this.occupationConceptUuid)
     .subscribe((concept: any) => {
       if (concept) {
           this.concept = concept;
           this.setOccupationOptions(concept.answers);
       }
     });

  }

  public setOccupationOptions(occupations) {
    this.occupations = occupations.map((occupation: any) => {
        return {
          'value': occupation.uuid,
          'label': occupation.display
        };
    });

  }

  public onSelectOccupation($event) {
   this.selectedOccupation = $event;
  }

  public showOccupationDialog(mode) {
    this.saveMode = mode;
    this.display = true;
  }

  public dismissDialog() {
    this.display = false;
  }
  public saveOccupation() {
     switch (this.saveMode) {
       case 'add':
         this.addOccupation();
         break;
       case 'edit':
         this.updateOccupation();
         break;
        default:
          return null;

     }

  }

  public addOccupation() {
    const payload = {
      'value': this.selectedOccupation,
      'attributeType': this.occupationAttributeTypeUuid
    };
    const patientUuid = this.patient.person.uuid;
    this.personAttributeService.createPersonAttribute(patientUuid, payload)
    .subscribe((result: any) => {
       this.displaySuccessAlert('Occupation successfully saved');
    }, (error: any) => {
       this.displayErrorAlert(error.error);
    });

  }

  public updateOccupation() {
    const payload = {
      'value': this.selectedOccupation,
      'attributeType': this.occupationAttributeTypeUuid
    };
    const patientUuid = this.patient.person.uuid;
    const occupationUuid = this.getCurrentOccupationUuid();
    this.personAttributeService.updatePersonAttribute(patientUuid, payload, occupationUuid)
    .subscribe((result) => {
       this.displaySuccessAlert('Occupation successfully Updated');
       this.patientService.fetchPatientByUuid(patientUuid);
    }, (error: any) => {
       this.displayErrorAlert(error.error);
    });

  }

  private getCurrentOccupationUuid() {
    let currentPersonOccupationUuid = '';
    const currentOccupation: any = this.patient.person.attributes.filter((attribute: any) => {
      return attribute.attributeType.uuid === this.occupationAttributeTypeUuid;
    });
    if (currentOccupation.length > 0) {
      if (currentOccupation[0].uuid) {
        currentPersonOccupationUuid = currentOccupation[0].uuid;
      }
    }
   return currentPersonOccupationUuid;

  }

  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.display = false;
    }, 1000);
  }

  private displayErrorAlert(message) {
    this.showErrorAlert = true;
    this.showSuccessAlert = false;
    this.successAlert = message;
    setTimeout(() => {
      this.showErrorAlert = false;
      this.display = false;
    }, 1000);
  }

}
