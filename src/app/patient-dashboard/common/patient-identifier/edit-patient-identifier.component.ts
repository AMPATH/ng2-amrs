import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import * as _ from 'lodash';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { PatientIdentifierService } from './patient-identifiers.service';
import {
  PatientIdentifierTypeResService
} from '../../../openmrs-api/patient-identifierTypes-resource.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'edit-identifiers',
  templateUrl: './edit-patient-identifier.component.html',
  styleUrls: [],
})
export class EditPatientIdentifierComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public errorMessage: string = '';
  public hasError: boolean = false;
  public display: boolean = false;
  public patientIdentifier: string = '';
  public preferredIdentifier: string = '';
  public identifierLocation: string = '';
  public identifierType: any = '';
  public locations: any = [];
  public identifierValidity: string = '';
  public invalidLocationCheck: string = '';
  public patientIdentifierUuid: string = '';
  public patientIdentifiers: string = '';
  public commonIdentifierTypes: any = [];
  public commonIdentifierTypeFormats: any = [];
  public preferOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public isValidIdentifier: boolean = false;
  public identifiers: string = '';
  public selectedDevice: any;
  public showSuccessAlert: boolean = false;
  public showErrorAlert: boolean = false;
  public errorAlert: string;
  public successAlert: string = '';
  public errorTitle: string;
  private subscription: Subscription;
  private initialPatientIdentifier: string = '';
  constructor(private patientService: PatientService,
              private locationResourceService: LocationResourceService,
              private patientIdentifierService: PatientIdentifierService,
              private patientIdentifierTypeResService: PatientIdentifierTypeResService,
              private patientResourceService: PatientResourceService) {
  }

  public ngOnInit(): void {
    this.getPatient();
    this.fetchLocations();
    this.getCommonIdentifierTypes();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
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
    this.identifierLocation = location;
    this.invalidLocationCheck = '';
  }

  public setIdentifierType(identifierType) {
    this.identifierValidity = '';
    this.identifierType = identifierType;
    let id = this.getCurrentIdentifierByType(this.patientIdentifiers, identifierType);
    if ( id ) {
      this.patientIdentifier = (id as any).identifier;
      this.patientIdentifierUuid = (id as any).uuid;
      this.preferredIdentifier = (id as any).preferred;
      this.selectedDevice = (id as any).location.uuid;
    }else {
      this.patientIdentifier = '';
      this.patientIdentifierUuid = '';
    }

  }

  public updatePatientIdentifier() {
    let person = {
      uuid: this.patients.person.uuid
     };
    let idExists = this.patientHasIdentifier(this.patientIdentifier,
     (this.identifierType as any));
    let personIdentifierPayload = {
      uuid: this.patientIdentifierUuid,
      identifier: this.patientIdentifier, // patientIdentifier
      identifierType: (this.identifierType as any).val, // identifierType
      preferred: this.preferredIdentifier, // preferred
      location: this.identifierLocation // location

    };
    if (idExists) {
      delete personIdentifierPayload['identifier'];
      delete personIdentifierPayload['identifierType'];
      this.saveIdentifier(personIdentifierPayload, person);
    } else {
    this.validateFormFields(this.patientIdentifier);
    this.checkIdentifierFormat();
    if (this.isValidIdentifier === true) {
      this.patientResourceService.searchPatient(this.patientIdentifier).subscribe(
        (result) => {
          if (result <= 0) {
            if (personIdentifierPayload.uuid === undefined || personIdentifierPayload.uuid === '' ||
              personIdentifierPayload.uuid === null) {
              delete personIdentifierPayload.uuid;
            }
            this.saveIdentifier(personIdentifierPayload, person);
          }else {
            this.identifierValidity = 'A patient with this Identifier exists';
            this.display = true;

          }
        }
      );
    }else {
       console.error('ERROR : Invalid identifier type');
    }
  }
  }

private saveIdentifier(personIdentifierPayload, person) {
  this.patientResourceService.saveUpdatePatientIdentifier(person.uuid,
              this.patientIdentifierUuid,
              personIdentifierPayload)
              .subscribe(
                (success) => {
                  this.displaySuccessAlert('Identifiers saved successfully');
                  this.patientService.fetchPatientByUuid(this.patients.person.uuid);
                  setTimeout(() => {
                    this.display = false;
                  }, 1000);

                },
                (error) => {
                  console.error('Error occurred why updating patient identifier:', error);
                });
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
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < locations.length; i++) {
          this.locations.push({label: locations[i].name, value: locations[i].uuid});
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  private getCommonIdentifierTypes() {
    this.patientIdentifierTypeResService.getPatientIdentifierTypes().subscribe(
      (data) => {
        // tslint:disable-next-line:prefer-for-of
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
        console.error('Error Occurred while retrieving common patient identifier types', error);
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
      }else {
        console.error('ERROR : Check Digit Failed');
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
      }else {
        console.error('ERROR: Invalid Identifier Format', identifierFormat.format);
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
      console.error('ERROR: Invalid Check Digit');
    }

    if (expectedCheckDigit === parseInt(checkDigit, 10)) {
      this.isValidIdentifier = true;
    } else {
      console.error('ERROR : Expected Check Digit');
      this.identifierValidity = 'Invalid Check Digit';
    }

  }
  private setErroMessage(message) {

    this.hasError = true;
    this.errorMessage = message;
  }
  private validateFormFields(patientIdentifier) {
    let isNullOrUndefined = this.isNullOrUndefined(patientIdentifier);
    if (isNullOrUndefined === false) {
      this.isValidIdentifier = true;
      return true;
    }else {
      this.setErroMessage('Patient identifier is required.');
      this.isValidIdentifier = false;
      return false;
    }
  }
  private isNullOrUndefined(val) {
    return val === null || val === undefined || val === ''
      || val === 'null' || val === 'undefined';
  }
  private filterUndefinedUuidFromPayLoad(personAttributePayload) {
    if (personAttributePayload && personAttributePayload.length > 0) {
      for (let i = 0; i < personAttributePayload.length; i++) {
        if (personAttributePayload[i].uuid === undefined) {
          personAttributePayload.splice(i, 1);
          i--;
        }
      }
    }
  }
  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }

  private patientHasIdentifier(identifier, identifierType) {
    let id = this.getCurrentIdentifierByType(this.patientIdentifiers, identifierType);
    if ( id ) {
      if ((id as any).identifier === identifier) {
        return true;
      }
    }
    return false;
  }
}
