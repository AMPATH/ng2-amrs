import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import * as _ from 'lodash';
import { PatientService } from '../../patient.service';
@Component({
  selector: 'visit-period',
  templateUrl: 'visit-period.component.html',
  styleUrls: [],
})
export class VisitPeriodComponent implements OnInit, OnDestroy {

  errors: any[] = [];
  patientSubscription: Subscription;
  routeSubscription: Subscription;
  visitSubscription: Subscription;
  loadingVisitPeriod: boolean = true;
  encounterVisitUuid: string = '';
  startDatetime: string = '';
  stopDatetime: string = '';
  encounters: any[] = [];

  data: any;
  constructor(private patientService: PatientService, private visitResource: VisitResourceService,
    private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.subscribeToPatientChangeEvent();
    this.subscribeToRouteChangeEvent();
  }

  ngOnDestroy(): void {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.visitSubscription) {
      this.visitSubscription.unsubscribe();
    }
  }

  subscribeToRouteChangeEvent() {

    if (this.route && this.route.queryParams) {
      this.routeSubscription = this.route.queryParams.subscribe((params) => {
        this.resetVariables();
        if (params['visitUuid']) {
          this.encounterVisitUuid = params['visitUuid'];
          this.data = this.getVisitPeriod(this.encounterVisitUuid);
        }

        if (params['encounter']) {
          let encounterUuid = params['encounter'];
          let visit = this.getEncounterVisit(encounterUuid);

          if (visit) {
            this.stopDatetime = visit.stopDatetime;
            this.encounterVisitUuid = visit.uuid;
            this.startDatetime = visit.startDatetime;
          }

        }

      });
    }
  }

  subscribeToPatientChangeEvent() {

    this.patientSubscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.resetVariables();
        if (patient !== null) {
          this.encounters = patient.encounters;
        }
      }
      , (err) => {
        this.resetVariables();
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  private getEncounterVisit(encounterUuid) {
    if (this.encounters.length === 0) {
      return null;
    }
    let filtered = _.filter(this.encounters, (encounter: any) => {
      if (encounter.uuid === encounterUuid) {
        return true;
      } else {
        return false;
      }
    });

    if (filtered.length === 1 && filtered[0].visit) {
      return filtered[0].visit;
    } else {
      return null;
    }

  }

  private getVisitPeriod(uuid) {
    let custom = 'custom:(uuid,encounters:(uuid,encounterDatetime,' +
      'form:(uuid,name),location:ref,' +
      'encounterType:ref,provider:ref),patient:(uuid,uuid),' +
      'visitType:(uuid,name),location:ref,startDatetime,' +
      'stopDatetime)';
    this.visitSubscription = this.visitResource.getVisitByUuid(uuid, { v: custom })
      .subscribe((visit) => {
        this.stopDatetime = visit.stopDatetime;
        this.startDatetime = visit.startDatetime;
      });


  }

  private resetVariables() {
    this.loadingVisitPeriod = false;
    this.stopDatetime = '';
    this.startDatetime = '';
    this.encounterVisitUuid = '';
  }
}


