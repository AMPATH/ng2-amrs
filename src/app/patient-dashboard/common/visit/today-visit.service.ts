import { Injectable, OnDestroy } from "@angular/core";

import * as moment from "moment";
import * as _ from "lodash";
import { Observable, Subject, of, Subscription } from "rxjs";
import { flatMap, delay } from "rxjs/operators";

import { PatientProgramResourceService } from "../../../etl-api/patient-program-resource.service";
import { VisitResourceService } from "../../../openmrs-api/visit-resource.service";
import { PatientService } from "../../services/patient.service";
import { TitleCasePipe } from "../../../shared/pipes/title-case.pipe";
import { RetrospectiveDataEntryService } from "../../../retrospective-data-entry/services/retrospective-data-entry.service";

export enum VisitsEvent {
  VisitsLoadingStarted,
  VisitsLoaded,
  ErrorLoading,
  VisitsBecameStale,
}

@Injectable()
export class TodayVisitService implements OnDestroy {
  // SERVICE PROCESSES VISITS PER PATIENT
  public patient: any;

  public patientProgramVisitConfigs: any = {};
  public errors: Array<any> = [];

  public allPatientVisits = [];
  public hasFetchedVisits = false;

  public enrolledPrograms: Array<any> = [];

  public needsVisitReload = true;
  public programVisits = null;
  public visitsByProgramClass = [];
  public showVisitStartedMsg = false;

  public visitsEvents: Subject<VisitsEvent> = new Subject<VisitsEvent>();
  private isLoading = false;

  private subs: Subscription[] = [];

  constructor(
    private patientProgramResourceService: PatientProgramResourceService,
    private visitResourceService: VisitResourceService,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    private patientService: PatientService
  ) {}

