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
  viremiaAlert: string;
  showViremiaAlert: boolean;
  lowViremia: boolean;
  highViremia: boolean;
  patientUuid: string;
  public subscription = new Subscription();

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    private hivSummaryService: HivSummaryService,
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.loadHivSummary();
    this.getPatient();
    this.route.url.subscribe((url) => {
      if (url[1]) {
        if (url[1].path === mdtProgramUuid) {
          this.showViremiaAlert = true;
        }
      }
    });
  }

  public getPatient() {
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patientUuid = patient.person.uuid;
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
        this.hivSummaryService.getHivSummary(patientUuid, 0, 1, false)
      )
      .subscribe((data) => {
        if (data) {
          for (const summary of data) {
            if (summary.is_clinical_encounter === 1 && this.showViremiaAlert) {
              this.checkViremia(summary.vl_1);
              break;
            }
          }
        }
      });
  }

  public checkViremia(viralLoad) {
    let alert;
    if (viralLoad >= 401 && viralLoad <= 999) {
      this.lowViremia = true;
      alert = 'Low Viremia';
    } else if (viralLoad >= 1000) {
      this.highViremia = true;
      alert = 'High Viremia';
    }
    if (alert) {
      this.viremiaAlert = alert;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
