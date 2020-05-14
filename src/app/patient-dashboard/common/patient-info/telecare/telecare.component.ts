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
  public consented = false;
  public patientUuid: any = '';
  public subscription: Subscription;
  constructor(private obsService: ObsResourceService, private patientService: PatientService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatientUuid.subscribe((uuid) => {
      this.patientUuid = uuid;
      this.getClientConsent();
    });
  }
  getClientConsent() {
    this.conceptUuid = ['9d9ccb6b-73ae-48dd-83f9-12c782ce6685', 'a8a06fc6-1350-11df-a1f1-0026b9348838'];
    const telecareEncounter = 'df1df2d5-58f4-4e67-9394-c559c680cec6';
    this.subscription = this.obsService.getObsPatientObsByConcepts(this.patientUuid, this.conceptUuid).subscribe((data) => {
      const results = data['results'];
      if (results.length > 0) {
      const encDateTime = results[0].encounter.encounterDatetime;
      this.clientConsent.dateofConsent = moment(encDateTime).format('DD-MM-YYYY');
      results.forEach(element => {
        if (element.encounter.encounterDatetime === encDateTime) {
          if (this.conceptUuid.includes(element.concept.uuid)) {
            if (element.concept.uuid === this.conceptUuid[0]) {
              this.clientConsent.value = element.value;
              if (element.value.display === 'YES') {
                this.consented = true;
              }
            } else if (element.concept.uuid === this.conceptUuid[1] && element.encounter.uuid === telecareEncounter) {
              this.clientConsent.comments = element.value;
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
    this.router.navigate(['/patient-dashboard/patient/' + this.patientUuid +
      '/general/general/formentry/734b61a1-92a6-497e-a743-17bf3c61796e']);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
