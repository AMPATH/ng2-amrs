import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';

@Component({
  selector: 'otz-consent',
  templateUrl: './otz-consent.component.html',
  styleUrls: ['./otz-consent.component.css']
})
export class OtzConsentComponent implements OnInit {
  public otzClientConsent: any = {};
  public otzConceptUuid: any = [];
  public otzConsentExist = false;
  public otzpatientUuid: any = '';
  public subscription: Subscription;
  constructor(
    private obsService: ObsResourceService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatientUuid.subscribe(
      (uuid) => {
        this.otzpatientUuid = uuid;
        this.getOtzClientConsent();
      }
    );
  }
  getOtzClientConsent() {
    this.otzConceptUuid = ['d6f0f5db-3658-47ae-b84e-13a9bc5a9162'];
    const otzEncounter = 'b832e5b1-eaf6-401b-ba20-a75208087f9f';
    this.subscription = this.obsService
      .getObsPatientObsByConcepts(this.otzpatientUuid, this.otzConceptUuid)
      .subscribe((data) => {
        const results = data['results'];
        if (results.length > 0) {
          const encDateTime = results[0].encounter.encounterDatetime;
          this.otzClientConsent.dateofConsent = moment(encDateTime).format(
            'DD-MM-YYYY HH-mm'
          );
          this.otzClientConsent.encounterUuid = results[0].encounter.uuid;
          results.forEach((element) => {
            if (element.encounter.encounterDatetime === encDateTime) {
              if (this.otzConceptUuid.includes(element.concept.uuid)) {
                if (element.concept.uuid === this.otzConceptUuid[0]) {
                  this.otzClientConsent.value = element.value;
                  if (element.value.display === 'NO') {
                    this.otzClientConsent.styling = 'text-danger';
                  }
                  this.otzConsentExist = true;
                } else if (
                  element.concept.uuid === this.otzConceptUuid[1] &&
                  element.encounter.encounterType.uuid === otzEncounter
                ) {
                  this.otzClientConsent.comments = element.value;
                } else if (
                  element.concept.uuid === this.otzConceptUuid[2] &&
                  element.encounter.encounterType.uuid === otzEncounter
                ) {
                  this.otzClientConsent.expiryofConsent = moment(
                    element.value
                  ).format('DD-MM-YYYY HH-mm');
                } else if (
                  element.concept.uuid === this.otzConceptUuid[3] &&
                  element.encounter.encounterType.uuid === otzEncounter
                ) {
                  this.otzClientConsent.sms = element.value.display;
                } else if (
                  element.concept.uuid === this.otzConceptUuid[4] &&
                  element.encounter.encounterType.uuid === otzEncounter
                ) {
                  this.otzClientConsent.smsTime = moment(element.value).format(
                    'HH:mm'
                  );
                }
              }
            }
          });
        }
      });
  }
  fillOtzConsentForm() {
    if (this.otzpatientUuid === undefined || this.otzpatientUuid === null) {
      return;
    }
    if (this.otzConsentExist) {
      const consentFormUUID = '60f2428f-e998-4efd-81f7-99d793243850';
      const url = `/patient-dashboard/patient/${this.otzpatientUuid}/general/general/formentry/${consentFormUUID}`;
      this.router.navigate([url], {
        queryParams: {
          encounter: this.otzClientConsent.encounterUuid,
          visitTypeUuid: ''
        }
      });
    } else {
      this.router.navigate([
        '/patient-dashboard/patient/' +
          this.otzpatientUuid +
          '/general/general/formentry/60f2428f-e998-4efd-81f7-99d793243850'
      ]);
    }
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
