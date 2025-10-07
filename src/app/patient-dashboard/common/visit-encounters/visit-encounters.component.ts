import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';

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
  constructor(
    private _patientService: PatientService,
    private _encounterResourceService: EncounterResourceService
  ) {}
  public ngOnInit() {
    this.getPatientUuid();
    this.encounterDetail = true;
  }

  public ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
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
}
