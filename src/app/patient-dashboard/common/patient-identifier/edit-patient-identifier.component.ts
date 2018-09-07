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
import { FormControl } from '@angular/forms';

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
  public showNationalIdTexBox: boolean = false;
  public showGeneralTexBox: boolean = false;
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
    this.commonIdentifierTypes = this.patientIdentifierService.patientIdentifierTypeFormat();
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
    if (this.identifierType || this.identifierType !== '') {
      this.hasError = false;
      this.checkIdentifierFormat();
      this.errorAlert = '';
    }

  }
  public setPreferredIdentifier(preferredIdentifier) {
    this.preferredIdentifier = preferredIdentifier;
  }
  public seIdentifierLocation(location) {
    this.identifierLocation = location.value;
    this.invalidLocationCheck = '';
  }

  public setIdentifierType(identifierType) {
    if ( identifierType.val === '58a47054-1359-11df-a1f1-0026b9348838') {
      this.showNationalIdTexBox = true;
      this.showGeneralTexBox = true;
    } else {
      this.showGeneralTexBox = false;
      this.showNationalIdTexBox = false;
    }
    this.identifierValidity = '';
    this.identifierType = identifierType;
    let id = this.getCurrentIdentifierByType(this.patientIdentifiers, identifierType);
    if ( id ) {
      let loc = {value: (id as any).location.uuid, label: (id as any).location.name};
      this.patientIdentifier = (id as any).identifier;
      this.patientIdentifierUuid = (id as any).uuid;
      this.preferredIdentifier = (id as any).preferred;
      this.selectedDevice = loc;
      this.identifierLocation = loc.value;
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
      identifier: this.patientIdentifier.toString(), // patientIdentifier
      identifierType: (this.identifierType as any).val, // identifierType
      preferred: this.preferredIdentifier, // preferred
      location: this.identifierLocation // location

    };
    if (idExists) {
      delete personIdentifierPayload['identifier'];
      delete personIdentifierPayload['identifierType'];
      this.saveIdentifier(personIdentifierPayload, person);
    } else {
    this.identifierValidity = 'Patient identifier is required.';
    if (!this.validateFormFields(this.patientIdentifier)) {
      return ;
    }

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
    } else {
      console.log('Invalid Identifier');
    }
  }
  }

  public _keyPress(event: any) {
    const pattern = /^[0-9]*$/ ;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
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

  private checkIdentifierFormat() {
    this.identifierValidity = '';
    let selectedIdentifierType: any = this.identifierType;
    if (selectedIdentifierType) {
      let identifierHasFormat = selectedIdentifierType.format;
      let identifierHasCheckDigit = selectedIdentifierType.checkdigit;
      if (identifierHasCheckDigit) {
        this.checkLuhnCheckDigit();
        if (this.isValidIdentifier === false) {
            this.identifierValidity = 'Invalid Check Digit.';
            return ;
        }
      }

      if (identifierHasFormat) {
        this.isValidIdentifier =
          this.patientIdentifierService.checkRegexValidity(identifierHasFormat,
            this.patientIdentifier);
        if (this.isValidIdentifier === false) {
          this.identifierValidity = 'Invalid Identifier Format. {' + identifierHasFormat + '}';
          return ;
        }
      }

      if (!this.identifierLocation) {
        this.invalidLocationCheck = 'Location is Required';
        return;
      }
      this.isValidIdentifier = true;

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
      console.error('ERROR : Expected Check Digit', expectedCheckDigit);
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
      return true;
    }else {
      this.setErroMessage('Patient identifier is required.');
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
