import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';

@Component({
  selector: 'project-beyond-consent',
  templateUrl: './project-beyond.component.html',
  styleUrls: ['./project-beyond.component.css']
})
export class ProjectBeyondComponent implements OnInit {
  public pbClientConsent: any = {};
  public pbConceptUuid: any = [];
  public pbConsentExist = false;
  public pbPatientUuid: any = '';
  public subscription: Subscription;
  constructor(
    private obsService: ObsResourceService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatientUuid.subscribe(
      (uuid) => {
        this.pbPatientUuid = uuid;
        this.getPBpbClientConsent();
      }
    );
  }
  getPBpbClientConsent() {
    this.pbConceptUuid = [
      'ab4e94d0-7bec-42fc-94c9-8b291d9e91f7',
      '6ef9b8e3-ba2d-4d24-82e4-3afd4ecc3c34',
      '0035c116-31c7-48e3-9479-f9931b3ec3c6',
      'aaff0b06-6436-4ab4-8956-070f5d75d9c8'
    ];
    const projectBeyondEncounter = 'd50d238b-eef5-4225-ba87-2548ae50b269';
    this.subscription = this.obsService
      .getObsPatientObsByConcepts(this.pbPatientUuid, this.pbConceptUuid)
      .subscribe((data) => {
        const results = data['results'];
        console.log('results', results);
        if (results.length > 0) {
          const encDateTime = results[0].encounter.encounterDatetime;
          this.pbClientConsent.dateofConsent = moment(encDateTime).format(
            'DD-MM-YYYY HH-mm'
          );

          this.pbClientConsent.encounterUuid = results[0].encounter.uuid;
          results.forEach((element) => {
            if (element.encounter.encounterDatetime === encDateTime) {
              if (this.pbConceptUuid.includes(element.concept.uuid)) {
                if (element.concept.uuid === this.pbConceptUuid[0]) {
                  this.pbClientConsent.value = element.value;
                  if (element.value.display === 'NO') {
                    this.pbClientConsent.styling = 'text-danger';
                  }
                  this.pbConsentExist = true;
                } else if (
                  element.concept.uuid === this.pbConceptUuid[1] &&
                  element.encounter.encounterType.uuid ===
                    projectBeyondEncounter
                ) {
                  this.pbClientConsent.teleconConsult = element.value.display;
                } else if (
                  element.concept.uuid === this.pbConceptUuid[2] &&
                  element.encounter.encounterType.uuid ===
                    projectBeyondEncounter
                ) {
                  this.pbClientConsent.homevisitConsent = element.value.display;
                } else if (
                  element.concept.uuid === this.pbConceptUuid[3] &&
                  element.encounter.encounterType.uuid ===
                    projectBeyondEncounter
                ) {
                  this.pbClientConsent.deliveryConsent = element.value.display;
                } else if (
                  element.concept.uuid === this.pbConceptUuid[4] &&
                  element.encounter.encounterType.uuid ===
                    projectBeyondEncounter
                ) {
                  this.pbClientConsent.smsTime = moment(element.value).format(
                    'HH:mm'
                  );
                }
              }
            }
          });
        }
      });
  }
  fillPbConsentForm() {
    if (this.pbPatientUuid === undefined || this.pbPatientUuid === null) {
      return;
    }
    if (this.pbConsentExist) {
      const consentFormUUID = '1a12eede-98ca-4691-86d3-bbfb564d45c2';
      const url = `/patient-dashboard/patient/${this.pbPatientUuid}/general/general/formentry/${consentFormUUID}`;
      this.router.navigate([url], {
        queryParams: {
          encounter: this.pbClientConsent.encounterUuid,
          visitTypeUuid: ''
        }
      });
    } else {
      this.router.navigate([
        '/patient-dashboard/patient/' +
          this.pbPatientUuid +
          '/general/general/formentry/1a12eede-98ca-4691-86d3-bbfb564d45c2'
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
