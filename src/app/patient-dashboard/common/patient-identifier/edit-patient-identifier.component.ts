import { take } from 'rxjs/operators/take';
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
import { UserService } from '../../../openmrs-api/user.service';
import {
  PatientCreationResourceService
} from '../../../openmrs-api/patient-creation-resource.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { isArray } from 'util';

@Component({
  selector: 'edit-identifiers',
  templateUrl: './edit-patient-identifier.component.html',
  styleUrls: [],
})
export class EditPatientIdentifierComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public errorMessage = '';
  public hasError = false;
  public display = false;
  public addDialog = false;
  public patientIdentifier = '';
  public preferredIdentifier = '';
  public identifierLocation = '';
  public identifierType: any = '';
  public locations: any = [];
  public identifierValidity = '';
  public invalidLocationCheck = '';
  public patientIdentifierUuid = '';
  public patientIdentifiers = '';
  public commonIdentifierTypes: any = [];
  public commonIdentifierTypeFormats: any = [];
  public preferOptions = [{label: 'Yes', value: true}, {label: 'No', value: false}];
  public isValidIdentifier = false;
  public identifiers = '';
  public selectedDevice: any;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public successAlert = '';
  public errorTitle: string;
  public showNationalIdTexBox = false;
  public showGeneralTexBox = false;
  public checkUniversal = false;
  public userId;
  public newLocation = '';
  private subscription: Subscription;
  private initialPatientIdentifier = '';
  public isPreferred = false;
  public isNewlocation = false;

  constructor(private patientService: PatientService,
              private locationResourceService: LocationResourceService,
              private patientIdentifierService: PatientIdentifierService,
              private patientIdentifierTypeResService: PatientIdentifierTypeResService,
              private patientResourceService: PatientResourceService,
              private patientCreationResourceService: PatientCreationResourceService,
              private userService: UserService
  ) {
  }

  public ngOnInit(): void {
    this.getPatient();
    this.fetchLocations();
    this.commonIdentifierTypes = this.patientIdentifierService.patientIdentifierTypeFormat();
    this.userId = this.userService.getLoggedInUser().openmrsModel.systemId;
    this.identifierValidity = '';
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

  public showDialog(param, id) {
    this.identifierValidity = '';
    if (param === 'edit' && id) {
      this.display = true;
      this.initIdentifier(id);
    } else if (param === 'add') {
      this.addDialog = true;
      if (isArray(id)) {
        // remove types that cannot be added more that once
        _.each(id, (_id) => {
          const hasId = _.includes([
            '58a4732e-1359-11df-a1f1-0026b9348838', // AMRS Universal ID
            '58a47054-1359-11df-a1f1-0026b9348838', // KENYA NATIONAL ID NUMBER
            'ead42a8f-203e-4b11-a942-df03a460d617', // HEI
            'd1e5ef63-126f-4b1f-bd3f-496c16c4098d', // KUZA ID
            '9cae9c8a-2821-4aa7-8064-30508e9f62ec', // ZURI ID
            'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e', // CCC number
            '22ee6ad7-58fb-4382-9af2-c6a553f3d56a', // NAT ID
            '5b91df4a-db7d-4c52-ac85-ac519420d82e', // BHIM ID
            'ace5f7c7-c5f4-4e77-a077-5588a682a0d6' // OVCID number
          ], _id.identifierType.uuid);
          if (hasId) {
            _.remove(this.commonIdentifierTypes, (idType: any) => idType.val === _id.identifierType.uuid);
          }
        });
      }

    }
  }

  public initIdentifier(id) {
    if (id) {
      this.patientIdentifier = id.identifier;
      this.initialPatientIdentifier = id.identifier;
      this.identifierType = {value: id.identifierType.uuid, label: id.identifierType.name};
      this.preferredIdentifier = id.preferred;
      this.selectedDevice = {value: id.location.uuid, label: id.location.name};
      this.patientIdentifierUuid = id.uuid;
      this.identifierLocation = id.location.uuid;
      this.newLocation = this.identifierLocation;
    }
  }

  public dismissDialog() {
    this.display = false;
    this.addDialog = false;
    this.identifierValidity = '';
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
    this.isPreferred = true;
  }

  public seIdentifierLocation(location) {
    // this.identifierLocation = location.value;
    this.newLocation = location.value;
    this.invalidLocationCheck = '';
    this.isNewlocation = true;
  }

  public setIdentifierType(identifierType) {
    this.checkUniversal = false;
    if (identifierType.val === '58a47054-1359-11df-a1f1-0026b9348838') {
      this.showNationalIdTexBox = true;
      this.showGeneralTexBox = true;
    } else {
      this.showGeneralTexBox = false;
      this.showNationalIdTexBox = false;
    }

    this.identifierValidity = '';
    this.identifierType = identifierType;
    const id = this.getCurrentIdentifierByType(this.patientIdentifiers, identifierType);
    if (id) {
      const loc = {value: (id as any).location.uuid, label: (id as any).location.name};
      this.patientIdentifier = (id as any).identifier;
      this.patientIdentifierUuid = (id as any).uuid;
      this.preferredIdentifier = (id as any).preferred;
      this.selectedDevice = loc;
      this.identifierLocation = loc.value;
    } else {
      this.patientIdentifier = '';
      this.patientIdentifierUuid = '';
    }

    if (identifierType.val === '58a4732e-1359-11df-a1f1-0026b9348838'
      && this.patientIdentifier) {
      this.checkUniversal = false;
    } else if (identifierType.val === '58a4732e-1359-11df-a1f1-0026b9348838'
      && !this.patientIdentifier) {
      this.checkUniversal = true;
    }

  }

  public selectIdentifierType(identifierType) {
    this.checkUniversal = false;
    this.identifierType = identifierType;
    if (identifierType.val === '58a4732e-1359-11df-a1f1-0026b9348838'
      && this.patientIdentifier) {
      this.checkUniversal = false;
    } else if (identifierType.val === '58a4732e-1359-11df-a1f1-0026b9348838'
      && !this.patientIdentifier) {
      this.checkUniversal = true;
    } else {
      this.patientIdentifier = '';
      this.patientIdentifierUuid = '';
      this.preferredIdentifier = '';
      this.isPreferred = false;
      this.isNewlocation = false;
    }
  }

  public updatePatientIdentifier() {
    const person = {
      uuid: this.patients.person.uuid
    };
    const idExists = this.patientHasIdentifier(this.patientIdentifier,
      (this.identifierType as any));
    const personIdentifierPayload = {
      uuid: this.patientIdentifierUuid,
      identifier: this.patientIdentifier.toString(), // patientIdentifier
      identifierType: (this.identifierType as any).val, // identifierType
      preferred: this.preferredIdentifier, // preferred
      location: this.newLocation // location

    };
    if (idExists) {
      delete personIdentifierPayload['identifier'];
      delete personIdentifierPayload['identifierType'];
      // this.saveIdentifier(personIdentifierPayload, person);
    } else {
      if (!this.validateFormFields(this.patientIdentifier)) {
        return;
      }

      this.checkIdentifierFormat();
      if (this.isValidIdentifier) {
        this.patientResourceService.searchPatient(this.patientIdentifier).pipe(take(1)).subscribe(
          (result) => {
            if (result.length > 0 && this.identifierHasChanged()) {
              this.identifierValidity = 'This identifier is already in use!';
              this.display = true;
            } else {
              if (personIdentifierPayload.uuid === undefined || personIdentifierPayload.uuid === '' ||
                personIdentifierPayload.uuid === null) {
                delete personIdentifierPayload.uuid;
              }
              this.identifierValidity = '';
              this.saveIdentifier(personIdentifierPayload, person);
            }
          }
        );
      } else {
        this.identifierValidity = 'Invalid Identifier. Confirm identifier type';
      }
    }
  }

  public identifierHasChanged() {
    return this.initialPatientIdentifier !== this.patientIdentifier;
  }

  public _keyPress(event: any) {
    const pattern = /^[0-9]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  public generatePatientIdentifier() {
    this.patientCreationResourceService.generateIdentifier(this.userId).subscribe((data: any) => {
      this.patientIdentifier = data.identifier;
      this.checkUniversal = false;
    }, ((err) => {
      console.log(err.json());
    }));
  }

  private saveIdentifier(personIdentifierPayload, person) {
    this.patientResourceService.saveUpdatePatientIdentifier(person.uuid,
      this.patientIdentifierUuid,
      personIdentifierPayload).pipe(
      take(1)).subscribe(
      (success) => {
        this.displaySuccessAlert('Identifiers saved successfully');
        this.patientIdentifier = '';
        this.identifierLocation = '';
        this.preferredIdentifier = '';
        this.identifierType = '';
        this.isPreferred = false;
        this.isNewlocation = false;
        this.patientService.fetchPatientByUuid(this.patients.person.uuid);
        setTimeout(() => {
          this.display = false;
          this.addDialog = false;
        }, 1000);

      },
      (error) => {
        console.error('Error occurred why updating patient identifier:', error);
      });
  }

  private getCurrentIdentifierByType(identifiers, identifierType) {
    const existingIdentifier = _.find(identifiers, (i) => {
      return (i as any).identifierType.uuid === identifierType.val;
    });
    return existingIdentifier;
  }

  private fetchLocations(): void {
    this.locationResourceService.getLocations().pipe(take(1)).subscribe(
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
    const selectedIdentifierType: any = this.identifierType;
    if (selectedIdentifierType) {
      const identifierHasFormat = selectedIdentifierType.format;
      const identifierHasCheckDigit = selectedIdentifierType.checkdigit;
      if (identifierHasCheckDigit) {
        this.checkLuhnCheckDigit();
        if (!this.isValidIdentifier) {
          this.identifierValidity = 'Invalid Check Digit.';
          return;
        }
      }

      if (identifierHasFormat) {
        this.isValidIdentifier =
          this.patientIdentifierService.checkRegexValidity(identifierHasFormat,
            this.patientIdentifier);
        if (!this.isValidIdentifier) {
          this.identifierValidity = 'Invalid Identifier Format. {' + identifierHasFormat + '}';
          return;
        }
      }
      this.isValidIdentifier = true;
    }

  }

  private checkLuhnCheckDigit() {
    const checkDigit = this.patientIdentifier.split('-')[1];
    const expectedCheckDigit =
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
    let isNullOrUndefined = false;
    if (this.isNullOrUndefined(patientIdentifier)) {
      this.setErroMessage('Patient identifier is required.');
      isNullOrUndefined = true;
    } else {
      this.hasError = false;
      this.errorMessage = undefined;
    }
    if (this.isNullOrUndefined(this.newLocation) || this.isNullOrUndefined(this.selectedDevice)) {
      this.invalidLocationCheck = 'Location is Required';
      isNullOrUndefined = true;
    } else {
      this.invalidLocationCheck = undefined;
    }
    return !isNullOrUndefined;
  }

  private isNullOrUndefined(val) {
    return val === null || val === undefined || val === '' || val === 'null' || val === 'undefined';
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
    const id = this.getCurrentIdentifierByType(this.patientIdentifiers, identifierType);
    if (id) {
      if ((id as any).identifier === identifier) {
        return true;
      }
    } else if (this.isPreferred) {
      return false;
    } else {
      return false;
    }
  }
}
