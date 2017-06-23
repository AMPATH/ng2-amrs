import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import * as _ from 'lodash';

import { FileUploadResourceService } from '../../etl-api/file-upload-resource.service';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { PatientService } from '../patient.service';


@Component({
    selector: 'locator-map',
    templateUrl: 'locator-map.component.html',
    styleUrls: ['locator-map.css']
})

export class LocatorMapComponent implements OnInit {
    public dataModel: string;
    public loading = false;
    public imageSaved = false;
    public imageUploadFailed = false;
    patient: any;
    private attributeType = '1a12beb8-a869-42f2-bebe-09834d40fd59';
    constructor(private fileUploadResourceService: FileUploadResourceService,
        private appSettingsService: AppSettingsService,
        private patientService: PatientService,
        private personResourceService: PersonResourceService) { }
    ngOnInit() {
        this.patientService.currentlyLoadedPatient.subscribe(patient => {

            if (patient) {
                this.patient = patient;
                this.setPhoto();
            }
        });
    }

    private onFileChange(file) {
        this.fileUploadResourceService.upload(file).flatMap((result) => {
            let updatePayload = {
                attributes: [{
                    attributeType: this.attributeType,
                    value: result.image
                }]
            };
            this.loading = true;
            this.imageUploadFailed = false;
            this.imageSaved = false;
            return this.personResourceService
                .saveUpdatePerson(this.patient.person.uuid, updatePayload);
        }).subscribe((patient) => {
            this.loading = false;
            this.imageSaved = true;
            this.patientService.fetchPatientByUuid(this.patient.person.uuid);
        }, (error) => {
            this.imageUploadFailed = true;
            this.loading = false;
        });
    }
    private clearPhoto() {
        this.dataModel = null;
        let updatePayload = {
            attributes: [{
                attributeType: this.attributeType,
                voided: true
            }]
        };
        this.loading = true;
        this.personResourceService
            .saveUpdatePerson(this.patient.person.uuid, updatePayload).subscribe((patient) => {
                this.patientService.fetchPatientByUuid(this.patient.person.uuid);
                this.loading = false;
            }, (error) => {
                this.loading = false;
            });
    }
    private setPhoto() {
        let photo = this.patient.
            person.getPersonAttribute(this.attributeType);
        if (photo) {
            this.dataModel = this.getUrl() + photo;
        }

    }

    private getUrl() {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'files/';
    }
}