  public ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs = [];
  }

  public activateVisitStartedMsg() {
    this.showVisitStartedMsg = true;
  }

  public hideVisitStartedMessage() {
    this.showVisitStartedMsg = false;
  }

  public getVisitStartedMsgStatus() {
    return this.showVisitStartedMsg;
  }

  public fetchPatientProgramVisitConfigs(): Observable<any> {
    const subject: Subject<any> = new Subject<any>();
    this.patientProgramVisitConfigs = {};
    if (!(this.patient && this.patient.uuid)) {
      setTimeout(() => {
        subject.error("Patient is required");
      }, 0);
    } else {
      this.patientProgramResourceService
        .getPatientProgramVisitConfigs(this.patient.uuid)
        .subscribe(
          (programConfigs) => {
            this.patientProgramVisitConfigs = programConfigs;
            subject.next(programConfigs);
          },
          (error) => {
            this.errors.push({
              id: "program configs",
              message: "There was an error fetching all the program configs",
            });
            console.error("Error fetching program configs", error);
            subject.error(error);
          }
        );
    }

    return subject;
  }

  public getProgramConfigurationObject(programUuid: string): any {
    return this.patientProgramVisitConfigs[programUuid];
  }

  public getPatientVisits(): Observable<any> {
    const subject: Subject<any> = new Subject<any>();
    this.allPatientVisits = [];
    this.hasFetchedVisits = false;

    if (!(this.patient && this.patient.uuid)) {
      setTimeout(() => {
        subject.error("Patient is required");
      }, 0);
    } else {
      this.visitResourceService
        .getPatientVisits({ patientUuid: this.patient.uuid })
        .subscribe(
          (visits) => {
            this.allPatientVisits = visits;
            this.hasFetchedVisits = true;
            subject.next(visits);
          },
          (error) => {
            this.errors.push({
              id: "patient visits",
              message: "There was an error fetching all the patient visits",
            });
            console.error("An error occured while fetching visits", error);
            subject.error(error);
          }
        );
    }
    return subject.pipe(delay(100));
  }

  public filterVisitsByVisitTypes(
    visits: Array<any>,
    visitTypes: Array<string>
  ): Array<any> {
    let returnVal = [];
    returnVal = _.filter(visits, (visit) => {
      const inType = _.find(visitTypes, (type) => {
        return type === visit.visitType.uuid;
      });
      if (inType) {
        return true;
      }
      return false;
    });
    return returnVal;
  }

  public filterVisitsByDate(visits: Array<any>, date: Date): Array<any> {
    let returnVal = [];
    returnVal = _.filter(visits, (visit) => {
      // Don't filter out retrospective visits
      const sameDate = moment(visit.startDatetime).isSame(moment(date), "days");
      if (sameDate) {
        return true;
      }
      return false;
    });
    return returnVal;
  }

  public sortVisitsByVisitStartDateTime(visits: Array<any>) {
    // sorts this in descending order
    return visits.sort((a, b) => {
      return moment(b.startDatetime).diff(moment(a.startDatetime), "seconds");
    });
  }

  public filterUnenrolledPrograms(programs: Array<any>): Array<any> {
    let returnVal = [];
    returnVal = _.filter(programs, (program) => {
      return (
        !_.isUndefined(program.enrolledProgram) &&
        !_.isNull(program.enrolledProgram) &&
        moment(program.dateEnrolled).isValid()
      );
    });
    return returnVal;
  }

  public buildProgramsObject(programs: Array<any>): any {
    const returnVal = {};
    _.each(programs, (program) => {
      returnVal[program.program.uuid] = {
        enrollment: program,
        visits: [],
        currentVisit: null,
        config: this.getProgramConfigurationObject(program.program.uuid),
      };
    });
    return returnVal;
  }

  public filterVisitsAndCurrentVisits(programVisitObj, visits) {
    programVisitObj.currentVisit = null;
    // Filter out visits not in the program
    this.retrospectiveDataEntryService.retroSettings.subscribe(
      (retroSettings) => {
        let filterVisitDate = moment();
        if (retroSettings && retroSettings.enabled) {
          filterVisitDate = moment(retroSettings.visitDate);
        }
        const todaysVisits = this.filterVisitsByDate(
          visits,
          filterVisitDate.toDate()
        );
        const programVisits = this.filterVisitsByVisitTypes(
          todaysVisits,
          this.getProgramVisitTypesUuid(programVisitObj.config)
        );
        const orderedVisits = this.sortVisitsByVisitStartDateTime(
          programVisits
        );

        programVisitObj.visits = orderedVisits;

        if (
          orderedVisits.length > 0 &&
          moment(orderedVisits[0].startDatetime).isSame(filterVisitDate, "days")
        ) {
          if (orderedVisits[0].patient.uuid === this.patient.uuid) {
            programVisitObj.currentVisit = orderedVisits[0];
          }
        } else {
          programVisitObj.currentVisit = null;
        }
      }
    );
  }

  public processVisitsForPrograms() {
    this.enrolledPrograms = this.filterUnenrolledPrograms(
      this.patient.enrolledPrograms
    );
    const programs = this.buildProgramsObject(this.enrolledPrograms);
    for (const o in programs) {
      if (programs[o]) {
        this.filterVisitsAndCurrentVisits(programs[o], this.allPatientVisits);
      }
    }
    this.programVisits = programs;
    this.groupProgramVisitsByClass();
  }

  public groupProgramVisitsByClass() {
    this.visitsByProgramClass = [];
    if (!_.isEmpty(this.programVisits)) {
      const classes: any = {};
      for (const o in this.programVisits) {
        if (this.programVisits[o]) {
          const c: string = this.programVisits[o].enrollment.baseRoute;
          // console.log('class', c);
          if (classes[c] === undefined) {
            classes[c] = {
              class: c,
              display: this.getDepartmentName(c),
              programs: [],
              allVisits: [],
            };
            this.visitsByProgramClass.push(classes[c]);
            // console.log('class obj', classes[c]);
          }

          // add program
          classes[c].programs.push({
            uuid: o,
            display: this.programVisits[o].enrollment.program.display,
            programVisits: this.programVisits[o],
          });

          // add visits
          classes[c].allVisits = classes[c].allVisits.concat(
            this.programVisits[o].visits
          );
        }
      }
    }
  }

  public loadDataToProcessProgramVisits(): Observable<any> {
    const subject = new Subject();
    this.fetchPatientProgramVisitConfigs().subscribe(
      () => {
        this.getPatientVisits().subscribe(
          () => {
            subject.next({ done: true });
          },
          (error) => {
            subject.error(error);
          }
        );
      },
      (err) => {
        subject.error(err);
      }
    );

    return subject;
  }

  public getProgramVisits(): Observable<any> {
    if (this.isLoading) {
      return of({ loading: true });
    }
    this.isLoading = true;
    // clear errors and visits
    this.errors = [];
    const subject = new Subject();

    // fire events to load visits
    this.visitsEvents.next(VisitsEvent.VisitsLoadingStarted);
    if (!this.needsVisitReload && this.programVisits !== null) {
      setTimeout(() => {
        this.isLoading = false;
        this.visitsEvents.next(VisitsEvent.VisitsLoaded);
        subject.next(this.programVisits);
      }, 0);
    } else {
      this.programVisits = null;
      this.loadDataToProcessProgramVisits().subscribe(
        (data) => {
          this.processVisitsForPrograms();
          this.needsVisitReload = false;
          this.isLoading = false;
          this.visitsEvents.next(VisitsEvent.VisitsLoaded);
          subject.next(this.programVisits);
        },
        (error) => {
          this.needsVisitReload = true;
          this.isLoading = false;
          this.visitsEvents.next(VisitsEvent.ErrorLoading);
          subject.error(this.errors);
        }
      );
    }
    return subject;
  }

  public makeVisitsStale() {
    this.needsVisitReload = true;
    this.visitsEvents.next(VisitsEvent.VisitsBecameStale);
  }

  private getProgramVisitTypesUuid(currentProgramConfig): Array<string> {
    if (
      currentProgramConfig &&
      Array.isArray(currentProgramConfig.visitTypes)
    ) {
      return _.map(currentProgramConfig.visitTypes, (item) => {
        return (item as any).uuid;
      });
    }
    return [];
  }

  private getDepartmentName(departmentRoute): string {
    switch (departmentRoute) {
      case "hiv":
        return "HIV";
      case "cdm":
        return "CDM";
      case "oncology":
        return "Hemato-Oncology";
      case "referral":
        return "Referred Programs";
      default:
        return new TitleCasePipe().transform(departmentRoute);
    }
  }
}
