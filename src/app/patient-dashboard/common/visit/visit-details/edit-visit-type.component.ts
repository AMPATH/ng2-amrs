import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { PatientProgramResourceService } from '../../../../etl-api/patient-program-resource.service';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: "edit-visit-types",
  templateUrl: "edit-visit-type.component.html",
  styleUrls: ["./edit-visit-type.component.css"],
})
export class EditVisitTypeComponent implements OnInit {
  @Output() public visitTypeEdited = new EventEmitter();
  @Input() public visit: any;
  @Input() public isEditVisitType: any;
  @Input() public programUuid: any;
  @Input() public programEnrollmentUuid: any;
  public visitType: any;
  public programVisitsConfig: any = {};
  public visitTypes = [];
  public saving = false;
  public sharedVisitTypes = ['06eca2a8-1da9-4ac4-95c6-15afedd4de21'];
  public retrospectiveTypeUuid = '3bb41949-6596-4ff9-a54f-d3d7883a69ed';
  public error = {
    message: "",
    display: false,
  };
  constructor(
    private patientProgramResourceService: PatientProgramResourceService,
    private visitResourceService: VisitResourceService
  ) {}

  public ngOnInit() {
    this.getCurrentProgramEnrollmentConfig();
  }

  public getCurrentProgramEnrollmentConfig() {
    const retrospectiveVisit = this.isVisitRetrospective(this.visit);
    const visitDate = moment(this.visit.startDatetime).format('YYYY-MM-DD');
    this.patientProgramResourceService
      .getPatientProgramVisitTypes(
        this.visit.patient.uuid,
        this.programUuid,
        this.programEnrollmentUuid,
        this.visit.location.uuid,
        retrospectiveVisit.toString(),
        visitDate
      )
      .subscribe(
        (progConfig) => {
          this.programVisitsConfig = progConfig;
          setTimeout(() => {
            this.visitType = {
              value: this.visit.visitType.uuid,
              label: this.visit.visitType.name,
            };
          });
          this.visitTypes = this.programVisitsConfig.visitTypes.allowed.map(
            (data, idx) => {
              return { label: data.name, value: data.uuid };
            }
          );
        },
        (error) => {}
      );
  }

  public saveVisit() {
    this.saving = true;
    const visitPayload = {
      visitType: (this.visitType as any).value,
    };
    this.visitResourceService
      .updateVisit(this.visit.uuid, visitPayload)
      .subscribe((updateVisit) => {
        this.saving = false;
        this.visitTypeEdited.emit(this.visit);
      });
  }
  public onVisitTypeChanged(event: any) {
    const visitTypeUuid = event.value;
    this.checkVisitEditCompatibility(visitTypeUuid);
  }
  public checkVisitEditCompatibility(newVisitTypeUuid: String) {
    const currentVisitHasEncounter = this.currentVisitHasEncounter();
    this.resetErrorMsg();
    if (
      _.includes(this.sharedVisitTypes, newVisitTypeUuid) &&
      currentVisitHasEncounter
    ) {
      console.log("cannot edit visit type");
      this.error = {
        message: `You cannot edit a visit type with an encounter to a shared visit type. Kindly
               end and start the desired visit or select another visit`,
        display: true,
      };
    }
  }
  public currentVisitHasEncounter() {
    const visit: any = this.visit;
    const visitEncounters = visit.encounters;
    if (visitEncounters.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  public resetErrorMsg() {
    this.error = {
      message: "",
      display: false,
    };
  }

  public isVisitRetrospective(visit: any): boolean {
    const attributes: any[] = visit.attributes;
    return attributes.some((att: any) => {
      const attributeType: any = att.attributeType;
      return attributeType.uuid === this.retrospectiveTypeUuid;
    });
  }
}
