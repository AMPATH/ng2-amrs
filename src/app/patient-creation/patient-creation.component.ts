import {
  Component,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import 'ag-grid-enterprise/main';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Fuse from 'fuse.js';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, take } from 'rxjs/operators';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Patient } from '../models/patient.model';
import { UserService } from '../openmrs-api/user.service';
import { PatientCreationService } from './patient-creation.service';
import { PatientCreationResourceService } from '../openmrs-api/patient-creation-resource.service';
import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { PatientIdentifierTypeResService } from '../openmrs-api/patient-identifierTypes-resource.service';
import { ConceptResourceService } from './../openmrs-api/concept-resource.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { PatientRelationshipTypeService } from '../patient-dashboard/common/patient-relationships/patient-relation-type.service';
import { PatientEducationService } from '../etl-api/patient-education.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { LocalStorageService } from './../utils/local-storage.service';
import { LocationUnitsService } from './../etl-api/location-units.service';
import { FormControl } from '@angular/forms';

/**
 * ADDRESS MAPPINGS
 * country: country
 * address10: county of birth
 * address1: current county
 * address2: sub county
 * cityVillage: village
 * address7: ward
 * address3: landmark
 * address8: current address
 */
@Component({
  selector: 'patient-creation',
  templateUrl: './patient-creation.component.html',
  styleUrls: ['./patient-creation.component.css']
})
export class PatientCreationComponent implements OnInit, OnDestroy {
  @Output() public patientSelected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('successModal') public successModal: BsModalRef;
  @ViewChild('confirmModal') public confirmModal: BsModalRef;
  @ViewChild('verificationModal') public verificationModal: BsModalRef;

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
  public patientObsGroupId: string;

