import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { ClinicalNotesResourceService }  from '../../etl-api/clinical-notes-resource.service';
import { ClinicalNotesHelperService } from './clinical-notes.helper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clinical-notes',
  templateUrl: './clinical-notes.component.html',
  styleUrls: ['./clinical-notes.component.css']
})
export class ClinicalNotesComponent implements OnInit, OnDestroy  {

  dataLoaded: boolean = false;

  hasNotes: boolean = false;

  fetching: boolean = true;

  experiencedLoadingError: boolean = false;

  isBusy: Subscription;

  notes: Array<any> = [];

  private helper: ClinicalNotesHelperService;

  private subscription: Subscription;

  private nextStartIndex: number = 0;

  private patientUuid: string = '';

  constructor(
    private route: ActivatedRoute,
    private notesResource: ClinicalNotesResourceService,
    private appFeatureAnalytics: AppFeatureAnalytics
  ) {

    this.helper = new ClinicalNotesHelperService();
  }

  ngOnInit() {

    this.appFeatureAnalytics.trackEvent('Patient Dashboard', 'Clinical Notes Loaded', 'ngOnInit');


    this.subscription = this.route.parent.params.subscribe((params: Params) => {

      this.patientUuid = params['patient_uuid'];

      this.getNotes(0, 10, (err, notes) => {

        if (err) {
          console.log(err);
          return;
        }

        this.notes = notes;

        this.fetching = false;

      });

    });

  }

  ngOnDestroy() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isBusy.unsubscribe();
  }

  getMoreNotes() {

    this.nextStartIndex += this.notes.length;

    this.fetching = false;

    this.getNotes(this.nextStartIndex, 10, (err, notes) => {

      if (err) {
        console.log(err);
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

  getNotes(startIndex: number, limit: number, cb: Function) {

    this.isBusy = this.notesResource.getClinicalNotes(
      this.patientUuid,
      startIndex,
      limit
    ).subscribe((data) => {

      let _notes = data.notes;

      if (_notes.length > 0) {

        this.helper.format(_notes);

        this.hasNotes = true;

      }

      cb(null, _notes);

    }, (err) => {

      this.experiencedLoadingError = true;

      cb(err, null);

    });

  }

}
