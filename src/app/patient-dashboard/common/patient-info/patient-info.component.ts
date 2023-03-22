import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../../services/patient.service';
import { PatientCreationResourceService } from 'src/app/openmrs-api/patient-creation-resource.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit, OnDestroy {
  public patient: Patient;
  public subs: Subscription[] = [];
  public showVerifiedButton = false;

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private patientCreationResourceService: PatientCreationResourceService
  ) {}

  public ngOnInit() {
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
        }
      }
    );
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Patient Info Loaded',
      'ngOnInit'
    );
    const mode = this.route.snapshot.paramMap.get('editMode');
    if (mode === '3') {
      this.showVerifiedButton = true;
    }
    this.subs.push(patientSub);
  }
  public patientVerified() {
    const attributeUuid = this.patient.person.isVerifiedStatus;
    console.log(attributeUuid);
    const patientUuid = this.patient.uuid;
    const payload = {
      value: true,
      attributeType: '134eaf8a-b5aa-4187-85a6-757dec1ae72b'
    };
    console.log(payload);
    // update attribute to verified
    const updatePatientSub = this.patientCreationResourceService
      .updateAttribute(payload, patientUuid, attributeUuid)
      .pipe(take(1))
      .subscribe(
        (result: any) => {
          /** Step 2: Update patient identifiers */
          if (result) {
            this.patientCreationResourceService
              .updateRegistry(patientUuid)
              .subscribe(
                (data) => {
                  console.log('Success data', data);
                },
                (err) => {
                  console.log('Error', err);
                }
              );
            console.log('we are here!');

            window.history.go(-2);
          }
        },
        (err) => {}
      );

    this.subs.push(updatePatientSub);
  }
  public ngOnDestroy(): void {
    if (this.subs.length) {
      this.subs.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    }
  }
}
