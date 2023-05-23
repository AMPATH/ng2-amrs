import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

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
  public display = false;
  public addDialog = false;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public dataModel: string;
  public mapInfo: any;
  public lastUpdatedDate: string;
  public pdfUrl: any;
  public loading = false;
  public pdfAvailable = false;
  public imageSaved = false;
  public imageUploadFailed = false;
  public subscriptions = [];
  public fileList = [];
  public singleFileInput = true;
  public openCamera = false;
  public patient: any;
  public fileUuid = null;
  private attributeType = '1a12beb8-a869-42f2-bebe-09834d40fd59';

  constructor(
    private fileUploadResourceService: FileUploadResourceService,
    private appSettingsService: AppSettingsService,
    private patientService: PatientService,
    private personResourceService: PersonResourceService
  ) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  public showDialog() {
    this.display = true;
  }

  /*public ngOnInit() {
    this.subscriptions.push(
      this.patientService.currentlyLoadedPatient.subscribe((patient) => {
        if (patient) {
          this.patient = patient;
          this.setPhoto();
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.cleanUp();
  }
  public upload() {}
  public clearValue() {
    this.fileUuid = null;
    this.propagateChange(this.fileUuid);
  }
  // tslint:disable-next-line:no-shadowed-variable
  private propagateChange = (_: any) => {};

  public onFileChange(fileList) {
    for (const file of fileList) {
      this.uploadFile(file);
    }
  }
  public uploadFile(file) {
    this.subscriptions.push(
      this.fileUploadResourceService
        .upload(file)
        .pipe(
          flatMap((result: any) => {
            const updatePayload = {
              attributes: [
                {
                  attributeType: this.attributeType,
                  value: result.image
                }
              ]
            };
            this.loading = true;
            this.imageUploadFailed = false;
            this.imageSaved = false;
            return this.personResourceService.saveUpdatePerson(
              this.patient.person.uuid,
              updatePayload
            );
          })
        )
        .pipe(take(1))
        .subscribe(
          (patient) => {
            this.loading = false;
            this.imageSaved = true;
            this.patientService.reloadCurrentPatient();
            this.displaySuccessAlert();
          },
          (error) => {
            this.imageUploadFailed = true;
            this.loading = false;
          }
        )
    );
  }

  public clearPhoto() {
    this.dataModel = null;
    const updatePayload = {
      attributes: [
        {
          attributeType: this.attributeType,
          voided: true
        }
      ]
    };
    this.loading = true;
    this.subscriptions.push(
      this.personResourceService
        .saveUpdatePerson(this.patient.person.uuid, updatePayload)
        .pipe(take(1))
        .subscribe(
          (patient) => {
            this.patientService.reloadCurrentPatient();
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        )
    );
  }

  public setPhoto() {
    this.resetValues();
    const photo = this.patient.person.getPersonAttribute(this.attributeType);
    if (photo) {
      this.dataModel = photo;
      this.mapInfo = this.patient.person.getPersonAttributeInfo(
        this.attributeType
      );
      this.lastUpdatedDate = this.mapInfo.dateChanged
        ? this.mapInfo.dateChanged
        : this.mapInfo.dateCreated;
      const re = /pdf/gi;
      if (this.dataModel.search(re) !== -1) {
        this.setPdfUrl();
      }
    } else {
      this.dataModel = null;
    }
  }
  private setPdfUrl() {
    this.loading = true;
    this.fileUploadResourceService
      .getFile(this.dataModel, 'pdf')
      .subscribe((file) => {
        this.pdfAvailable = true;
        this.pdfUrl = file.changingThisBreaksApplicationSecurity;
        this.loading = false;
      });
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
  public liveCamera() {
    if (this.openCamera) {
      this.openCamera = false;
    } else {
      this.openCamera = true;
    }
  }
  public resetValues(): void {
    this.dataModel = null;
    this.pdfAvailable = false;
  } */
}
