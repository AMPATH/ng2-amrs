import { take } from 'rxjs/operators';
import {
  Component, OnInit, Output, OnDestroy, ViewChild, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as Fuse from 'fuse.js';
import 'ag-grid-enterprise/main';
import { Router } from '@angular/router';
import { Patient } from '../models/patient.model';
import { UserService } from '../openmrs-api/user.service';
import { PatientCreationService } from './patient-creation.service';
import {
  PatientCreationResourceService
} from '../openmrs-api/patient-creation-resource.service';
import {
  LocationResourceService
} from '../openmrs-api/location-resource.service';
import {
  PatientIdentifierTypeResService
} from '../openmrs-api/patient-identifierTypes-resource.service';
import { ConceptResourceService } from './../openmrs-api/concept-resource.service';
import { constants } from 'os';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { SessionStorageService } from '../utils/session-storage.service';
import { ToastrService } from 'ngx-toastr';
import { PatientRelationshipTypeService } from '../patient-dashboard/common/patient-relationships/patient-relation-type.service';

@Component({
  selector: 'patient-creation',
  templateUrl: './patient-creation.component.html',
  styleUrls: ['./patient-creation.component.css']
})
export class PatientCreationComponent implements OnInit, OnDestroy {
  @Output() public patientSelected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('successModal') public successModal: BsModalRef;
  @ViewChild('confirmModal') public confirmModal: BsModalRef;

  public patients: Patient = new Patient({});
  public person: any;
  public display = false;
  public subscriptions: Subscription[] = [];
  public userId;
  public givenName: string;
  public familyName: string;
  public middleName: string;
  public preferred: any;
  public ispreferred: boolean;
  public loaderStatus = false;
  public preferredOptions = [
    { label: 'Yes', val: true },
    { label: 'No', val: false }
  ];
  public genderOptions = [
    { label: 'Female', val: 'F' },
    { label: 'Male', val: 'M' }
  ];
  public patientExists = true;
  public preferredNameuuid: string;
  public birthDate: any;
  public birthdateEstimated;
  public dead = false;
  public gender: any;
  public createdPatient;
  public page = 1;
  public idKey;
  public selectId;

  public patientPhoneNumber: number;
  public alternativePhoneNumber: number;
  public partnerPhoneNumber: number;
  public nextofkinPhoneNumber: number;
  public r1 = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))/;
  public r2 = /(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
  public pattern = new RegExp(this.r1.source + this.r2.source);
  public levelOfEducation: Array<any>;
  public patientHighestEducation: string;

  public address1: string;
  public address2: string;
  public address3: string;
  public cityVillage: string;
  public longitude: string;
  public latitude: string;
  public stateProvince: string;
  public others = false;

  public patientIdentifiers = [];
  public patientIdentifier: string;
  public commonIdentifier;
  public patientIdentifierTypes: any;
  public patientIdentifierType: any;
  public identifierAdded = false;
  public commonAdded = false;
  public locations = [];
  public counties: any;
  public identifiers = [];
  public patientResults: Patient[];
  public found = false;
  public selectedLocation: string;
  public identifierLocation = '';
  public invalidLocationCheck = '';
  public commonIdentifierTypes: any = [];
  public commonIdentifierTypeFormats: any = [];
  public identifierValidity = '';
  public isValidIdentifier = false;
  public ageEstimate: number;

  public errors = false;
  public successAlert: any = '';
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: boolean;
  public errorTitle: string;
  public editText = false;
  public errorMessage = '';
  public hasError = false;
  public isError = false;
  public disable = false;
  public errorMessages = '';
  public birthError = '';
  public modalRef: BsModalRef;
  public universal: any;
  public generate = true;
  public preferredIdentifier;
  public errorAlerts = [];
  public occupationConceptUuid = 'a8a0a00e-1350-11df-a1f1-0026b9348838';
  public occupationAttributeTypeUuid = '9e86409f-9c20-42d0-aeb3-f29a4ca0a7a0';
  public occupations = [];
  public occupationConcept: any;
  public occupation: any;
  public highestEducationConcept = 'a89e48ae-1350-11df-a1f1-0026b9348838';

  public careGivername: any;
  public relationshipToCareGiver: any;
  public careGiverPhoneNumber: any;
  public ampathLocations: any;
  public subcounties: any = [];
  public wards: any = [];
  public address7: any;
  public patientRelationshipTypes: any = [];
  public selectedRelationshipType: any;
  constructor(
    public toastrService: ToastrService,
    private patientCreationService: PatientCreationService,
    private patientCreationResourceService: PatientCreationResourceService,
    private locationResourceService: LocationResourceService,
    private patientIdentifierTypeResService: PatientIdentifierTypeResService,
    private userService: UserService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private modalService: BsModalService,
    private conceptService: ConceptResourceService,
    private patientRelationshipTypeService: PatientRelationshipTypeService,
    ) {
  }

  public ngOnInit() {
    this.getLocations();
    this.getCommonIdentifierTypes();
    this.getOccupatonConcept();
    this.getEducationLevels();
    this.getAmpathLocations();
    this.getRelationShipTypes();
    this.selectedRelationshipType = undefined;
    this.userId = this.userService.getLoggedInUser().openmrsModel.systemId;
    this.errorAlert = false;
    this.person = this.sessionStorageService.getObject('person');
    if (this.person) {
      this.givenName = this.person.givenName;
      this.middleName = this.person.middleName;
      this.familyName = this.person.familyName;
      this.gender = this.person.gender;
      this.birthDate = this.person.birthdate;
      this.ageEstimate = this.getAge(this.person.birthdate);
      this.birthdateEstimated = this.person.birthdateEstimated;
    }
    this.patientCreationService.getpatientResults().pipe(take(1)).subscribe((res) => {
      if (res.length > 0) {
        this.patientResults = res;
        this.found = true;
      }
    });
  }

  public getEducationLevels() {
    this.conceptService.getConceptByUuid(this.highestEducationConcept)
      .subscribe((educationLevels: any) => {
        if (educationLevels) {
          this.setHighestEduction(educationLevels.answers);
        }
      });
  }

  public setHighestEduction(educationLevels: Array<any>) {
    this.levelOfEducation = educationLevels.map((levels: any) => {
      return {
        value: levels.uuid,
        name: levels.display,
      };
    });
  }

  public getOccupatonConcept() {
     this.conceptService.getConceptByUuid(this.occupationConceptUuid)
     .subscribe((concept: any) => {
       if (concept) {
           this.occupationConcept = concept;
           this.setOccupationOptions(concept.answers);
       }
     });

  }

  public setOccupationOptions(occupations) {
    this.occupations = occupations.map((occupation: any) => {
        return {
          'val': occupation.uuid,
          'label': occupation.display
        };
    });

  }
  public updateBirthDate(birthDate) {
    this.disable = true;
    this.birthDate = birthDate;
    this.ageEstimate = this.getAge(this.birthDate);

    if (moment(this.birthDate).isAfter(new Date())) {
      this.birthError = 'Birth Date date cannot be in future!';
    } else {
      this.birthError = '';
    }

    if (!this.birthDate) {
      this.disable = false;
    }
  }

  public updateDOBDetails() {
    setTimeout(() => {
      if (this.ageEstimate < 1) {
        this.birthDate = '';
      } else {
        this.updateBirthDate(this.calculateAge(this.ageEstimate));
        this.birthdateEstimated = true;
        this.disable = false;
      }
    }, 2000);
  }

  public createPerson() {
    this.errors = false;
    this.successAlert = '';
    if (this.getAge(this.birthDate) > 116) {
      this.birthError = 'Please select a valid birthdate or age';
    } else if (
      !this.givenName ||
      !this.familyName ||
      !this.gender ||
      this.birthError ||
      !this.birthDate ||
      !this.occupation ||
      !this.patientHighestEducation
    ) {
      this.errors = true;
    } else {
      this.errors = false;
      this.loaderStatus = true;
      this.person = {
        givenName: this.givenName,
        middleName: this.middleName,
        familyName: this.familyName,
        gender: this.gender,
        birthdate: this.birthDate,
        birthdateEstimated: this.birthdateEstimated,
      };
      this.sessionStorageService.setObject('person', this.person);
      const searchString = this.givenName;
      this.patientCreationService
        .searchPatient(searchString, false)
        .pipe(take(1))
        .subscribe((results) => {
          this.loaderStatus = false;
          if (results.length > 0) {
            const birthdate = this.getAge(this.birthDate);
            results = _.filter(results, (o) => {
              return (
                o.person.age === birthdate - 1 ||
                o.person.age === birthdate ||
                o.person.age === birthdate + 1
              );
            });
            const res = this.filterPatients(results);
            if (res.length > 0) {
              this.patientResults = res;
              this.patientCreationService.patientResults(this.patientResults);
              this.found = true;
            } else {
              this.continue();
            }
          } else {
            this.continue();
          }
        });
    }
  }

  public filterPatients(results) {
    const options = {
      keys: ['person.gender']
    };
    const fuse = new Fuse(results, options);
    results = fuse.search(this.gender);
    return results;

  }

  public getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  public selectPatient(patient) {
    this.router.navigate(['/patient-dashboard/patient/' + patient.uuid +
      '/general/general/patient-info']);
  }

  public continue() {
    this.patientCreationService.patientResults([]);
    this.found = false;
    this.patientExists = false;
  }

  public back() {
    this.found = false;
    this.patientResults = [];
  }

  public updateUniversal() {
    if (this.patientIdentifier) {
      if (this.identifiers.length > 0) {
        const check = this.checkUniversal();
        if (check) {
          this.isError = true;
          this.errorMessages = 'Identifier has been added.';
        } else {
          this.isError = false;
          this.generate = false;
          this.identifierAdded = true;
          this.universal.identifier = this.patientIdentifier;
          this.identifiers.push(this.universal);
          this.errorMessages = '';
        }
      } else {
        this.generate = false;
        this.identifierAdded = true;
        this.universal.identifier = this.patientIdentifier;
        this.identifiers.push(this.universal);
        this.isError = false;
        this.hasError = false;
        this.errorMessages = '';
      }
    }

  }

  public setIdentifierType(identifierType) {
    this.patientIdentifierType = identifierType;
    this.commonIdentifier = '';
    this.identifierValidity = '';
    this.hasError = false;
    this.errorAlert = false;
  }

  public setPreferred(identifier) {
    this.preferredIdentifier = identifier;
  }

  public setIdentifierLocation(location) {
    this.identifierLocation = location.value;
  }

  public setPatientIdentifier(commonIdentifier) {
    this.commonIdentifier = commonIdentifier;
    this.identifierValidity = '';
    this.errorMessage = '';
    this.hasError = false;
    this.errorAlert = false;
  }

  public checkIdentifier() {
    if (this.patientIdentifierType || this.patientIdentifierType !== '') {
      this.hasError = false;
      this.checkIdentifierFormat();
      this.errorAlert = false;
    }
  }

  public addIdentifier(commonIdentifier) {
    if (!this.patientIdentifierType || this.patientIdentifierType === '') {
      this.hasError = true;
      this.setErroMessage('Identifier Type is required!');
    } else if (this.validateFormFields(commonIdentifier) && this.isValidIdentifier) {
      if (this.identifiers.length > 0) {
        const check = this.checkAdded();
        if (check) {
          this.hasError = true;
          this.setErroMessage('Identifier has been added');
        } else {
          this.hasError = false;
          this.identifierAdded = true;
          this.commonAdded = true;
          this.identifiers.push({
            identifier: commonIdentifier,
            identifierType: this.patientIdentifierType.val,
            identifierTypeName: this.patientIdentifierType.label
          });
        }
      } else {
        this.identifierAdded = true;
        this.commonAdded = true;
        this.identifiers.push({
          identifier: commonIdentifier,
          identifierType: this.patientIdentifierType.val,
          identifierTypeName: this.patientIdentifierType.label
        });
      }
    }
    this.errorAlert = false;

  }

  public removeIdentifer(i, identifier) {
    this.idKey = i;
    this.selectId = identifier;
    this.modalRef = this.modalService.show(this.confirmModal, {
      backdrop: 'static',
      keyboard: false
    });
  }
  public check(value) {
    this.modalRef.hide();
    if (value) {
      this.identifiers.splice(this.idKey, 1);
      if (this.selectId.identifierType === this.universal.identifierType) {
        this.patientIdentifier = '';
        this.editText = false;
        this.errorMessages = '';
        this.isError = false;
        this.generate = true;
        this.preferredIdentifier = '';
      }
      if (this.identifiers.length === 0) {
        this.commonIdentifier = '';
        this.patientIdentifierType = '';
        this.identifierAdded = false;
        this.commonAdded = false;
      }
      this.errorAlert = false;
    }
  }

  public createPatient() {
    this.loaderStatus = false;
    this.errors = false;
    const ids = [];
    this.successAlert = '';
    if (!this.checkUniversal()) {
      this.identifierAdded = false;
      this.errors = true;
      return;
    } else {
      const value = this.identifiers[0];
      this.preferredIdentifier = value;
    }
    if (this.getAge(this.birthDate) > 116) {
      this.birthError = 'Please select a valid birthdate or age';
    }
    if (!this.givenName) {
      this.errors = true;
    }
    if (!this.familyName) {
      this.errors = true;
    }
    if (!this.gender) {
      this.errors = true;
    }
    if (!this.occupation) {
      this.errors = true;
    }
    if (!this.birthDate) {
      this.errors = true;
    }

    if (!this.patientIdentifier) {
      this.errors = true;
    }
    if (!this.identifierLocation) {
      this.errors = true;
    }
    if (this.commonIdentifier && !this.commonAdded) {
      this.errors = true;
    }
    if (!this.selectedLocation) {
      this.errors = true;
    }
    if (this.identifiers.length > 1 && !this.preferredIdentifier) {
      this.errors = true;
    } else if (this.identifiers.length === 0) {
      this.errors = true;
    } else if (this.identifiers.length === 1) {
      const value = this.identifiers[0];
      this.preferredIdentifier = value;
      ids.push({
        identifierType: value.identifierType,
        identifier: value.identifier,
        location: this.identifierLocation,
        preferred: true
      });
    } else if (this.identifiers.length > 1) {
      this.identifiers.forEach((value) => {
        if (value.identifierType === this.preferredIdentifier.identifierType) {
          ids.push({
            identifierType: value.identifierType,
            identifier: value.identifier,
            location: this.identifierLocation,
            preferred: true
          });
        } else {
          ids.push({
            identifierType: value.identifierType,
            identifier: value.identifier,
            location: this.identifierLocation,
            preferred: false
          });
        }
      });
    }

    if (!this.errors) {
      this.loaderStatus = true;
      this.birthError = '';
      this.errorAlert = false;
      const attributes = [];
      if (this.patientPhoneNumber) {
        attributes.push({
          value: this.patientPhoneNumber,
          attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
        });
      }
      if (this.alternativePhoneNumber) {
        attributes.push({
          value: this.alternativePhoneNumber,
          attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
        });
      }
      if (this.partnerPhoneNumber) {
        attributes.push({
          value: this.partnerPhoneNumber,
          attributeType: 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46'
        });
      }
      if (this.nextofkinPhoneNumber) {
        attributes.push({
          value: this.nextofkinPhoneNumber,
          attributeType: 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d'
        });
      }
      if (this.occupation) {
        attributes.push({
        'value': this.occupation,
        'attributeType': this.occupationAttributeTypeUuid
      });
    }

      if (this.patientHighestEducation) {
        attributes.push({
          value: this.patientHighestEducation,
          attributeType: '352b0d51-63c6-47d0-a295-156bebee4fd5'
        });
      }

      if (this.careGivername) {
        attributes.push({
          value: this.careGivername,
          attributeType: '48876f06-7493-416e-855d-8413d894ea93'
        });
      }
      if (this.relationshipToCareGiver) {
        attributes.push({
          value: this.relationshipToCareGiver,
          attributeType: '06b0da36-e133-4be6-aec0-31e7ed0e1ac2'
        });
      }
      if (this.careGiverPhoneNumber) {
        attributes.push({
          value: this.careGiverPhoneNumber,
          attributeType: 'bb8684a5-ac0b-4c2c-b9a5-1203e99952c2'
        });
      }
      const payload = {
        person: {
          names: [{
            givenName: this.givenName,
            middleName: this.middleName,
            familyName: this.familyName
          }],
          gender: this.gender,
          birthdate: this.birthDate,
          birthdateEstimated: this.birthdateEstimated,
          attributes: attributes,
          addresses: [{
            address1: this.address1,
            address2: this.address2,
            address3: this.address3,
            address7: this.address7,
            cityVillage: this.cityVillage,
            latitude: this.latitude,
            longitude: this.longitude,
            stateProvince: this.stateProvince
          }]
        },
        identifiers: ids
      };
      this.errorAlerts = [];
      this.patientCreationResourceService.savePatient(payload).pipe(
        take(1)).subscribe((success) => {
          this.loaderStatus = false;
          this.sessionStorageService.remove('person');
          this.createdPatient = success;
          if (this.createdPatient) {
            this.modalRef = this.modalService.show(this.successModal,
              { backdrop: 'static', keyboard: false });
          }
        }, (err) => {
          this.loaderStatus = false;
          const error = err.error.error.globalErrors;
          this.errorAlert = true;
          this.errorAlerts = error;
        });

    }
  }
  public loadDashboard(createdPatient) {
    this.modalRef.hide();
    this.router.navigate(['/patient-dashboard/patient/' + createdPatient.person.uuid +
      '/general/general/patient-info']);
    this.errorAlert = false;
  }
  public close() {
    this.modalRef.hide();
    this.router.navigate(['/patient-dashboard/patient-search']);
    this.errorAlert = false;
  }
  public reset() {
    this.givenName = '';
    this.familyName = '';
    this.middleName = '';
    this.gender = '';
    this.birthDate = '';
    this.ageEstimate = null;
    this.sessionStorageService.remove('person');
    this.errors = false;
  }
  public cancel() {
    this.sessionStorageService.remove('person');
    this.router.navigate(['/patient-dashboard/patient-search']);
    this.errors = false;
  }
  public ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe);
  }

  public generatePatientIdentifier() {
    this.patientCreationService.generateIdentifier(this.userId).pipe(take(1)).subscribe((data: any) => {
      this.patientIdentifier = data.identifier;
      this.generate = false;
      this.editText = true;
    });
    this.errorAlert = false;
  }

  public updateLocation(location) {
    if (location === 'Other') {
      this.others = true;
      this.address1 = '';
    } else {
      this.others = false;
    }
  }

  public loadProgramManager(createdPatient) {
    this.modalRef.hide();
    this.router.navigate(['/patient-dashboard/patient/' + createdPatient.person.uuid +
      '/general/general/program-manager/new-program']);
  }


  private checkAdded() {

    let found;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.identifiers.length; i++) {
      if (this.identifiers[i].identifierType === this.patientIdentifierType.val) {
        found = true;
        break;
      }
    }
    if (found !== undefined) {
      return found;
    }
  }

  private checkUniversal() {

    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.identifiers.length; i++) {
      if (this.identifiers[i].identifierType === this.universal.identifierType) {
        found = true;
        break;
      }
    }
    return found;
  }

  private getCommonIdentifierTypes() {
    this.patientIdentifierTypeResService.getPatientIdentifierTypes().pipe(take(1)).subscribe(
      (data) => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === 'AMRS Universal ID') {
            this.universal = {
              identifierType: data[i].uuid,
              identifierTypeName: data[i].name
            };
          } else {
            this.commonIdentifierTypes.push({
              val: data[i].uuid,
              label: data[i].name
            });
          }

          if (data[i].uuid === '58a47054-1359-11df-a1f1-0026b9348838') {
            this.commonIdentifierTypeFormats[data[i].uuid] = {
              format: '^[0-9]*$',
              checkdigit: data[i].checkDigit
            };
          } else {
            this.commonIdentifierTypeFormats[data[i].uuid] = {
              format: data[i].format,
              checkdigit: data[i].checkDigit
            };
          }

        }

      },
      () => {
        this.toastrService.error('Error  retrieving common patient identifier types', '', {
          timeOut: 2000,
          positionClass: 'toast-bottom-center'
        });
      });
  }

  private getLocations(): void {
    this.locationResourceService.getLocations().pipe(take(1)).subscribe(
      (locations: any[]) => {
        this.locations = [];
        const counties = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < locations.length; i++) {
          this.locations.push({ label: locations[i].name, value: locations[i].uuid });
          counties.push(locations[i].stateProvince);
        }
        this.counties = _.uniq(counties);
        this.counties = _.remove(this.counties, (n) => {
          return n !== null || n === '';
        });
        this.counties.push('Other');
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  public getAmpathLocations() {
    const getLocationsSubscription = this.locationResourceService.getAmpathLocations().subscribe(arg => {
      this.ampathLocations = arg;
    });
    this.subscriptions.push(getLocationsSubscription);
  }
  private validateFormFields(patientIdentifier) {

    if (this.isNullOrUndefined(patientIdentifier)) {
      this.setErroMessage('Patient identifier is required!');
      return false;
    }

    return true;
  }

  private isNullOrUndefined(val) {
    return val === null || val === undefined || val === ''
      || val === 'null' || val === 'undefined';
  }

  private checkIdentifierFormat() {
    this.isValidIdentifier = false;
    this.identifierValidity = '';
    const identifierType = this.patientIdentifierType;
    const identifierTypeSpecifiedFormat = this.patientCreationService.getIdentifierTypeFormat(
      (identifierType as any).val);
    let identifierHasCheckDigit = null;
    let identifierHasRegex = null;

    if (identifierTypeSpecifiedFormat.length > 0) {
      identifierHasRegex = identifierTypeSpecifiedFormat[0].format;
      identifierHasCheckDigit = identifierTypeSpecifiedFormat[0].checkdigit;
      if (identifierHasCheckDigit) {
        this.checkLuhnCheckDigit();
        return;
      }
      if (identifierHasRegex) {
        this.isValidIdentifier =
          this.patientCreationService.checkRegexValidity(identifierHasRegex,
            this.commonIdentifier);
        if (this.isValidIdentifier === false) {
          this.identifierValidity = 'Invalid Identifier Format. {' + identifierHasRegex + '}';
        }
        return;
      }

    } else {
      this.isValidIdentifier = true;
    }

  }

  private checkLuhnCheckDigit() {
    const checkDigit = this.commonIdentifier.split('-')[1];
    const expectedCheckDigit =
      this.patientCreationService.getLuhnCheckDigit(this.commonIdentifier.split('-')[0]);
    if (checkDigit === 'undefined' || checkDigit === undefined) {
      this.identifierValidity = 'Invalid Check Digit';
    }

    if (expectedCheckDigit === parseInt(checkDigit, 10)) {

      this.isValidIdentifier = true;
    } else {
      this.identifierValidity = 'Invalid Check Digit';
    }

  }

  private setErroMessage(message) {

    this.hasError = true;
    this.errorMessage = message;
  }

  private calculateAge(age) {

    const baseYear = 1970;
    const thisYear = new Date().getFullYear();
    let date;

    const yearDiff = thisYear - age;

    if (yearDiff < baseYear) {
      date = (baseYear - yearDiff) * -31556926000;
    } else {
      date = (yearDiff - baseYear) * 31556926000;
    }

    const estimateDate = new Date(date).toISOString();

    return estimateDate;
  }
  public setCounty(event) {
    this.address1 = event;
    const counties1 = this.ampathLocations.counties;
    this.subcounties = counties1.find(county => county.name === event).subcounties;
  }
  public setSubCounty(event) {
    this.address2 = event;
    const subcounties = this.subcounties;
    this.wards = subcounties.find(subcounty => subcounty.name === event).wards;
  }
  public setWard(event) {
    this.address7 = event;
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
