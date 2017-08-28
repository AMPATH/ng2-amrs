import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';

import * as _ from 'lodash';

import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { AppSettingsService } from '../../../app-settings';
import { PatientService } from '../../services/patient.service';

@Component({
    selector: 'locator-map',
    templateUrl: './locator-map.component.html',
    styleUrls: ['./locator-map.css']
})

export class LocatorMapComponent implements OnInit, OnDestroy {

  public dataModel: string;
  public loading = false;
  public imageSaved = false;
  public imageUploadFailed = false;
  public subscriptions = [];
  public patient: any;
  private attributeType = '1a12beb8-a869-42f2-bebe-09834d40fd59';

  constructor(private fileUploadResourceService: FileUploadResourceService,
              private appSettingsService: AppSettingsService,
              private patientService: PatientService,
              private personResourceService: PersonResourceService) {
  }

  public ngOnInit() {
    this.subscriptions.push(this.patientService.currentlyLoadedPatient.subscribe((patient) => {

      if (patient) {
        this.patient = patient;
        this.setPhoto();
      }
    }));
  }

  public ngOnDestroy(): void {
    this.cleanUp();
  }

  public onFileChange(file) {
    this.subscriptions.push(this.fileUploadResourceService.upload(file).flatMap((result) => {
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
      this.displaySuccessAlert();
    }, (error) => {
      this.imageUploadFailed = true;
      this.loading = false;
    }));
  }

  public clearPhoto() {
    this.dataModel = null;
    let updatePayload = {
      attributes: [{
        attributeType: this.attributeType,
        voided: true
      }]
    };
    this.loading = true;
    this.subscriptions.push(this.personResourceService
      .saveUpdatePerson(this.patient.person.uuid, updatePayload).subscribe((patient) => {
        this.patientService.fetchPatientByUuid(this.patient.person.uuid);
        this.loading = false;
      }, (error) => {
        this.loading = false;
      }));
  }

  public setPhoto() {
    let photo = this.patient.person.getPersonAttribute(this.attributeType);
    if (photo) {
      this.dataModel = photo;
    }

  }

  private getUrl() {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'files/';
  }

  private cleanUp() {
    // tslint:disable-next-line:prefer-for-of
    for (let sub = 0; sub < this.subscriptions.length; sub++) {
      this.subscriptions[sub].unsubscribe();
    }
  }

  private displaySuccessAlert() {
    this.imageSaved = true;
    setTimeout(() => {
      this.imageSaved = false;
    }, 3000);
  }

}
