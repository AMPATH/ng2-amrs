import { Component, OnInit, OnDestroy, ViewEncapsulation, OnChanges, SimpleChanges, Input , TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as Moment from 'moment-mini';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PatientRelationshipService } from '../patient-relationships/patient-relationship.service';
import { Person } from '../../../models/person.model';
import { Relationship } from 'src/app/models/relationship.model';


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
  public searchIdentifiers: object;
  public attributes: any;
  public birthdate;
  public formattedPatientAge;
  private subscription: Subscription;
  private subs = [];
  private patientServiceSubscription: Subscription;
  public relationships: any = [];
  public relationship: Relationship;
  modalRef: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(private patientService: PatientService, private patientRelationshipService: PatientRelationshipService,
    private modalService: BsModalService, private router: Router, private route: ActivatedRoute) { }

  public ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.searchIdentifiers = patient.searchIdentifiers;
          const attributes = patient.person.attributes;
          _.each(attributes, (attribute) => {
            // get the test patient attribute
            if (attribute.attributeType.uuid === '1e38f1ca-4257-4a03-ad5d-f4d972074e69') {
              this.attributes = attribute;
            }
          });

          this.birthdate = Moment(patient.person.birthdate).format('l');
          this.formattedPatientAge = this.getPatientAge(patient.person.birthdate);
          this.getPatientRelationships(patient.uuid);
        } else {
          this.searchIdentifiers = undefined;
          this.birthdate = undefined;
        }
      }
    );
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['patientChanged'].currentValue !== changes['patientChanged'].previousValue) {
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
  public navigateToPatientInfo(patientUuid ) {
    this.modalRef.hide();
    const snapshot = this.router.url;
    // if person in patient info then dont navigate
    const patientInfo = snapshot.indexOf('patient-info');
    this.patientServiceSubscription = this.patientService.setCurrentlyLoadedPatientByUuid(patientUuid).subscribe((patient) => {
        if (patient) {
          if (patientInfo === -1) {
           this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/general/patient-info'], {
            queryParams: {
              scrollSection: 'relationship'
            }
          });
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
    this.patientRelationshipService.getRelationships(patientUuid).pipe(
      take(1)).subscribe((results) => {
        this.relationships = results;
      }, (err) => {
        console.error(err);
      });
  }

}