  public address1: string;
  public address2: string;
  public address3: string;
  public cityVillage: string;
  public ward: string;
  public longitude: string;
  public latitude: string;
  public stateProvince: string;
  public nonCodedCounty = false;

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
  public verificationIdentifierTypes: any = [];
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
  public universal: UniversalID = {};
  public generate = true;
  public preferredIdentifier;
  public errorAlerts = [];
  public occupationConceptUuid = 'a8a0a00e-1350-11df-a1f1-0026b9348838';
  public maritalStatusConceptUuid = 'a899a9f2-1350-11df-a1f1-0026b9348838';
  public religionConceptUuid = 'a8b03352-1350-11df-a1f1-0026b9348838';
  public occupationAttributeTypeUuid = '9e86409f-9c20-42d0-aeb3-f29a4ca0a7a0';
  public idNumberVerified = '134eaf8a-b5aa-4187-85a6-757dec1ae72b';
  public occupations = [];
  public maritalStatus = [];
  public maritalStatusVal: string;
  public religionOptions = [];
  public religionVal: string;
  public occupationConcept: any;
  public religionConcept: any;
  public maritalStatusConcept: any;
  public occupation: any;
  public highestEducationConcept = 'a89e48ae-1350-11df-a1f1-0026b9348838';
  public careGivername: any;
  public relationshipToCareGiver: any;
  public careGiverPhoneNumber: any;
  public ampathLocations: any;
  public subCounties: any = [];
  public wards: any = [];
  public address7: any;
  public patientRelationshipTypes: any = [];
  public selectedRelationshipType: any;
  public attributes: any;
  public ids: any;
  public uniqueIds: any;
  public patientToUpdate: string;
  public createDataExists = 0;
  public crpObject: any;
  public unsavedUpi: string;
  public editMode = 0;
  public hasIds = false;
  public administrativeUnits: any;
  public nCounties: any = [];
  public address10: string;
  public country = 'Kenya';
  public countrySearchParam = { value: 'KE', label: 'Kenya' };
  public residenceAddress: string;
  public updateOperation = 0;
  public isNewPatient = 1;
  public searchResult = '';
  public verificationFacility = '';
  public email: string;
  public kinName: string;
  public kinRelationship: string;
  public kinResidence: string;
  public successText = 'You have successfully registered the patient';
  myControl = new FormControl('');
  options: string[] = [];
  public countries: any = [];
  public countrySuggest: Subject<any> = new Subject();

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
    private patientEducationService: PatientEducationService,
    private patientResourceService: PatientResourceService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private locationUnitsService: LocationUnitsService
  ) {}

  public ngOnInit() {
    this.locationUnitsService.getAdministrativeUnits().subscribe((arg) => {
      this.administrativeUnits = arg;
      this.nCounties = arg;
      this.setUpCountryTypeAhead();
      this.locationResourceService.getCountries().subscribe((r) => {
        this.countries = r;
        this.populateFormData(null);
      });
    });

    this.verificationIdentifierTypes = this.patientIdentifierTypeResService.patientVerificationIdentifierTypeFormat();

    this.getLocations();
    this.getCommonIdentifierTypes();
    this.getOccupationConcept();
    this.getMaritalStatusConcept();
    this.getReligionConcept();
    this.getEducationLevels();
    this.getRelationshipTypes();
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
    const patientCreationSub = this.patientCreationService
      .getpatientResults()
      .pipe(take(1))
      .subscribe((res) => {
        if (res.length > 0) {
          this.patientResults = res;
          this.found = true;
        }
      });
    this.loadNewPatientInfoFromUrl();
    this.subscriptions.push(patientCreationSub);

    const mode = this.route.snapshot.paramMap.get('editMode');
    if (!mode) {
      this.sessionStorageService.remove('CRPatient');
    }
    if (mode === '1') {
      this.isNewPatient = 0;
      this.patientExists = false;
      this.editMode = 1;
      this.updateOperation = 1;
    } else if (mode === '2') {
      this.isNewPatient = 0;
      this.updateOperation = 1;
      this.patientExists = false;
      this.editMode = 0;
      this.identifiers.push({
        identifierType: this.route.snapshot.paramMap.get('identifierType'),
        identifier: this.route.snapshot.paramMap.get('identifier'),
        identifierTypeName: this.route.snapshot.paramMap.get('label')
      });
      this.patientToUpdate = this.route.snapshot.paramMap.get('patientUuid');
      // populate fields from saved person details
      this.populateExistingData(this.patientToUpdate);
    } else {
      this.updateOperation = 0;
    }
    const crpData = this.sessionStorageService.getObject('CRPatient');
    if (crpData != null) {
      if (this.uniqueIds && this.uniqueIds.length === 2) {
        this.hasIds = true;
      }
    }
  }

  public setUpCountryTypeAhead() {
    this.countrySuggest
      .pipe(
        debounceTime(350),
        switchMap((term: string) => {
          return this.counties.filter((c) => c.label === term);
        })
      )
      .subscribe((data) => this.processCountries(data));
  }

  public processCountries(data) {
    this.countries = _.filter(data, (p: any) => !_.isNil(p.label));
  }

  public populateExistingData(uuid: string) {
    this.patientResourceService.getPatientByUuid(uuid).subscribe((res) => {
      this.givenName = res.person.preferredName.givenName;
      this.middleName = res.person.preferredName.middleName;
      this.familyName = res.person.preferredName.familyName;
      this.gender = res.person.gender;
      this.birthDate = res.person.birthdate;

      res.person.attributes.forEach((at) => {
        if (at.attributeType.uuid === '72a759a8-1359-11df-a1f1-0026b9348838') {
          this.patientPhoneNumber = at.value;
        }
        if (at.attributeType.uuid === 'c725f524-c14a-4468-ac19-4a0e6661c930') {
          this.alternativePhoneNumber = at.value;
        }
        if (at.attributeType.uuid === 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46') {
          this.partnerPhoneNumber = at.value;
        }
        if (at.attributeType.uuid === '9e86409f-9c20-42d0-aeb3-f29a4ca0a7a0') {
          this.occupation = at.value.uuid;
        }
        if (at.attributeType.uuid === '352b0d51-63c6-47d0-a295-156bebee4fd5') {
          this.patientHighestEducation = at.value.uuid;
        }
        if (at.attributeType.uuid === '2f65dbcb-3e58-45a3-8be7-fd1dc9aa0faa') {
          this.email = at.value;
        }
        if (at.attributeType.uuid === '4ae16101-cfba-4c08-9c9c-d848e6f609aa') {
          this.religionVal = at.value.uuid;
        }
        if (at.attributeType.uuid === '8d871f2a-c2cc-11de-8d13-0010c6dffd0f') {
          this.maritalStatusVal = at.value.uuid;
        }
        if (at.attributeType.uuid === '72a75bec-1359-11df-a1f1-0026b9348838') {
          this.kinName = at.value;
        }
        if (at.attributeType.uuid === 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d') {
          this.nextofkinPhoneNumber = at.value;
        }
        if (at.attributeType.uuid === 'f38bd1be-c54c-4863-8497-3670292881eb') {
          this.kinResidence = at.value;
        }
        if (at.attributeType.uuid === '48876f06-7493-416e-855d-8413d894ea93') {
          this.careGivername = at.value;
        }
        if (at.attributeType.uuid === '06b0da36-e133-4be6-aec0-31e7ed0e1ac2') {
          this.relationshipToCareGiver = at.value;
        }
        if (at.attributeType.uuid === '5730994e-c267-426b-87b6-c152b606973d') {
          this.kinRelationship = at.value;
        }
        if (at.attributeType.uuid === 'bb8684a5-ac0b-4c2c-b9a5-1203e99952c2') {
          this.careGiverPhoneNumber = at.value;
        }
      });
    });
  }

  public populateFormData(data: any) {
    let crp: any;
    if (data == null) {
      crp = this.sessionStorageService.getObject('CRPatient');
      if (crp != null) {
        this.editMode = 1;
      } else {
        this.editMode = 0;
      }
    } else {
      crp = data;
      if (crp != null) {
        this.editMode = 1;
        this.createDataExists = 1;
      } else {
        this.editMode = 0;
      }
    }

    if (crp != null) {
      this.givenName = crp.firstName;
      this.middleName = crp.middleName;
      this.familyName = crp.lastName;
      if (crp.gender === 'female') {
        this.gender = 'F';
      } else if (crp.gender === 'male') {
        this.gender = 'M';
      }

      this.religionVal = crp.religion;
      this.maritalStatusVal = crp.maritalStatus;
      this.ageEstimate = this.getAge(crp.dateOfBirth);
      this.birthDate = new Date(crp.dateOfBirth);
      this.patientPhoneNumber = crp.contact.primaryPhone;
      this.alternativePhoneNumber = crp.contact.secondaryPhone;
      this.email = crp.contact.emailAddress;
      this.cityVillage = crp.residence.village;
      this.address3 = crp.residence.landMark;
      this.residenceAddress = crp.residence.address;
      if (crp.nextOfKins.length > 0) {
        this.kinName = crp.nextOfKins[0].name;
        this.nextofkinPhoneNumber = crp.nextOfKins[0].contact.primaryPhone;
        this.kinResidence = crp.nextOfKins[0].residence;
      }

      this.uniqueIds = crp.localIds;
      if (this.identifiers.length === 0) {
        crp.localIds.forEach((id) => {
          this.identifiers.push({
            identifier: id.identifier,
            identifierType: id.identifierType,
            identifierTypeName: id.label
          });
        });
      }
      this.patientToUpdate = crp.uuid;

      if (crp.country != null) {
        const savedCountry = this.countries.filter(
          (r) => r.value === crp.country
        );

        this.country = savedCountry[0].label;
      }

      if (crp.countyOfBirth != null) {
        const cob = this.nCounties.filter((c) => c.value === crp.countyOfBirth);
        this.address10 = cob[0].label;
      }

      if (crp.residence.county != null && crp.residence.subCounty != null) {
        const cr = this.nCounties.filter(
          (c) => c.value === crp.residence.county
        );

        this.address1 = cr[0].label;
        this.subCounties = cr[0].children;

        const sr = this.subCounties.filter((d) => {
          return d.value === crp.residence.subCounty.toLowerCase();
        });
        this.address2 = sr[0].label;

        if (crp.residence.ward != null) {
          this.wards = sr[0].children;
          const wr = this.wards.filter(
            (c) => c.value === crp.residence.subCounty.toLowerCase()
          );
          if (wr.length > 0) {
            this.ward = wr[0].label;
          }
        }
      }
    }
  }

  public searchNewPatient() {
    this.resetForm();
    this.patientCreationResourceService
      .searchRegistry(
        this.patientIdentifierType.val,
        this.commonIdentifier.toString(),
        this.countrySearchParam.value
      )
      .subscribe(
        (data: any) => {
          const ids = [];
          const searchIdValue = this.commonIdentifier;
          if (data.clientExists) {
            this.patientExists = false;
            this.createDataExists = 1;
            this.unsavedUpi = data.client.clientNumber;
            ids.push({
              identifierType: this.patientIdentifierType.val,
              label: this.patientIdentifierType.label,
              identifier: this.commonIdentifier.toString(),
              location: this.identifierLocation,
              preferred: false
            });

            ids.push({
              identifierType: 'cba702b9-4664-4b43-83f1-9ab473cbd64d',
              label: 'UPI Number',
              identifier: this.unsavedUpi,
              location: this.identifierLocation,
              preferred: false
            });

            this.uniqueIds = ids;

            data.client.localIds = ids;
            data.client.uuid = this.patients.person.uuid;
            this.populateFormData(data.client);
            this.searchResult = `This ID number (${searchIdValue}) was used to verify ${
              this.givenName
            } ${this.middleName} ${this.familyName} of DOB ${moment(
              this.birthDate
            ).format(
              'DD/MM/YYYY'
            )}. If this name is different from what is in the ID URGENTLY contact system support`;
          } else {
            this.identifiers.push({
              identifierType: this.patientIdentifierType.val,
              identifierTypeName: this.patientIdentifierType.label,
              identifier: this.commonIdentifier.toString(),
              location: this.identifierLocation,
              preferred: false
            });
            this.searchResult = 'PATIENT NOT FOUND, Proceed with registration';
            this.verificationFacility = '';
            this.createDataExists = 0;
          }
          this.modalRef = this.modalService.show(this.verificationModal, {
            backdrop: 'static',
            keyboard: false
          });
        },
        (err) => {
          this.createDataExists = 0;
          console.log('Error', err);
        }
      );
  }

  public openUserFeedback() {
    this.router.navigate(['/feed-back']);
    this.modalRef.hide();
  }

  public loadNewPatientInfoFromUrl() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.givenName = params.givenName ? params.givenName : '';
          this.familyName = params.familyName ? params.familyName : '';
          this.middleName = params.middleName ? params.middleName : '';
          this.ageEstimate = params.age ? params.age : '';
          this.birthDate = params.dateOfBirth ? params.dateOfBirth : '';
          this.gender = params.gender ? params.gender : '';
          this.patientObsGroupId = params.obs_group_id
            ? params.obs_group_id
            : '';
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  public getEducationLevels() {
    this.setHighestEducationLevels(
      this.patientEducationService.getEducationLevels()
    );
  }

  public setHighestEducationLevels(
    educationLevels: Array<{ uuid: string; display: string }>
  ) {
    this.levelOfEducation = educationLevels.map((levels) => {
      return {
        value: levels.uuid,
        name: levels.display
      };
    });
  }

  public getReligionConcept() {
    this.conceptService
      .getConceptByUuid(this.religionConceptUuid)
      .subscribe((concept: any) => {
        if (concept) {
          this.religionConcept = concept;
          this.setReligionOptions(concept.answers);
        }
      });
  }

  public setReligionOptions(religion) {
    this.religionOptions = religion.map((r: any) => {
      return {
        val: r.uuid,
        label: r.display
      };
    });
  }

  public getMaritalStatusConcept() {
    this.conceptService
      .getConceptByUuid(this.maritalStatusConceptUuid)
      .subscribe((concept: any) => {
        if (concept) {
          this.maritalStatusConcept = concept;
          this.setMaritalStatusOptions(concept.answers);
        }
      });
  }

  public setMaritalStatusOptions(status) {
    this.maritalStatus = status.map((s: any) => {
      return {
        val: s.uuid,
        label: s.display
      };
    });
  }

  public getOccupationConcept() {
    this.conceptService
      .getConceptByUuid(this.occupationConceptUuid)
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
        val: occupation.uuid,
        label: occupation.display
      };
    });
  }

  public updateBirthDate(birthDate) {
    this.disable = true;
    this.birthDate = birthDate;
    this.ageEstimate = this.getAge(this.birthDate);

    if (moment(this.birthDate).isAfter(new Date())) {
      this.birthError = 'Birth date cannot be in the future!';
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
        birthdateEstimated: this.birthdateEstimated
      };
      this.sessionStorageService.setObject('person', this.person);
      const searchString = this.givenName + ' ' + this.familyName;
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
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patient.uuid +
        '/general/general/patient-info'
    ]);
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
    } else if (
      this.validateFormFields(commonIdentifier) &&
      this.isValidIdentifier
    ) {
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

  public commonPersonCreationLogic() {
    this.loaderStatus = false;
    this.errors = false;
    const ids = [];
    this.successAlert = '';
    if (!this.checkUniversal() && this.isNewPatient === 1) {
      this.identifierAdded = false;
      this.errors = true;
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
    if (!this.patientIdentifier && this.isNewPatient === 1) {
      this.errors = true;
    }
    if (!this.identifierLocation) {
      this.errors = true;
    }
    if (this.commonIdentifier && !this.commonAdded && this.isNewPatient === 1) {
      this.errors = true;
    }
    if (!this.selectedLocation && this.isNewPatient === 1) {
      this.errors = true;
    }
    if (!this.country) {
      this.errors = true;
    }
    if (!this.address1) {
      this.errors = true;
    }
    if (!this.address2) {
      this.errors = true;
    }
    if (!this.cityVillage) {
      this.errors = true;
    }
    if (!this.patientPhoneNumber) {
      this.errors = true;
    }
    if (
      this.identifiers.length > 1 &&
      !this.preferredIdentifier &&
      this.isNewPatient === 1
    ) {
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
      if (this.unsavedUpi != null) {
        ids.push({
          identifierType: 'cba702b9-4664-4b43-83f1-9ab473cbd64d',
          identifier: this.unsavedUpi,
          location: this.identifierLocation,
          preferred: false
        });
      }
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

      this.ids = ids;
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
          value: this.occupation,
          attributeType: this.occupationAttributeTypeUuid
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

      if (
        ids.find(
          (x) =>
            x.identifierType === '58a47054-1359-11df-a1f1-0026b9348838' ||
            x.identifierType === 'ced014a1-068a-4a13-b6b3-17412f754af2' ||
            x.identifierType === '7924e13b-131a-4da8-8efa-e294184a1b0d'
        )
      ) {
        console.log('Idexists');
        attributes.push({
          value: true,
          attributeType: '134eaf8a-b5aa-4187-85a6-757dec1ae72b'
        });
      }

      if (this.email) {
        attributes.push({
          value: this.email,
          attributeType: '2f65dbcb-3e58-45a3-8be7-fd1dc9aa0faa'
        });
      }
      if (this.religionVal) {
        attributes.push({
          value: this.religionVal,
          attributeType: '4ae16101-cfba-4c08-9c9c-d848e6f609aa'
        });
      }
      if (this.maritalStatusVal) {
        attributes.push({
          value: this.maritalStatusVal,
          attributeType: '8d871f2a-c2cc-11de-8d13-0010c6dffd0f'
        });
      }
      if (this.kinName) {
        attributes.push({
          value: this.kinName,
          attributeType: '72a75bec-1359-11df-a1f1-0026b9348838'
        });
      }

      if (this.kinRelationship) {
        attributes.push({
          value: this.kinRelationship,
          attributeType: '5730994e-c267-426b-87b6-c152b606973d'
        });
      }
      if (this.kinResidence) {
        attributes.push({
          value: this.kinResidence,
          attributeType: 'f38bd1be-c54c-4863-8497-3670292881eb'
        });
      }

      this.attributes = attributes;
      this.ids = ids;
    }
  }

  public createPatient() {
    this.commonPersonCreationLogic();
    const payload = {
      person: {
        names: [
          {
            givenName: this.givenName,
            middleName: this.middleName,
            familyName: this.familyName
          }
        ],
        gender: this.gender,
        birthdate: this.birthDate,
        birthdateEstimated: this.birthdateEstimated,
        attributes: this.attributes,
        addresses: [
          {
            address1: this.address1,
            country: this.country,
            address2: this.address2,
            cityVillage: this.cityVillage,
            address7: this.ward,
            address10: this.address10,
            address3: this.address3,
            address8: this.residenceAddress,
            latitude: this.latitude,
            longitude: this.longitude
          }
        ]
      },
      identifiers: this.ids
    };
    this.errorAlerts = [];
    this.commonIdentifier = '';
    if (!this.errors) {
      const savePatientSub = this.patientCreationResourceService
        .savePatient(payload)
        .pipe(take(1))
        .subscribe(
          (success) => {
            this.loaderStatus = false;
            this.sessionStorageService.remove('person');
            this.createdPatient = success;
            const patientResult: any = success;
            if (
              !payload.identifiers.find(
                (x) =>
                  x.identifierType === 'cba702b9-4664-4b43-83f1-9ab473cbd64d'
              )
            ) {
              console.log(
                'Check if MOH no. will be assigned twice during patient creation'
              );
              this.patientCreationResourceService
                .generateUPI(
                  patientResult.person.uuid,
                  this.countrySearchParam.value
                )
                .subscribe(
                  (data) => {
                    console.log('Success data', data);
                  },
                  (err) => {
                    console.log('Error', err);
                  }
                );
            }
            if (this.createdPatient && !this.patientObsGroupId) {
              this.modalRef = this.modalService.show(this.successModal, {
                backdrop: 'static',
                keyboard: false
              });
            } else if (this.patientObsGroupId) {
              const patient: Patient = success as Patient;
              this.patientCreationResourceService
                .updatePatientContact(
                  patient.person.uuid,
                  this.patientObsGroupId
                )
                .subscribe((response) => {
                  this.router.navigate([
                    '/patient-dashboard/patient/' +
                      patient.person.uuid +
                      '/general/general/landing-page'
                  ]);
                });
            }
          },
          (err) => {
            this.loaderStatus = false;
            this.errorAlert = true;
            this.errorAlerts = this.processErrors(err.error);
          }
        );

      this.subscriptions.push(savePatientSub);
    }
  }

  public processErrors(err: string) {
    const m = err.split('[')[1];
    const n = m.split(']')[0];
    const o = n.split(',');

    return o;
  }

  public updateVerify() {
    console.log('UPDATE PATIENT AND SAVE NATIONAL ID AND UPI NO');
    this.commonPersonCreationLogic();
    const payload = {
      person: {
        names: [
          {
            givenName: this.givenName,
            middleName: this.middleName,
            familyName: this.familyName
          }
        ],
        gender: this.gender,
        birthdate: this.birthDate,
        birthdateEstimated: this.birthdateEstimated,
        attributes: this.attributes,
        addresses: [
          {
            address1: this.address1,
            country: this.country,
            address2: this.address2,
            cityVillage: this.cityVillage,
            address7: this.ward,
            address10: this.address10,
            address3: this.address3,
            address8: this.residenceAddress,
            latitude: this.latitude,
            longitude: this.longitude
          }
        ]
      }
    };

    this.errorAlerts = [];

    if (!this.errors) {
      /** Step 1: Update patient registration data */
      const updatePatientSub = this.patientCreationResourceService
        .updateExistingPatient(payload.person, this.patientToUpdate)
        .pipe(take(1))
        .subscribe(
          (result: any) => {
            /** Step 2: Update patient identifiers */
            const idSize = this.identifiers.length;
            let count = 0;
            this.identifiers.forEach((e) => {
              const id = {
                identifier: e.identifier,
                location: this.identifierLocation,
                identifierType: e.identifierType
              };

              this.patientResourceService
                .saveUpdatePatientIdentifier(this.patientToUpdate, '', id)
                .subscribe((res) => {
                  count++;
                  if (idSize === count) {
                    this.createdPatient = result;
                    this.successText =
                      'You have successfully updated the patient';
                    this.modalRef = this.modalService.show(this.successModal, {
                      backdrop: 'static',
                      keyboard: false
                    });
                  }
                });
            });

            /** Step 3: If UPI number is not part of identifiers, invoke verification service */
            if (
              !this.identifiers.find(
                (x) =>
                  x.identifierType === 'cba702b9-4664-4b43-83f1-9ab473cbd64d'
              )
            ) {
              console.log(
                'Only invoked if patient not in registry, missing UPI'
              );
              this.patientCreationResourceService
                .generateUPI(this.patientToUpdate)
                .subscribe(
                  (data) => {
                    console.log('Success data', data);
                  },
                  (err) => {
                    console.log('Error', err);
                  }
                );
            }
          },
          (err) => {
            this.loaderStatus = false;
            this.errorAlert = true;
            this.errorAlerts = this.processErrors(err.error);
          }
        );

      this.subscriptions.push(updatePatientSub);
    }
  }

  public loadDashboard(createdPatient) {
    this.modalRef.hide();
    this.router.navigate([
      '/patient-dashboard/patient/' +
        createdPatient.person.uuid +
        '/general/general/patient-info'
    ]);
    this.errorAlert = false;
  }

  public close() {
    this.modalRef.hide();
    this.router.navigate(['/patient-dashboard/patient-search']);
    this.errorAlert = false;
  }

  public closeVerification() {
    this.modalRef.hide();
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
    this.sessionStorageService.remove('CRPatient');
    this.errors = false;
  }

  public cancel() {
    this.sessionStorageService.remove('person');
    this.router.navigate(['/patient-dashboard/patient-search']);
    this.errors = false;
  }

  public ngOnDestroy() {
    this.subscriptions.map((sub) => sub.unsubscribe);
  }

  public generatePatientIdentifier() {
    this.patientCreationService
      .generateIdentifier(this.userId)
      .pipe(take(1))
      .subscribe((data: any) => {
        this.patientIdentifier = data.identifier;
        this.generate = false;
        this.editText = true;
      });
    this.errorAlert = false;
  }

  public updateLocation(location) {
    if (location === 'Other') {
      this.nonCodedCounty = true;
      this.address1 = '';
    } else {
      this.nonCodedCounty = false;
    }
  }

  public loadProgramManager(createdPatient) {
    this.modalRef.hide();
    this.router.navigate([
      '/patient-dashboard/patient/' +
        createdPatient.person.uuid +
        '/general/general/program-manager/new-program'
    ]);
  }

  private getPatientIdentifiers() {
    this.patientCreationResourceService
      .getPatientIdentifierTypes()
      .pipe(take(1))
      .subscribe((data) => {
        this.patientIdentifierTypes = data;
      });
  }

  private checkAdded(): boolean {
    let found;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.identifiers.length; i++) {
      if (
        this.identifiers[i].identifierType === this.patientIdentifierType.val
      ) {
        found = true;
        break;
      }
    }
    if (found !== undefined) {
      return found;
    }
  }

  private checkUniversal(): boolean {
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.identifiers.length; i++) {
      if (
        this.identifiers[i].identifierType === this.universal.identifierType
      ) {
        found = true;
        break;
      }
    }
    return found;
  }

  private getCommonIdentifierTypes() {
    this.patientIdentifierTypeResService
      .getPatientIdentifierTypes()
      .pipe(take(1))
      .subscribe(
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
          this.toastrService.error(
            'Error retrieving common patient identifier types',
            '',
            {
              timeOut: 2000,
              positionClass: 'toast-bottom-center'
            }
          );
        }
      );
  }

  private getLocations() {
    const locationResourceServiceSub = this.locationResourceService
      .getLocations()
      .pipe(take(1))
      .subscribe(
        (locations: any[]) => {
          this.locations = [];
          const counties = [];
          for (const location of locations) {
            this.locations.push({
              label: location.name,
              value: location.uuid
            });
            counties.push(location.stateProvince);
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

    this.subscriptions.push(locationResourceServiceSub);
  }

  public getAmpathLocations() {
    const getLocationsSubscription = this.locationResourceService
      .getAmpathLocations()
      .subscribe((arg) => {
        this.ampathLocations = arg;
      });
    this.subscriptions.push(getLocationsSubscription);
  }

  private validateFormFields(patientIdentifier): boolean {
    if (this.isNullOrUndefined(patientIdentifier)) {
      this.setErroMessage('Patient identifier is required!');
      return false;
    }

    return true;
  }

  private isNullOrUndefined(val): boolean {
    return (
      val === null ||
      val === undefined ||
      val === '' ||
      val === 'null' ||
      val === 'undefined'
    );
  }

  private checkIdentifierFormat() {
    this.isValidIdentifier = false;
    this.identifierValidity = '';
    const identifierType = this.patientIdentifierType;
    const identifierTypeSpecifiedFormat = this.patientCreationService.getIdentifierTypeFormat(
      (identifierType as any).val
    );
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
        this.isValidIdentifier = this.patientCreationService.checkRegexValidity(
          identifierHasRegex,
          this.commonIdentifier
        );
        if (this.isValidIdentifier === false) {
          this.identifierValidity =
            'Invalid Identifier Format. {' + identifierHasRegex + '}';
        }
        return;
      }
    } else {
      this.isValidIdentifier = true;
    }
  }

  private checkLuhnCheckDigit() {
    const checkDigit = this.commonIdentifier.split('-')[1];
    const expectedCheckDigit = this.patientCreationService.getLuhnCheckDigit(
      this.commonIdentifier.split('-')[0]
    );
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

  private calculateAge(age): string {
    const baseYear = 1970;
    const thisYear = new Date().getFullYear();
    const yearDiff = thisYear - age;
    let date;

    if (yearDiff < baseYear) {
      date = (baseYear - yearDiff) * -31556926000;
    } else {
      date = (yearDiff - baseYear) * 31556926000;
    }

    const estimateDate = new Date(date).toISOString();
    return estimateDate;
  }

  public setCountrySearch(event) {
    this.countrySearchParam = event;
  }

  public setCountry(event) {
    this.country = event;
    this.address1 = '';
    this.address2 = '';
    this.ward = '';
  }

  public setCountyOfBirth(event) {
    this.address10 = event;
  }

  public setCounty(event) {
    this.address2 = '';
    this.ward = '';
    this.address1 = event;
    const counties1 = this.nCounties;
    this.subCounties = counties1.find(
      (county) => county.label === event
    ).children;
  }

  public setSubCounty(event) {
    this.ward = '';
    this.address2 = event;
    const subCounties = this.subCounties;
    this.wards = subCounties.find(
      (subCounty) => subCounty.label === event
    ).children;
  }

  public setWard(event) {
    this.ward = event;
  }

  public getRelationshipTypes() {
    const request = this.patientRelationshipTypeService.getRelationshipTypes();
    request.subscribe(
      (relationshipTypes) => {
        if (relationshipTypes) {
          this.patientRelationshipTypes = relationshipTypes;
        }
      },
      (error) => {
        console.error(
          'Failed to get relation types because of the following ',
          error
        );
      }
    );
  }

  public resetForm() {
    this.givenName = '';
    this.middleName = '';
    this.familyName = '';
    this.gender = '';
    this.religionVal = '';
    this.maritalStatusVal = '';
    this.ageEstimate = null;
    this.birthDate = null;
    this.patientPhoneNumber = null;
    this.alternativePhoneNumber = null;
    this.email = '';
    this.cityVillage = '';
    this.address3 = '';
    this.residenceAddress = '';
    this.kinName = '';
    this.nextofkinPhoneNumber = null;
    this.kinResidence = '';
    this.identifiers = [];
    this.patientToUpdate = '';
    this.country = '';
    this.address10 = '';
    this.address1 = '';
    this.address2 = '';
    this.ward = '';
    this.occupation = '';
    this.patientHighestEducation = '';
    this.patientIdentifier = '';
    this.kinRelationship = '';
    this.careGivername = '';
    this.relationshipToCareGiver = '';
    this.latitude = '';
    this.longitude = '';
    this.careGiverPhoneNumber = '';
    this.selectedLocation = '';
    this.partnerPhoneNumber = null;
  }
}

interface UniversalID {
  identifier?: string;
  identifierType?: string;
  identifierTypeName?: string;
}
