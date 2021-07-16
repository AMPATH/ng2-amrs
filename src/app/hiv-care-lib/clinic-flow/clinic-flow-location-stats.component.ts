import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChange,
  EventEmitter,
} from "@angular/core";
import { Injectable, Inject } from "@angular/core";

import { BehaviorSubject, Subscription } from "rxjs";
import * as Moment from "moment";
import { ClinicFlowResource } from "../../etl-api/clinic-flow-resource-interface";
import { ClinicFlowCacheService } from "./clinic-flow-cache.service";
import { Router } from "@angular/router";
import * as _ from "lodash";
@Component({
  selector: "clinic-flow-location-stats",
  templateUrl: "./clinic-flow-location-stats.component.html",
})
export class ClinicFlowLocationStatsComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  public clinicFlowData: any[] = [];
  private loadingClinicFlow = false;
  private dataLoaded = false;
  private selectedLocation: any;
  private selectedDate: any;
  private currentLocationSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  private clinicFlowSubscription: Subscription;

  constructor(
    private clinicFlowCacheService: ClinicFlowCacheService,
    private router: Router,
    @Inject("ClinicFlowResource") private clinicFlowResource: ClinicFlowResource
  ) {}

  public ngOnInit() {
    this.currentLocationSubscription = this.clinicFlowCacheService
      .getSelectedLocation()
      .subscribe((clinic) => {
        this.selectedLocation = clinic;
        this.selectedDateSubscription = this.clinicFlowCacheService
          .getSelectedDate()
          .subscribe((date) => {
            this.selectedDate = date;

            if (this.selectedLocation && this.selectedDate) {
              if (this.loadingClinicFlow === false) {
                this.initParams();
                this.getClinicFlow(this.selectedDate, this.selectedLocation);
              }
            }
          });
      });
  }

  public loadSelectedPatient(event: any) {
    let patientUuid = "";
    if (event) {
      patientUuid = event.node.data.uuid;
    }

    if (patientUuid === undefined || patientUuid === null) {
      return;
    }

    this.router.navigate([
      "/patient-dashboard/patient/" +
        patientUuid +
        "/general/general/landing-page",
    ]);
  }

  public columns() {
    return this.clinicFlowCacheService.getLocationStatsColumn();
  }

  public ngOnDestroy(): void {
    if (this.currentLocationSubscription) {
      this.currentLocationSubscription.unsubscribe();
    }

    if (this.selectedDateSubscription) {
      this.selectedDateSubscription.unsubscribe();
    }

    if (this.clinicFlowSubscription) {
      this.clinicFlowSubscription.unsubscribe();
    }
  }

  public getClinicFlow(dateStated, locations) {
    this.initParams();
    this.loadingClinicFlow = true;
    this.clinicFlowCacheService.setIsLoading(this.loadingClinicFlow);
    const result = this.clinicFlowResource.getClinicFlow(dateStated, locations);
    if (result === null) {
      throw new Error("Null clinic flow observable");
    } else {
      this.clinicFlowSubscription = result.subscribe(
        (locationStats) => {
          if (locationStats.statsByLocation.length > 0) {
            const formatted = this.clinicFlowCacheService.formatData(
              locationStats.statsByLocation
            );
            this.clinicFlowData = this.clinicFlowData.concat(formatted);
          } else {
            this.dataLoaded = true;
          }
          this.loadingClinicFlow = false;
          this.clinicFlowCacheService.setIsLoading(this.loadingClinicFlow);
        },
        (error) => {
          this.loadingClinicFlow = false;
          this.clinicFlowCacheService.setIsLoading(this.loadingClinicFlow);
          this.errors.push({
            id: "Clinic Flow",
            message: "error fetching clinic flow data",
          });
        }
      );
    }
  }

  private initParams() {
    this.loadingClinicFlow = false;
    this.dataLoaded = false;
    this.errors = [];
    this.clinicFlowData = [];
  }
}
