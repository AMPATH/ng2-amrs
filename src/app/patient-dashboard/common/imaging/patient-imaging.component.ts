import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import {
  RadiologyImagingResourceService
} from '../../../etl-api/radiology-imaging-resource.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {
  AppFeatureAnalytics
} from '../../../shared/app-analytics/app-feature-analytics.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'patient-imaging',
  templateUrl: 'patient-imaging.component.html',
  styleUrls: []
})
export class PatientImagingComponent implements OnInit, OnDestroy {
  public patient: any;
  public error: string;
  public loadingPatient: boolean;
  public fetchingResults: boolean;
  public isLoading: boolean;
  public patientIdentifier: any;
  public nextStartIndex: number = 0;
  public dataLoaded: boolean = false;
  public imagingResults = [];
  public subscription: Subscription;
  public gridOptions: GridOptions;
  public message: string;
  public display = false;
  public thumbs: any;
  public encounterId: any;
  public errors: any = [];
  public showSuccessAlert: boolean = false;
  public showErrorAlert: boolean = false;
  public errorAlert: string;
  public errorTitle: string;
  public successAlert: string = '';
  public result: any;
  public imageToShow: any;
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('modal')
  public modal: ModalComponent;
  constructor(
    private radiologyImagingResourceService: RadiologyImagingResourceService,
    private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private domSanitizer: DomSanitizer,
    private zeroVlPipe: ZeroVlPipe) {
    this.gridOptions = {} as GridOptions;
  }

  public ngOnInit() {

  this.loadingPatient = true;
  this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.loadingPatient = false;
        if (patient) {
          this.patient = patient;
          this.patientIdentifier = this.patient.commonIdentifiers.amrsMrn ||
            this.patient.commonIdentifiers.ampathMrsUId || this.patient.commonIdentifiers.cCC ||
            this.patient.commonIdentifiers.kenyaNationalId;
          this.getHistoricalPatientImagingResults(this.patientIdentifier);

        }
      }
    );

  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getHistoricalPatientImagingResults(patientIdentifier) {
    this.fetchingResults = true;

    this.radiologyImagingResourceService.getPatientImagingReport(patientIdentifier)
      .subscribe((result) => {

      if (result) {
        this.result = result.entry;
        this.imagingResults = this.formatReportTest(this.result);
        this.splitReportContent(this.imagingResults);

        this.fetchingResults = false;
        }
      }, (err) => {
        this.fetchingResults = false;
        this.error = err;
      });
    return this.imagingResults;

  }

  public fetchImageFromRefpacs() {
    this.fetchingResults = true;
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Radiology Image Loaded', 'onClick');

    this.radiologyImagingResourceService.getWadoImageUrl(this.patientIdentifier).subscribe(
      (url) => {

        this.radiologyImagingResourceService.getPatientImages(url).subscribe(
      (data) => {
        this.staticModal.show();
        this.imageToShow = this.domSanitizer.bypassSecurityTrustResourceUrl(data);
        this.fetchingResults = false;

      }
    );

      }
    );

  }
  public removeTags(strings, arr) {
    return arr ? strings.split('<').filter((val) => f(arr, val))
      .map((val) => f(arr, val)).join('') : strings.split('<')
      .map((d) => d.split('>').pop()).join('');
    function f(array, value) {
      return array.map((d) => value.includes(d + '>'))
        .indexOf(true) !== -1 ? '<' + value : value.split('>')[1];
    }
  }

  public likeImage(image) {

    this.thumbs = 1;
    this.encounterId = image.id;
    this.display = true;

  }

  public disLikeImage(image) {
    this.thumbs = 0;
    this.encounterId = image.id;
    this.display = true;

  }
  public dismissDialog() {
    this.display = false;
  }
  public splitReportContent(imagingResults) {
    let report = [];
    for (const i of imagingResults) {
      let val =  _.split(i.report, ',', 3);
      i['report'] = Object.assign({}, val);
      report.push(i);

    }

    return report;

  }

  public createRadiologyComment() {

    let payload = {
      comments: this.message,
      encounterId: this.encounterId,
      thumbs: this.thumbs
    };

    this.radiologyImagingResourceService.createRadiologyComments(payload).subscribe((success) => {
      if (success) {
        this.displaySuccessAlert('comment saved successfully');
        console.log('comments created successfully', success);
      }

    },
      (error) => {
      console.log('error', error);
      this.errors.push({
          id: 'patient',
          message: 'error adding comment'
        });
      });
    setTimeout(() => {
      this.display = false;
    }, 1000);

  }

  public close() {
    this.modal.close();
  }

  public dismissed() {
    this.modal.dismiss();
  }

  public formatReportTest(result) {

    let tests = [];
    for (const i of result) {
      let data = i.resource;
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
            let lab = this.removeTags(data.text.div, ['/p']);
            data['report'] = lab.replace(/<[^>]+>/g, ',');
          }

        }
      tests.push(data);
      }

    return tests;

  }

  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }

}
