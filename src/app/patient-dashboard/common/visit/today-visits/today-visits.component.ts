import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { AppFeatureAnalytics } from '../../../../shared/app-analytics/app-feature-analytics.service';
import { TodayVisitService, VisitsEvent } from '../today-visit.service';
import { TitleCasePipe } from '../../../../shared/pipes/title-case.pipe';
import { PatientService } from '../../../services/patient.service';
@Component({
  selector: 'app-today-visits',
  templateUrl: './today-visits.component.html',
  styleUrls: ['./today-visits.component.css']
})
export class TodayVisitsComponent implements OnInit, OnDestroy {
  public programClassUuid = '';
  public programUuid = '';
  public isBusy = false;
  public errors = [];
  public groupedVisits = [];
  public index = 0;
  public patient: any;
  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private todayVisitService: TodayVisitService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  public ngOnInit() {
    this.getPatientUuid();
    // app feature analytics
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Patient Visits Loaded',
      'ngOnInit'
    );
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs = [];
  }

  public getPatientUuid() {
    const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.todayVisitService.patient = this.patient;
          this.todayVisitService.programVisits = null;
          this.todayVisitService.getProgramVisits();
          this.extractSelectedProgramFromUrl();
          this.subscribeToVisitsServiceEvents();
          this.checkForAlreadyLoadedVisits();
        }
      }
    );
    this.subs.push(sub);
  }

  public toTitleCase(text: string): string {
    return new TitleCasePipe().transform(text);
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
  }

  public handleProgramChange(program) {
    this.programUuid = '';
    setTimeout(() => {
      this.programUuid = program.uuid;
      this.todayVisitService.getProgramVisits();
    }, 500);
  }

  public extractSelectedProgramFromUrl() {
    const sub = this.route.params.subscribe((params) => {
      if (params) {
        // console.log('params', params);
        this.programClassUuid = params['programClass'];
        this.handleProgramChange({ uuid: params['program'] });
      }
    });
    this.subs.push(sub);
  }

  public checkForAlreadyLoadedVisits() {
    if (
      _.isEmpty(this.todayVisitService.programVisits) ||
      this.todayVisitService.needsVisitReload
    ) {
      this.triggerVisitLoading();
    } else {
      this.onVisitLoadedEvent();
    }
  }

  public subscribeToVisitsServiceEvents() {
    this.todayVisitService.visitsEvents.subscribe((event: VisitsEvent) => {
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
    this.todayVisitService.patient = this.patient;
    const sub = this.todayVisitService.getProgramVisits().subscribe(
      () => {},
      (error) => {
        console.log('ERROR', error);
      }
    );
    this.subs.push(sub);
  }

  public onVisitLoadedEvent() {
    this.isBusy = false;
    this.groupedVisits = [];
    this.groupedVisits = this.todayVisitService.visitsByProgramClass;
  }

  public onFormSelected(selected) {
    if (selected) {
      this.router.navigate(['../formentry', selected.form.uuid], {
        relativeTo: this.route,
        queryParams: {
          visitUuid: selected.visit.uuid,
          visitTypeUuid: selected.visit.visitType.uuid
        },
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
