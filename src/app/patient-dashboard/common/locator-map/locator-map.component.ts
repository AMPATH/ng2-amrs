
import {take} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import * as _ from 'lodash';

import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
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
    this.subscriptions.push(this.fileUploadResourceService.upload(file).pipe(flatMap((result: any) => {
      const updatePayload = {
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
    })).pipe(take(1)).subscribe((patient) => {
      this.loading = false;
      this.imageSaved = true;
      this.patientService.reloadCurrentPatient();
      this.displaySuccessAlert();
    }, (error) => {
      this.imageUploadFailed = true;
      this.loading = false;
    }));
  }

  public clearPhoto() {
    this.dataModel = null;
    const updatePayload = {
      attributes: [{
        attributeType: this.attributeType,
        voided: true
      }]
    };
    this.loading = true;
    this.subscriptions.push(this.personResourceService
      .saveUpdatePerson(this.patient.person.uuid, updatePayload).pipe(take(1)).subscribe((patient) => {
        this.patientService.reloadCurrentPatient();
        this.loading = false;
      }, (error) => {
        this.loading = false;
      }));
  }

  public setPhoto() {
    const photo = this.patient.person.getPersonAttribute(this.attributeType);
    if (photo) {
      this.dataModel = photo;
    } else {
      this.dataModel = null;
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
