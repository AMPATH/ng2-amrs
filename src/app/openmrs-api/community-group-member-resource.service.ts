import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

import { AppSettingsService } from "../app-settings/app-settings.service";
import { Observable, combineLatest, forkJoin, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as _ from "lodash";
import { PatientProgramService } from "../patient-dashboard/programs/patient-programs.service";
import { Group } from "../group-manager/group-model";
import { CommunityGroupService } from "./community-group-resource.service";
import { ProgramEnrollmentResourceService } from "./program-enrollment-resource.service";
import * as Moment from "moment";

export class GroupEnrollmentValidation {
  alreadyEnrolled: {
    found: boolean;
    data: any;
  };
  enrolledInAnotherGroupInSameProgram: {
    found: boolean;
    data: any;
  };
  notEnrolledInGroupProgram: {
    found: boolean;
    data: any;
  };
}

@Injectable()
export class CommunityGroupMemberService {
  constructor(
    private http: HttpClient,
    private _appSettingsService: AppSettingsService,
    private programService: PatientProgramService,
    private communityService: CommunityGroupService,
    private programEnrollmentService: ProgramEnrollmentResourceService
  ) {
    this.programEnrollmentService
      .getProgramUnenrollmentEvent()
      .subscribe((unenrolledProgram) => {
        if (unenrolledProgram) {
          return this.unenrollPatientFromCommunityGroupInProgram(
            unenrolledProgram
          ).subscribe((res) => console.log(res));
        }
      });
  }

  public getOpenMrsBaseUrl(): string {
    return this._appSettingsService.getOpenmrsRestbaseurl();
  }

  public getOpenMrsGroupModuleUrl(): string {
    return this.getOpenMrsBaseUrl() + "cohortm/cohortmember/";
  }

  public endMembership(memberUuid: any, date: any): Observable<any> {
    const url = this.getOpenMrsBaseUrl() + "cohortm/cohortmember/" + memberUuid;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = {
      endDate: date,
      voided: true,
    };
    return this.http
      .post(url, body, { headers })
      .map((res) => console.log("ended membership" + res));
  }

  public updatePersonAttribute(
    personUuid: string,
    attributeUuid: string,
    value: any
  ): Observable<any> {
    const url =
      this.getOpenMrsBaseUrl() +
      "/person/" +
      personUuid +
      "/attribute/" +
      attributeUuid;
    const body = {
      value,
    };
    return this.http.post(url, body);
  }

  createPersonAttribute(
    personUuid: string,
    attributeType: string,
    value: any
  ): any {
    const url =
      this.getOpenMrsBaseUrl() + "/person/" + personUuid + "/attribute/";
    const body = {
      value,
      attributeType,
    };
    return this.http.post(url, body);
  }

  createMember(cohortUuid: string, patientUuid: string): Observable<any> {
    const url = this.getOpenMrsGroupModuleUrl();
    const body = {
      cohort: cohortUuid,
      patient: patientUuid,
      startDate: new Date(),
    };
    return this.http.post(url, body);
  }

  public transferMember(currentGroup, newGroup, patient) {
    return this.endMembership(currentGroup.uuid, new Date()).flatMap((res) =>
      this.createMember(newGroup.uuid, patient.uuid)
    );
  }

  getMemberCohortsByPatientUuid(patientUuid: string): Observable<any> {
    const url = this.getOpenMrsGroupModuleUrl();
    const params = new HttpParams()
      .set("v", "default")
      .set("patient", patientUuid);
    return this.http
      .get<any>(url, {
        params: params,
      })
      .pipe(map((response) => response.results));
  }

  validateMemberEnrollment(
    programsEnrolled: any,
    groupsEnrolled: Group[],
    groupToEnroll: Group
  ): GroupEnrollmentValidation {
    // tslint:disable-next-line:prefer-const
    let validations: GroupEnrollmentValidation = new GroupEnrollmentValidation();
    try {
      const groupProgramUuid = this.communityService.getGroupAttribute(
        "programUuid",
        groupToEnroll.attributes
      ).value;
      const patientEnrolledInGroupProgram = this._isPatientEnrolledInGroupProgram(
        programsEnrolled,
        groupProgramUuid
      );
      const patientEnrolledInAnotherGroupInSameProgram = this._isPatientEnrolledInAnotherGroupInSameProgram(
        groupsEnrolled,
        groupProgramUuid
      );
      const patientAlreadyEnrolledInGroup = this._isPatientAlreadyEnrolledInGroup(
        groupsEnrolled,
        groupToEnroll.uuid
      );

      validations["alreadyEnrolled"] = patientAlreadyEnrolledInGroup;
      validations[
        "enrolledInAnotherGroupInSameProgram"
      ] = patientEnrolledInAnotherGroupInSameProgram;
      validations["notEnrolledInGroupProgram"] = patientEnrolledInGroupProgram;
      return validations;
    } catch (error) {
      console.error(error);
      return validations;
    }
  }

  getCurrentlyEnrolledProgramsAndGroups(patientUuid: string) {
    const observables = [];
    observables.push(
      this.programService.getCurrentlyEnrolledPatientPrograms(patientUuid)
    );
    observables.push(this.getMemberCohortsByPatientUuid(patientUuid));
    return combineLatest(observables);
  }

  private _isPatientAlreadyEnrolledInGroup(groupsEnrolled, groupToEnrollUuid) {
    const found = _.find(
      groupsEnrolled,
      (group) => group.cohort.uuid === groupToEnrollUuid
    );
    if (found) {
      return {
        found: true,
        data: found,
      };
    } else {
      return {
        found: false,
        data: null,
      };
    }
  }

  private _isPatientEnrolledInAnotherGroupInSameProgram(
    groupsEnrolled,
    groupProgramUuid
  ) {
    let found;
    let _group;
    _.forEach(groupsEnrolled, (group) => {
      found = _.find(
        group.cohort.attributes,
        (attribute) => attribute.value === groupProgramUuid
      );
      if (!_.isUndefined(found)) {
        _group = group;
      }
      return _.isUndefined(found);
    });
    if (found) {
      return {
        found: true,
        data: _group,
      };
    } else {
      return {
        found: false,
        data: null,
      };
    }
  }
  private _isPatientEnrolledInGroupProgram(
    programsEnrolled: any[],
    groupProgramUuid
  ): any {
    const currentProgramsEnrolled = _.filter(
      programsEnrolled,
      (program) => program.isEnrolled === true
    );
    const found = _.find(
      currentProgramsEnrolled,
      (program) => program.programUuid === groupProgramUuid
    );
    if (found) {
      return {
        found: true,
        data: found,
      };
    } else {
      return {
        found: false,
        data: null,
      };
    }
  }

  public unenrollPatientFromCommunityGroupInProgram(payload): Observable<any> {
    if (payload["patient"] && payload["program"]) {
      const patient = payload["patient"];
      const dateCompleted = payload["dateCompleted"];
      const formattedDateCompleted = Moment(dateCompleted).format("YYYY-MM-DD");
      const program = payload["program"];
      const cohortProgramAttributeTypeUuid =
        "520cd8bb-cc38-4ebd-97cc-6d555ee13a98";
      console.log(payload, "payload");
      return this.getMemberCohortsByPatientUuid(patient.uuid).flatMap(
        (memberships) => {
          const observables = [];
          _.each(memberships, (membership) => {
            if (!membership.voided) {
              console.log("membership not voided");
              const cohort = membership["cohort"];
              if (cohort["attributes"]) {
                console.log(cohort["attributes"]);
                _.each(cohort["attributes"], (attribute) => {
                  if (attribute["cohortAttributeType"]) {
                    console.log(attribute["cohortAttributeType"]);
                    if (
                      attribute["cohortAttributeType"]["uuid"] ===
                        cohortProgramAttributeTypeUuid &&
                      attribute["value"] === program["uuid"]
                    ) {
                      observables.push(
                        this.endMembership(
                          membership["uuid"],
                          formattedDateCompleted
                        )
                      );
                    }
                  }
                });
              }
            }
          });
          if (observables) {
            return forkJoin(observables);
          } else {
            return of(null);
          }
        }
      );
    } else {
      return of(null);
    }
  }
}
