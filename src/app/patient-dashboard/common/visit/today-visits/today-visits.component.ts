import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import *  as _ from 'lodash';
import { AppFeatureAnalytics } from
  '../../../../shared/app-analytics/app-feature-analytics.service';
import { TodayVisitService, VisitsEvent } from '../today-visit.service';
import { TitleCasePipe } from '../../../../shared/pipes/title-case.pipe';

@Component({
  selector: 'app-today-visits',
  templateUrl: './today-visits.component.html',
  styleUrls: ['./today-visits.component.css']
})
export class TodayVisitsComponent implements OnInit {

  public programClassUuid: string = '';
  public programUuid: string = '';
  public isBusy = false;
  public errors = [];
  public groupedVisits = [];
  public index: number = 0;

  constructor(
    private router: Router,
    private todayVisitService: TodayVisitService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private route: ActivatedRoute,
  ) { }

  public ngOnInit() {
    this.extractSelectedProgramFromUrl();
    this.subscribeToVisitsServiceEvents();
    this.checkForAlreadyLoadedVisits();
    // app feature analytics
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Visits Loaded', 'ngOnInit');
  }

  public toTitleCase(text: string): string {
    return (new TitleCasePipe()).transform(text);
  }

  public handleProgramClassChange(e) {
    if (e.index >= 0) {
      this.programClassUuid = this.groupedVisits[e.index].class;
      this.handleProgramChange(this.groupedVisits[e.index].programs[0]);
      // console.log('selected index ', this.programClassUuid);
    } else {
      this.programClassUuid = '';
    }
    this.programUuid = '';
    console.log('changing class');
  }

  public handleProgramChange(program) {
    this.programUuid = '';
    setTimeout(() => {
      this.programUuid = program.uuid;
    }, 500);
  }

  public extractSelectedProgramFromUrl() {
    this.route.params.subscribe((params) => {
      if (params) {
        // console.log('params', params);
        this.programClassUuid = params['programClass'];
        this.handleProgramChange({ uuid: params['program'] });
      }
    });
  }

  public checkForAlreadyLoadedVisits() {
    if (_.isEmpty(this.todayVisitService.programVisits) ||
      this.todayVisitService.needsVisitReload) {
      this.triggerVisitLoading();
    } else {
      this.onVisitLoadedEvent();
    }

  }

  public subscribeToVisitsServiceEvents() {
    this.todayVisitService.visitsEvents
      .subscribe((event: VisitsEvent) => {
        switch (event) {
          case VisitsEvent.VisitsLoadingStarted:
            this.onProgramVisitsLoadingStarted();
            break;
          case VisitsEvent.ErrorLoading:
            this.onProgramVisitsLoadingError();
            break;
          case VisitsEvent.VisitsLoaded:
            this.onVisitLoadedEvent();
            break;
          case VisitsEvent.VisitsBecameStale:
            this.triggerVisitLoading();
            break;
          default:
            break;
        }

      });

  }

  public onProgramVisitsLoadingStarted() {
    this.isBusy = true;
    this.errors = [];
    this.groupedVisits = [];
  }

  public onProgramVisitsLoadingError() {
    this.isBusy = false;
    this.errors = this.todayVisitService.errors;
    this.groupedVisits = [];
  }

  public triggerVisitLoading() {
    this.onProgramVisitsLoadingStarted();
    this.todayVisitService.getProgramVisits()
      .subscribe(() => { }, (error) => { });
  }

  public onVisitLoadedEvent() {
    this.isBusy = false;
    this.groupedVisits = this.todayVisitService.visitsByProgramClass;
  }

  public onFormSelected(selected) {
    if (selected) {
      this.router.navigate(['../formentry', selected.form.uuid],
        {
          relativeTo: this.route,
          queryParams: { visitUuid: selected.visit.uuid },
          queryParamsHandling: 'merge'
        });
    }
  }

  public onEncounterSelected(encounter) {
    if (encounter) {
      this.router.navigate(['../formentry', encounter.form.uuid], {
        relativeTo: this.route,
        queryParams: { encounter: encounter.uuid }
      });
    }
  }

}
