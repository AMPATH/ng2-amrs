import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { PatientProgramResourceService } from
    '../../../../etl-api/patient-program-resource.service';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';

@Component({
    selector: 'edit-visit-types',
    templateUrl: 'edit-visit-type.component.html',
    styleUrls: ['./edit-visit-type.component.css']
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
    constructor(private patientProgramResourceService: PatientProgramResourceService,
                private visitResourceService: VisitResourceService) { }

    public ngOnInit() {
        this.getCurrentProgramEnrollmentConfig();
    }

    public getCurrentProgramEnrollmentConfig() {
        this.patientProgramResourceService
            .getPatientProgramVisitTypes(this.visit.patient.uuid,
            this.programUuid, this.programEnrollmentUuid, this.visit.location.uuid)
            .subscribe(
            (progConfig) => {
                this.programVisitsConfig = progConfig;
                setTimeout(() => {
                    this.visitType = {
                      value: this.visit.visitType.uuid,
                      label: this.visit.visitType.name
                    } ;
                });
                this.visitTypes = this.programVisitsConfig.visitTypes.allowed.map((data, idx) => {
                    return { label: data.name, value: data.uuid };
                });
            },
            (error) => {
            });
    }

    public saveVisit() {
        this.saving = true;
        let visitPayload = {
            visitType: (this.visitType as any).value
        };
        this.visitResourceService.updateVisit(this.visit.uuid, visitPayload)
        .subscribe((updateVisit) => {
            this.saving = false;
            this.visitTypeEdited.emit(this.visit);
        });

    }
    public onVisitTypeChanged(event) {
      this.visitType = event;
    }

}
