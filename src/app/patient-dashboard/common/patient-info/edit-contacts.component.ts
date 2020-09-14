import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import * as _ from 'lodash';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { Subscription } from 'rxjs';
import { PatientRelationshipTypeService } from '../patient-relationships/patient-relation-type.service';

@Component({
  selector: 'edit-contacts-info',
  templateUrl: './edit-contacts.component.html',
  styleUrls: []
})
export class EditContactsComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public display = false;
  public patientPhoneNumber: number;
  public alternativePhoneNumber: number;
  public patnerPhoneNumber: number;
  public nextofkinPhoneNumber: number;
  public careGivername: string;
  public relationshipToCareGiver: string;
  public careGiverPhoneNumber: number;
  public errors: any = [];
  public subscription: Subscription;
  public r1 = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))/;
  public r2 = /(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
  public pattern = new RegExp(this.r1.source + this.r2.source);
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;
  public patientRelationshipTypes: any = [];
  public selectedRelationshipType: any;
  public successAlert = '';

  constructor(private patientService: PatientService,
    private personResourceService: PersonResourceService,
    private patientRelationshipTypeService: PatientRelationshipTypeService) {
  }
  public ngOnInit() {
    this.getPatient();
    this.getRelationShipTypes();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public showDialog() {
    this.display = true;
  }
  public dismissDialog() {
    this.display = false;
  }
  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patnerPhoneNumber = this.patient.person.patnerPhoneNumber;
          this.patientPhoneNumber = this.patient.person.patientPhoneNumber;
          this.alternativePhoneNumber =
            this.patient.person.alternativePhoneNumber;
          this.nextofkinPhoneNumber = this.patient.person.nextofkinPhoneNumber;
          this.careGivername = this.patient.person.caregiverName;
          this.relationshipToCareGiver = this.patient.person.relationshipToCaregiver;
          this.careGiverPhoneNumber = this.patient.person.caregiverPhoneNumber;
        }
      }
    );
  }
  public saveAttribute() {
    const person = {
      uuid: this.patient.person.uuid
    };
    const personAttributePayload = {
      attributes: [{
        value: this.patientPhoneNumber,
        attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
      }, {
        value: this.alternativePhoneNumber,
        attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
      }, {
        value: this.nextofkinPhoneNumber,
        attributeType: 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d'
      }, {
        value: this.patnerPhoneNumber,
        attributeType: 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46'
      },
      {
        value: this.careGivername,
        attributeType: '48876f06-7493-416e-855d-8413d894ea93'
      },
      {
        value: this.relationshipToCareGiver,
        attributeType: '06b0da36-e133-4be6-aec0-31e7ed0e1ac2'
      },
      {
        value: this.careGiverPhoneNumber,
        attributeType: 'bb8684a5-ac0b-4c2c-b9a5-1203e99952c2'
      }]
    };
    const payLoad = this.generatePersonAttributePayload(personAttributePayload,
      this.patient.person.attributes);

    personAttributePayload.attributes = payLoad;
    this.filterUndefinedUuidFromPayLoad(personAttributePayload.attributes);
    this.personResourceService.saveUpdatePerson(person.uuid, personAttributePayload).subscribe(
      (success) => {
        if (success) {
          this.displaySuccessAlert('Contact saved successfully');
          this.patientService.reloadCurrentPatient();
        }

      },
      (error) => {
        console.error('error', error);
        this.errors.push({
          id: 'patient',
          message: 'error updating contacts'
        });
      }
    );
    setTimeout(() => {
      this.display = false;
    }, 1000);

  }
  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }

  private getPersonAttributeByAttributeTypeUuid(attributes, attributeType) {
    // let attributes = this.patient.person.attributes;
    const attrs = _.filter(attributes,
      (attribute: any) => {
        if (attribute.attributeType.uuid === attributeType) {
          return true;
        } else {
          return false;
        }

      });
    return attrs[0];
  }
  private filterUndefinedUuidFromPayLoad(personAttributePayload) {
    if (personAttributePayload && personAttributePayload.length > 0) {
      for (let i = 0; i < personAttributePayload.length; i++) {
        if (personAttributePayload[i].uuid === undefined &&
          personAttributePayload[i].voided === true) {
          personAttributePayload.splice(i, 1);
          i--;
        }
      }
    }
  }
  private generatePersonAttributePayload(personAttributePayload, existingAttributes) {
    const payLoad = [];
    const attributes = personAttributePayload.attributes;
    for (const a in attributes) {

      if (attributes.hasOwnProperty(a)) {
        let attr;
        if (attributes[a] !== undefined && attributes[a] !== 'undefined') {
          attr = this.getPersonAttributeByAttributeTypeUuid(existingAttributes,
            attributes[a].attributeType);
          if (attr === undefined) {
            attr = _.filter(attr, (attribute) => {
              return attribute !== undefined && attribute !== null;
            });

          }

          if (attr && attributes[a].value === null || attributes[a].value.toString() === '') {
            payLoad.push({ uuid: attr.uuid, voided: true });
          } else {
            payLoad.push({
              attributeType: attributes[a].attributeType,
              value: attributes[a].value
            });
          }

        }

      }
    }
    return payLoad;
  }

  public getRelationShipTypes(): void {
    const request = this.patientRelationshipTypeService.getRelationshipTypes();
    request.subscribe((relationshipTypes) => {
        if (relationshipTypes) {
            this.patientRelationshipTypes = relationshipTypes;
        }
    }, (error) => {
        console.error('Failed to get relation types because of the following ', error);
    });
}

}
