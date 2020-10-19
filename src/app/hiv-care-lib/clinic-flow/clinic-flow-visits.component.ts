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
  selector: "clinic-flow-visits",
  templateUrl: "./clinic-flow-visits.component.html",
})
export class ClinicFlowVisitsComponent implements OnInit, OnDestroy {
  public filterCollapsed: boolean;
  public errors: any[] = [];
  public clinicFlowData: any[] = [];
  public incompleteVisitsCount: any;
  public completeVisitsCount: any;
  public totalVisitsCount: any;
  public selectedVisitType: any;
  public visitCounts: any;
  private encounters: any;
  private filteredData: any;
  private selectedLocation: any;
  private selectedDate: any;
  private loadingClinicFlow = false;
  private dataLoaded = false;
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
      patientUuid = event.node.data.patient_uuid;
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
    return this.clinicFlowCacheService.getClinicFlowColumns();
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
      result.take(1).subscribe(
        (dataList) => {
          this.incompleteVisitsCount = dataList.incompleteVisitsCount;
          this.completeVisitsCount = dataList.completeVisitsCount;
          this.totalVisitsCount = dataList.totalVisitsCount;
          this.visitCounts = this.totalVisitsCount;
          this.selectedVisitType = "All Visits";

          if (dataList.result.length > 0) {
            this.encounters = this.AddEncounterSeenByClinician(dataList.result);
            this.filteredData = this.clinicFlowCacheService.formatData(
              this.encounters
            );
            const formatted = this.clinicFlowCacheService.formatData(
              this.encounters
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
  public incompletedVisits() {
    this.selectedVisitType = "Incomplete Visits";
    this.visitCounts = this.incompleteVisitsCount + "/" + this.totalVisitsCount;
    const results = this.filteredData.filter((obj) => {
      return obj.seen_by_clinician === null;
    });
    const orderedResults = this.renumberRowsOnFilter(results);

    this.clinicFlowData = orderedResults;
  }
  public completedVisits() {
    this.selectedVisitType = "Completed Visits";
    this.visitCounts = this.completeVisitsCount + "/" + this.totalVisitsCount;
    const results = this.filteredData.filter((obj) => {
      return obj.seen_by_clinician !== null;
    });

    const orderedResults = this.renumberRowsOnFilter(results);

    this.clinicFlowData = orderedResults;
  }
  public allVisits() {
    this.selectedVisitType = "All Visits";
    this.visitCounts = this.totalVisitsCount;
    this.clinicFlowData = this.renumberRowsOnFilter(this.filteredData);
  }

  private getTriageLocation(obj) {
    const result = obj.encounters.filter((encounter) => {
      return encounter.encounter_type_name === "HIVTRIAGE";
    });
    return result.length > 0 ? result[0].location : null;
  }

  private getClinicianLocation(obj) {
    const encounterType = this.getClinicianEncounterTypeLocation(obj);
    const encounters = obj.encounters;
    const result = encounters.filter((encounter) => {
      return encounter.encounter_type_name === encounterType;
    });
    return result.length > 0 ? result[0].location : null;
  }

  private getClinicianEncounterTypeLocation(obj) {
    return obj.seenByClinician.encounters;
  }

  private initParams() {
    this.loadingClinicFlow = false;
    this.dataLoaded = false;
    this.errors = [];
    this.clinicFlowData = [];
    this.selectedVisitType = "";
    this.visitCounts = "";
  }
  private AddEncounterSeenByClinician(result) {
    const encounters = [];
    let encounter;
    for (const i of result) {
      const data = i;
      for (const r in data) {
        if (data.hasOwnProperty(r)) {
          for (const j of data.encounters) {
            const datas = j;
            for (const k in datas) {
              if (datas.hasOwnProperty(k)) {
                encounter = datas.encounter_type_name;
              }
            }
          }

          const seenByClinician = {
            time: data.seen_by_clinician,
            encounters: encounter,
          };
          data['seenByClinician'] = seenByClinician;

          let seen = '';
          if (data.seen_by_clinician !== null) {
            seen = `${Moment(data.seen_by_clinician).format(
              'H:mmA DD-MM-YYYY'
            )} - ${encounter}`;
          }
          data['seen_by_clinician_date'] = seen;
          if (data.seen_by_clinician) {
            const triageLoc = this.getTriageLocation(data);
            const clinicianLoc = this.getClinicianLocation(data);
            if (triageLoc && clinicianLoc !== triageLoc) {
              data["location"] = "-";
            }
          }
        }
      }
      encounters.push(data);
    }
    return encounters;
  }

  private renumberRowsOnFilter(result) {
    const numbers = [];
    for (let i = 0; i < result.length; ++i) {
      const data = result[i];
      for (const r in data) {
        if (data.hasOwnProperty(r)) {
          data["#"] = i + 1;
        }
      }
      numbers.push(data);
    }
    return numbers;
  }
}
