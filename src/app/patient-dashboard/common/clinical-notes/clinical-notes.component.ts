import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { ClinicalNotesResourceService } from '../../../etl-api/clinical-notes-resource.service';
import { ClinicalNotesHelperService } from './clinical-notes.helper';
import { Subscription } from 'rxjs';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import * as Moment from 'moment';

@Component({
  selector: 'app-clinical-notes',
  templateUrl: './clinical-notes.component.html',
  styleUrls: ['./clinical-notes.component.css']
})
export class ClinicalNotesComponent implements OnInit, OnDestroy {
  public dataLoaded = false;

  public hasNotes = false;

  public fetching = true;

  public experiencedLoadingError = false;

  public isBusy: Subscription;

  public notes: Array<any> = [];

  public isHEIActive = false;

  private helper: ClinicalNotesHelperService;

  private subscription: Subscription;

  private nextStartIndex = 0;

  private patientUuid = '';

  constructor(
    private route: ActivatedRoute,
    private notesResource: ClinicalNotesResourceService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientResourceService: PatientResourceService
  ) {
    this.helper = new ClinicalNotesHelperService();
  }

  public ngOnInit() {
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Clinical Notes Loaded',
      'ngOnInit'
    );

    this.subscription = this.route.parent.params.subscribe((params: Params) => {
      this.patientUuid = params['patient_uuid'];

      this.patientResourceService
        .getPatientByUuid(this.patientUuid)
        .subscribe((result) => {
          this.isHEIActive =
            Moment().diff(Moment(result.person.birthdate), 'months') <= 18
              ? true
              : false;
          this.getNotes(0, 10, this.isHEIActive, (err, notes) => {
            if (err) {
              console.error(err);
              return;
            }

            this.notes = notes;

            this.fetching = false;
          });
        });
    });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isBusy.unsubscribe();
  }

  public getMoreNotes() {
    this.nextStartIndex += this.notes.length;

    this.fetching = false;

    this.getNotes(this.nextStartIndex, 10, this.isHEIActive, (err, notes) => {
      if (err) {
        console.error(err);
        return;
      }

      this.fetching = false;

      if (notes.length > 0) {
        this.notes = this.notes.concat(notes);
      } else {
        this.dataLoaded = true;
      }
    });
  }

  public getNotes(startIndex: number, limit: number, isHEIACTIVE: boolean, cb) {
    this.isBusy = this.notesResource
      .getClinicalNotes(this.patientUuid, startIndex, limit, this.isHEIActive)
      .pipe(take(1))
      .subscribe(
        (data: any) => {
          const _notes = data.notes;

          if (_notes.length > 0) {
            this.helper.format(_notes);

            this.hasNotes = true;
          }

          cb(null, _notes);
        },
        (err) => {
          this.experiencedLoadingError = true;

          cb(err, null);
        }
      );
  }
}
