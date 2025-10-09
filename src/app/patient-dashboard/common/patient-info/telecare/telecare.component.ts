import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';

@Component({
  selector: 'telecare-consent',
  templateUrl: './telecare.component.html',
  styleUrls: ['./telecare.component.css']
})
export class TelecareComponent implements OnInit, OnDestroy {
  public clientConsent: any = {};
  public conceptUuid: any = [];
  public consentExist = false;
  public patientUuid: any = '';
  public subscription: Subscription;
  constructor(
    private obsService: ObsResourceService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatientUuid.subscribe(
      (uuid) => {
        this.patientUuid = uuid;
        this.getClientConsent();
      }
    );
  }
  getClientConsent() {
    this.conceptUuid = [
      '9d9ccb6b-73ae-48dd-83f9-12c782ce6685',
      'a8a06fc6-1350-11df-a1f1-0026b9348838',
      'bd3af665-2423-4beb-a383-0e823f2450d0',
      '8873d881-6ad3-46e6-a558-b97d51d15e01',
      '4e1a9d59-3d06-47eb-82a7-30410db249e4'
    ];
    const telecareEncounter = '5a58f6f5-f5a6-47eb-a644-626abd83f83b';
    this.subscription = this.obsService
      .getObsPatientObsByConcepts(this.patientUuid, this.conceptUuid)
      .subscribe((data) => {
        const results = data['results'];
        if (results.length > 0) {
          const encDateTime = results[0].encounter.encounterDatetime;
          this.clientConsent.dateofConsent = moment(encDateTime).format(
            'DD-MM-YYYY HH-mm'
          );
          this.clientConsent.encounterUuid = results[0].encounter.uuid;
          results.forEach((element) => {
            if (
              element &&
              element.encounter &&
              element.encounter.encounterDatetime === encDateTime
            ) {
              if (this.conceptUuid.includes(element.concept.uuid)) {
                if (element.concept.uuid === this.conceptUuid[0]) {
                  this.clientConsent.value = element.value;
                  if (element.value.display === 'NO') {
                    this.clientConsent.styling = 'text-danger';
                  }
                  this.consentExist = true;
                } else if (
                  element.concept.uuid === this.conceptUuid[1] &&
                  element.encounter.encounterType.uuid === telecareEncounter
                ) {
                  this.clientConsent.comments = element.value;
                } else if (
                  element.concept.uuid === this.conceptUuid[2] &&
                  element.encounter.encounterType.uuid === telecareEncounter
                ) {
                  this.clientConsent.expiryofConsent = moment(
                    element.value
                  ).format('DD-MM-YYYY HH-mm');
                } else if (
                  element.concept.uuid === this.conceptUuid[3] &&
                  element.encounter.encounterType.uuid === telecareEncounter
                ) {
                  this.clientConsent.sms = element.value.display;
                } else if (
                  element.concept.uuid === this.conceptUuid[4] &&
                  element.encounter.encounterType.uuid === telecareEncounter
                ) {
                  this.clientConsent.smsTime = moment(element.value).format(
                    'HH:mm'
                  );
                }
              }
            }
          });
        }
      });
  }
  fillConsentForm() {
    if (this.patientUuid === undefined || this.patientUuid === null) {
      return;
    }
    if (this.consentExist) {
      const consentFormUUID = '8b196bad-6ee5-4290-b1be-101539e04290';
      const url = `/patient-dashboard/patient/${this.patientUuid}/general/general/formentry/${consentFormUUID}`;
      this.router.navigate([url], {
        queryParams: {
          encounter: this.clientConsent.encounterUuid,
          visitTypeUuid: ''
        }
      });
    } else {
      this.router.navigate([
        '/patient-dashboard/patient/' +
          this.patientUuid +
          '/general/general/formentry/8b196bad-6ee5-4290-b1be-101539e04290'
      ]);
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
