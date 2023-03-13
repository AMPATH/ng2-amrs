import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Input,
  TemplateRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PatientRelationshipService } from '../patient-relationships/patient-relationship.service';
import { Person } from '../../../models/person.model';
import { Relationship } from 'src/app/models/relationship.model';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties/user-default-properties.service';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { PersonAttributeResourceService } from './../../../openmrs-api/person-attribute-resource.service';

@Component({
  selector: 'patient-banner',
  templateUrl: './patient-banner.component.html',
  styleUrls: ['./patient-banner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientBannerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public patientChanged: any;
  public showingAddToCohort = false;
  public patient: Patient = new Patient({});
  public searchIdentifiers: any;
  public attributes: any;
  public birthdate;
  public formattedPatientAge;
  private subscription: Subscription;
  private subs = [];
  private patientServiceSubscription: Subscription;
  public relationships: any = [];
  public relationship: Relationship;
  public ovcEnrollment = false;
  public isPatientVerified = false;
  public isPatientForReVerification = false;
  public verificationStatus = false;
  modalRef: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  private enrolled: boolean;
  private enrolledToHEIProgram: boolean;
  private isPatientEnrolledToHIVProgram: boolean;
  private currentLocation: { uuid: string; display: string };
  public familyTestingEncounterUuid: string;
  public displayContacts = false;
  public contactsExist = false;
  public patientEncounters: Array<any> = [];

  constructor(
    private patientService: PatientService,
    private patientRelationshipService: PatientRelationshipService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private propertyLocationService: UserDefaultPropertiesService,
    private familyTestingService: FamilyTestingService,
    private encounterResourceService: EncounterResourceService,
    private personAttributeResourceService: PersonAttributeResourceService
  ) {}

  public ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.searchIdentifiers = patient.searchIdentifiers;
          console.log(this.searchIdentifiers);
          this.getVerificationStatus();
          this.getOvcEnrollments(
            patient.enrolledPrograms,
            patient.person.birthdate
          );
          const attributes = patient.person.attributes;
          _.each(attributes, (attribute) => {
            // get the test patient attribute
            if (
              attribute.attributeType.uuid ===
              '1e38f1ca-4257-4a03-ad5d-f4d972074e69'
            ) {
              this.attributes = attribute;
            }
          });

          this.birthdate = Moment(patient.person.birthdate).format('l');
          this.formattedPatientAge = this.getPatientAge(
            patient.person.birthdate
          );
          this.getPatientRelationships(patient.uuid);
          this.isPatientEligableForCCCNumber(
            _.filter(patient.enrolledPrograms, 'isEnrolled')
          );
          this.isEnrolledToHEIProgram(
            _.filter(patient.enrolledPrograms, 'isEnrolled')
          );
          this.getHIVPatient(_.filter(patient.enrolledPrograms, 'isEnrolled'));
          this.familyTestingService
            .getPatientEncounters(this.patient.uuid)
            .subscribe((response: any) => {
              this.familyTestingEncounterUuid = _.first<any>(response.results);
            });
          this.getPatientEncounters();
        } else {
          this.searchIdentifiers = undefined;
          this.birthdate = undefined;
        }
      }
    );
    this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocation();
  }

  public getVerificationStatus() {
    const verificationStatusUuid = this.patient.uuid;
    this.personAttributeResourceService
      .getPersonAttributesByUuid(verificationStatusUuid)
      .subscribe((res) => {
        const value = res.results.filter((a: any) => {
          return (
            a.attributeType.uuid === '134eaf8a-b5aa-4187-85a6-757dec1ae72b'
          );
        });

        if (value.length > 0 && value[0].value) {
          this.verificationStatus = true;

          if (this.searchIdentifiers.upi === undefined) {
            if (
              this.searchIdentifiers.kenyaNationalId === undefined &&
              this.searchIdentifiers.birthNumber === undefined &&
              this.searchIdentifiers.pid === undefined
            ) {
              this.isPatientVerified = false;
            } else if (
              this.verificationStatus &&
              (this.searchIdentifiers.kenyaNationalId !== undefined ||
                this.searchIdentifiers.birthNumber !== undefined ||
                this.searchIdentifiers.pid !== undefined)
            ) {
              this.isPatientVerified = true;
            }
          } else {
            this.isPatientVerified = true;
          }
        } else {
          if (this.searchIdentifiers.upi === undefined) {
            this.isPatientVerified = false;
          } else {
            this.isPatientVerified = true;
            this.isPatientForReVerification = true;
          }
        }
      });
  }
  // update re-verification patient
  public openRegistrationPage() {
    if (this.isPatientForReVerification) {
      this.router.navigate([
        '/patient-dashboard/patient-search/patient-registration',
        {
          editMode: 3,
          patientUuid: this.patient.person.uuid,
          identifierType: `cba702b9-4664-4b43-83f1-9ab473cbd64d`,
          identifier: this.searchIdentifiers.upi,
          label: 'UPI Number'
        }
      ]);
    } else {
      this.router.navigate([
        '/patient-dashboard/patient-search/patient-registration',
        { editMode: 1 }
      ]);
    }
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (
      changes['patientChanged'].currentValue !==
      changes['patientChanged'].previousValue
    ) {
      this.ngOnInit();
    }
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.patientServiceSubscription) {
      this.patientServiceSubscription.unsubscribe();
    }
  }
  public addToCohort() {
    this.showingAddToCohort = true;
  }

  public onAddingToCohortClosed() {
    this.showingAddToCohort = false;
  }

  public openRelationshipModal(template: TemplateRef<any>, relationship) {
    this.relationship = relationship;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  public closeRelationshipModal() {
    this.relationship = null;
    this.modalRef.hide();
  }
  public navigateToPatientInfo(patientUuid) {
    this.modalRef.hide();
    const snapshot = this.router.url;
    // if person in patient info then dont navigate
    const patientInfo = snapshot.indexOf('patient-info');
    this.patientServiceSubscription = this.patientService
      .setCurrentlyLoadedPatientByUuid(patientUuid)
      .subscribe((patient) => {
        if (patient) {
          if (patientInfo === -1) {
            this.router.navigate(
              [
                '/patient-dashboard/patient/' +
                  patientUuid +
                  '/general/general/patient-info'
              ],
              {
                queryParams: {
                  scrollSection: 'relationship'
                }
              }
            );
          }
        }
      });
  }
  private getPatientAge(birthdate) {
    if (birthdate) {
      const todayMoment: any = Moment();
      const birthDateMoment: any = Moment(birthdate);
      const years = todayMoment.diff(birthDateMoment, 'year');
      birthDateMoment.add(years, 'years');
      const months = todayMoment.diff(birthDateMoment, 'months');
      birthDateMoment.add(months, 'months');
      const days = todayMoment.diff(birthDateMoment, 'days');
      return years + ' y ' + months + ' m ' + days + ' d';
    }
    return null;
  }
  private getPatientRelationships(patientUuid): void {
    this.patientRelationshipService
      .getRelationships(patientUuid)
      .pipe(take(1))
      .subscribe(
        (results) => {
          this.relationships = results;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  private isPatientEligableForCCCNumber(enrolledPrograms: Array<any>) {
    _.filter(
      enrolledPrograms,
      ({ concept }) =>
        concept.uuid === '23e234c3-5d8a-46ca-8465-3b746143dd68' ||
        concept.uuid === '75149ac3-2804-4e84-8220-0861523bbea1' ||
        concept.uuid === '9c64af03-f712-411e-8880-16e98dcdb4a6'
    ).length > 0
      ? (this.enrolled = true)
      : (this.enrolled = false);
  }

  private isEnrolledToHEIProgram(enrolledPrograms: Array<any>) {
    this.enrolledToHEIProgram = enrolledPrograms.some(
      (program) =>
        program.concept.uuid === '9c64af03-f712-411e-8880-16e98dcdb4a6'
    );
  }

  private getHIVPatient(enrolledPrograms: Array<any>) {
    _.filter(enrolledPrograms, ({ baseRoute }) => baseRoute === 'hiv').length >
    0
      ? (this.isPatientEnrolledToHIVProgram = true)
      : (this.isPatientEnrolledToHIVProgram = false);
  }

  private getOvcEnrollments(enrolledPrograms, birthdate) {
    const todayMoment: any = Moment();
    const birthDateMoment: any = Moment(birthdate);
    const years = todayMoment.diff(birthDateMoment, 'year');
    const ovc = enrolledPrograms.filter(
      (program) =>
        program.concept.uuid === 'a89fbb12-1350-11df-a1f1-0026b9348838'
    );
    if (ovc.length > 0 && ovc[0].isEnrolled && years <= 19) {
      this.ovcEnrollment = true;
    }
  }

  /* Family History */
  public navigateToFamilyHistory() {
    if (this.familyTestingEncounterUuid == null) {
      this.contactsExist = false;
      this.displayContacts = true;
    } else {
      this.contactsExist = true;
      this.displayContacts = true;
    }
  }
  public addContacts() {
    const familyPartnerHistoryForm = `3fbc8512-b37b-4bc2-a0f4-8d0ac7955127`;
    const url = `/patient-dashboard/patient/${this.patient.uuid}/general/general/formentry/${familyPartnerHistoryForm}`;
    this.router.navigate([url], {});
    this.displayContacts = false;
  }
  public updateContacts() {
    console.log('this.patient.uuid ', this.patient.uuid);
    const encounterUuid = _.first(this.patientEncounters).uuid;
    const familyPartnerHistoryForm = `3fbc8512-b37b-4bc2-a0f4-8d0ac7955127`;
    const url = `/patient-dashboard/patient/${this.patient.uuid}/general/general/formentry/${familyPartnerHistoryForm}`;
    this.router.navigate([url], {
      queryParams: { encounter: encounterUuid, visitTypeUuid: '' }
    });
    this.displayContacts = false;
  }

  public onClickCancel(val) {
    this.displayContacts = false;
  }

  public getPatientEncounters() {
    const familyAndPartnerTestingFormUuid =
      '3fbc8512-b37b-4bc2-a0f4-8d0ac7955127';
    this.encounterResourceService
      .getEncountersByPatientUuid(this.patient.uuid, false, null)
      .pipe(take(1))
      .subscribe((resp) => {
        this.patientEncounters = resp.reverse().filter((encounter) => {
          if (encounter.form) {
            return encounter.form.uuid === familyAndPartnerTestingFormUuid;
          }
        });
      });
  }
}
