import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'telecare-consent',
  templateUrl: './telecare.component.html',
  styleUrls: ['./telecare.component.css']
})
export class TelecareComponent implements OnInit, OnDestroy {
  public clientConsent: any = {};
  public conceptUuid: any = [];
  public consented = false;
  public patientUuid: any = '';
  public subscription: Subscription;
  constructor(private obsService: ObsResourceService, private patientService: PatientService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatientUuid.subscribe((uuid) => {
      this.getClientConsent();
      this.patientUuid = uuid;
    });
  }
  getClientConsent() {
    // TODO: Use correct concept uuids
    this.conceptUuid = ['a8a06fc6-1350-11df-a1f1-0026b9348838', 'a899b35c-1350-11df-a1f1-0026b9348838'];
    this.subscription = this.obsService.getObsPatientObsByConcept(this.patientUuid, this.conceptUuid).subscribe((data) => {
      const results = data['results'];
      const encDateTime = results[0].encounter.encounterDateTime;
      this.clientConsent.dateofConcent = encDateTime;
      results.forEach(element => {
        if (element.encounterDateTime === encDateTime) {
          if (this.conceptUuid.includes(element.concept.uuid)) {
            if (element.concept.uuid === this.conceptUuid[0]) {
              this.clientConsent.value = element.value;
            } else if (element.concept.uuid === this.conceptUuid[1]) {
              this.clientConsent.comments = element.value;
              if (element.value) {
                this.consented = true;
              }
            }
          }
        }
      });
    });
  }
  fillConsentForm() {
    if (this.patientUuid === undefined || this.patientUuid === null) {
      return;
    }
    // TODO: Redirect to correct form
    this.router.navigate(['/patient-dashboard/patient/' + this.patientUuid +
      '/general/general/landing-page']);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
