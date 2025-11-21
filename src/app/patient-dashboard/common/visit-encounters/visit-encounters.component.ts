import { take, takeUntil, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { Subject, Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { UserDefaultPropertiesService } from '../../../user-default-properties';
import { FeatureFlagService } from '../../../feature-flag/feature-flag.service';

@Component({
  selector: 'visit-encounters',
  templateUrl: './visit-encounters.component.html',
  styleUrls: ['./visit-encounters.component.css']
})
export class VisitEncountersComponent implements OnInit, OnDestroy {
  public title = 'Patient Visits';
  public patientUuid = '';
  public patientEncounters: any = [];
  public encounterDetail = false;
  public specEncounter: any = [];
  public selectedEncounter: any = [];
  public showVisitsObservations = true;
  public busyIndicator: any = {
    busy: false,
    message: '' // default message
  };
  public patient: Patient;
  private subs: Subscription[] = [];
  public hieShrFeatureFlag = false;
  private destroy$ = new Subject<boolean>();
  constructor(
    private _patientService: PatientService,
    private _encounterResourceService: EncounterResourceService,
    private featureFlagService: FeatureFlagService
  ) {}
  public ngOnInit() {
    this.getShrFeatureFlag();
    this.getPatientUuid();
    this.encounterDetail = true;
  }

  public ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public getPatientUuid() {
    const sub = this._patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.patientUuid = patient.uuid;
          this.getPatientEncounters(patient.uuid);
        }
      }
    );

    this.subs.push(sub);
  }

  public getPatientEncounters(patientUuid) {
    this._encounterResourceService
      .getEncountersByPatientUuid(patientUuid, false, null)
      .pipe(take(1))
      .subscribe((resp) => {
        this.patientEncounters = resp.reverse();
      });
  }

  public showVisits() {
    this.showVisitsObservations = true;
  }
  public showEncounters() {
    this.showVisitsObservations = false;
  }
  getShrFeatureFlag() {
    this.featureFlagService
      .getFeatureFlag('shared-health-records')
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (res.location) {
            this.hieShrFeatureFlag = res.location;
          }
        })
      )
      .subscribe();
  }
}
