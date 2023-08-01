import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { HivSummaryService } from './hiv-summary.service';
import { PatientService } from '../../services/patient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
const mdtProgramUuid = 'c4246ff0-b081-460c-bcc5-b0678012659e';
@Component({
  selector: 'app-hiv-summary',
  templateUrl: './hiv-summary.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryComponent implements OnInit, OnDestroy {
  lowViremia: boolean;
  highViremia: boolean;
  patientUuid: string;
  age: any;
  gbvScreeningLabel: String;
  gbvScreeningResult: any;
  patient: any;
  public subscription = new Subscription();

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    private hivSummaryService: HivSummaryService,
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.getPatient();
    this.loadHivSummary();
  }

  public getPatient() {
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = patient.person.uuid;
          this.age = patient.person.age;
          patient.person.age > 19
            ? (this.gbvScreeningLabel = 'GBV Screening')
            : (this.gbvScreeningLabel = 'VAC Screening');
        }
      },
      (err) => {
        console.error(err);
      }
    );
    this.subscription.add(patientSub);
  }

  public loadHivSummary() {
    this.patientService.currentlyLoadedPatientUuid
      .flatMap((patientUuid) =>
        this.hivSummaryService.getHivSummary(
          patientUuid,
          0,
          1,
          false,
          this.patient.person.birthdate
        )
      )
      .subscribe((data: any) => {
        if (data) {
          const gbvScreeningResult =
            data.length > 0 ? data[0].gbv_screening_result : '';
          this.gbvScreeningResult = this.checkGbvScreening(gbvScreeningResult);
        }
      });
  }

  public checkGbvScreening(screeningResult) {
    if (screeningResult === 1 ? true : false) {
      return 'POSITIVE';
    }
    return false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
