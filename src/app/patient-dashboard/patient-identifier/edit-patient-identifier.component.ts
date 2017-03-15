import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import * as _ from 'lodash';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { PatientIdentifierService } from './patient-identifiers.service';
import {
  PatientIdentifierTypeResService
} from'../../openmrs-api/patient-identifierTypes-resource.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Subscription } from 'rxjs';





@Component({
  selector: 'edit-identifiers',
  templateUrl: 'edit-patient-identifier.component.html',
  styleUrls: [],
})
export class EditPatientIdentifierComponent implements OnInit, OnDestroy {
  patients: Patient = new Patient({});
  subscription: Subscription;
  public errorMessage: string = '';
  public hasError: boolean = false;
  private display: boolean = false;
  private patientIdentifier: string = '';
  private preferredIdentifier: string = '';
  private identifierLocation: string = '';
  private identifierType: any = '';
  private locations: any = [];
  private identifierValidity: string = '';
  private invalidLocationCheck: string = '';
  private patientIdentifierUuid: string = '';
  private patientIdentifiers: string = '';
  private commonIdentifierTypes: any = [];
  private commonIdentifierTypeFormats: any = [];
  private preferOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  private isValidIdentifier: boolean = false;
  private identifiers: string = '';
  constructor(private patientService: PatientService,
              private locationResourceService: LocationResourceService,
              private patientIdentifierService: PatientIdentifierService,
              private patientIdentifierTypeResService: PatientIdentifierTypeResService,
              private patientResourceService: PatientResourceService) {
  }

  ngOnInit(): void {
    this.getPatient();
    this.fetchLocations();
    this.getCommonIdentifierTypes();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patients = new Patient({});
        if (patient) {
          this.patients = patient;
          this.patientIdentifiers = this.patients._identifier;
        }
      }
    );

  }

  public showDialog() {
    this.display = true;
  }
  public dismissDialog() {
    this.display = false;
  }
  public setPatientIdentifier(patientIdentifier) {
    this.patientIdentifier = patientIdentifier;
    this.identifierValidity = '';
    this.errorMessage = '';
  }
  public setPreferredIdentifier(preferredIdentifier) {
    this.preferredIdentifier = preferredIdentifier;
  }
  public seIdentifierLocation(location) {
    this.identifierLocation = location.value;
    this.invalidLocationCheck = '';
  }
  public setIdentifierType(identifierType) {
    this.identifierValidity = '';
    this.identifierType = identifierType;
    let id = this.getCurrentIdentifierByType(this.patientIdentifiers, identifierType);
    if ( id ) {
      this.patientIdentifier = (id as any).identifier;
      this.patientIdentifierUuid = (id as any).uuid;
    }else {
      this.patientIdentifier = '';
      this.patientIdentifierUuid = '';
    }

  }

  public updatePatientIdentifier() {
    let person = {
      uuid: this.patients.person.uuid
     };
    let personIdentifierPayload = {
      uuid: this.patientIdentifierUuid,
      identifier: this.patientIdentifier, // patientIdentifier
      identifierType: (this.identifierType as any).val, // identifierType
      preferred: this.preferredIdentifier, // preferred
      location: this.identifierLocation // location

    };
    console.log('this payload', personIdentifierPayload);
    this.validateFormFields(this.patientIdentifier);
    this.checkIdentifierFormat();
    if (this.isValidIdentifier === true) {
      console.log('this payload22222', personIdentifierPayload);
      this.patientResourceService.searchPatient(this.patientIdentifier).subscribe(
        (result) => {
          if (result <= 0) {
            console.log('this payload3333', personIdentifierPayload);
            this.patientResourceService.saveUpdatePatientIdentifier(person.uuid,
              this.patientIdentifierUuid,
              personIdentifierPayload)
              .subscribe(
                (success) => {
                  this.patientService.fetchPatientByUuid(this.patients.person.uuid);
                  this.display = false;

                },
                (error) => {
                  console.log('Error occurred why updating patient identifier:', error);
                });
          }else {
            this.identifierValidity = 'A patient with this Identifier exists';
            this.display = true;

          }
        }
      );
    }
  }

  private getCurrentIdentifierByType(identifiers, identifierType) {

    let existingIdentifier = _.find(identifiers, (i) => {
      return (i as any).identifierType.uuid === identifierType.val;
    });
    return existingIdentifier;
  }
  private fetchLocations(): void {
    this.locationResourceService.getLocations().subscribe(
      (locations: any[]) => {
        this.locations = [];
        for (let i = 0; i < locations.length; i++) {
          this.locations.push({label: locations[i].name, value: locations[i].uuid});
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  private getCommonIdentifierTypes() {
    this.patientIdentifierTypeResService.getPatientIdentifierTypes().subscribe(
      (data) => {
        for (let i = 0; i < data.length; i++) {
          let  commonIdentifierTypeNames = this.patientIdentifierService.commonIdentifierTypes();
          if (_.includes(commonIdentifierTypeNames, data[i].name) === true) {
            this.commonIdentifierTypes.push({ val: data[i].uuid,
              label: data[i].name });
            this.commonIdentifierTypeFormats[data[i].uuid] = {
              format: data[i].format,
              checkdigit: data[i].checkDigit
              };
          }

        }

      },
      (error) => {
        console.log('Error Occurred while retrieving common patient identifier types', error);
      });
  }
  private checkIdentifierFormat() {
    // this.isValidIdentifier = false;
    this.identifierValidity = '';
    let identifierType = this.identifierType;
    if (this.commonIdentifierTypeFormats[(identifierType as any).val]) {
      let identifierFormat = this.commonIdentifierTypeFormats[(identifierType as any).val];

      if (identifierFormat.checkdigit) {
        this.checkLuhnCheckDigit();
      }
      if (identifierFormat.format && identifierFormat.format !== 'NULL') {
        this.isValidIdentifier =
          this.patientIdentifierService.checkRegexValidity(identifierFormat.format,
            this.patientIdentifier);
        if (this.isValidIdentifier === false) {
          this.identifierValidity = 'Invalid Identifier Format. {' + identifierFormat.format + '}';
        }
      }
      if ((identifierFormat.format === '' || identifierFormat.format === 'NULL'
        || identifierFormat.format === null) &&
        (identifierFormat.checkdigit === 0 || identifierFormat.checkdigit === false)) {
        this.isValidIdentifier = true;
      }
      if (!this.identifierLocation) {
        this.invalidLocationCheck = 'Location is Required';
      }
    }

  }
  private checkLuhnCheckDigit() {
    let checkDigit = this.patientIdentifier.split('-')[1];
    let expectedCheckDigit =
      this.patientIdentifierService.getLuhnCheckDigit(this.patientIdentifier.split('-')[0]);
    if (checkDigit === 'undefined' || checkDigit === undefined) {
      this.identifierValidity = 'Invalid Check Digit';
    }

    if (expectedCheckDigit === parseInt(checkDigit, 10)) {

      this.isValidIdentifier = true;
    } else {
      this.identifierValidity = 'Invalid Check Digit';
      console.log('this.identifierValidity', this.identifierValidity);
    }

  }
  private setErroMessage(message) {

    this.hasError = true;
    this.errorMessage = message;
  }
  private validateFormFields(patientIdentifier) {

    if (this.isNullOrUndefined(patientIdentifier)) {
      this.setErroMessage('Patient identifier is required.');
      return false;
    }


    return true;
  }
  private isNullOrUndefined(val) {
    return val === null || val === undefined || val === ''
      || val === 'null' || val === 'undefined';
  }


}

