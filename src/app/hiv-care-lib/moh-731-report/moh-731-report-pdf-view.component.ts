import { take } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MOHReportService } from './moh-731-report-pdf-view.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import * as _ from 'lodash';
import { Subscription, BehaviorSubject } from 'rxjs';
import * as Moment from 'moment';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'moh-731-pdf',
  templateUrl: 'moh-731-report-pdf-view.component.html'
})
export class MOHReportComponent implements OnInit, OnDestroy {
  public pdfSrc: string = null;
  public page = 1;
  public securedUrl: SafeResourceUrl;
  public isBusy = false;
  public pdfProxy: PDFDocumentProxy = null;
  public pdfMakeProxy: any = null;
  public errorFlag = false;
  public subscription: Subscription;
  public locations = [];
  public location: any;
  public reportData: any;
  public sectionDefinitions: any;
  public mohReports: Array<any>;
  public previousData: any;
  public numberOfPages = 0;
  public _data;
  month: string | null = null;
  year: string | null = null;

  public stack = [];
  @ViewChild('contentToSnapshot') contentToSnapshot!: ElementRef;

  @Input()
  public isAggregated = false;

  @Input()
  public selectedLocations: any;

  @Input() public sectionsDef: any;
  @Input() public startDate: any;
  @Input() public endDate: any;
  @Input() public isReleased: boolean;
  @Input()
  set data(value: any) {
    if (value) {
      // console.log('data',value);
      this.mohReports = value;
      this._data = value;
      this.endDate = Moment(this.endDate).format('DD-MM-YYYY');
      this.startDate = Moment(this.startDate).format('DD-MM-YYYY');
      this.sectionDefinitions = this.sectionsDef;
      this.resolveLationParams();
    }
  }

  get data() {
    return this._data;
  }

  constructor(
    private mohReportService: MOHReportService,
    private locationResourceService: LocationResourceService,
    private domSanitizer: DomSanitizer
  ) {}

  public ngOnInit() {}

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public takeSnapshotAndExport() {
    const elementToSnapshot = this.contentToSnapshot.nativeElement;

    html2canvas(elementToSnapshot).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('MOH-731.pdf');
    });
  }

  public generatePdf(): void {
    this.resolveLationParams();
  }

  public generateMoh731ByLocation(params: any, rowData, sectionDefinitions) {
    if (params && rowData && sectionDefinitions) {
      this.isBusy = true;
      // console.log('making pdf', rowData);
      this.mohReportService
        .generatePdf(params, rowData, sectionDefinitions)
        .pipe(take(1))
        .subscribe(
          (pdf) => {
            this.pdfSrc = pdf.pdfSrc;
            this.pdfMakeProxy = pdf.pdfProxy;
            this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
              this.pdfSrc
            );
            this.isBusy = false;
          },
          (err) => {
            console.error(err);
            this.errorFlag = true;
            this.isBusy = false;
          }
        );
    }
  }

  public afterLoadCompletes(pdf: PDFDocumentProxy): void {
    this.numberOfPages = pdf.numPages;
    this.pdfProxy = pdf;
  }

  public printMohReport(): void {
    this.pdfMakeProxy.print();
  }

  public downloadPdf(): void {
    this.pdfMakeProxy.download('moh_731_report' + '.pdf');
  }

  public nextPage(): void {
    this.page++;
  }

  public prevPage(): void {
    this.page--;
  }

  public resolveLationParams(): void {
    this.isBusy = true;
    this.locationResourceService.getLocations().subscribe(
      (locations: any[]) => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < locations.length; i++) {
          if (locations[i]) {
            // add district,facility and county details
            let stateProvince = locations[i].stateProvince;
            let district = locations[i].countyDistrict;
            district = district ? district : 'N/A';
            stateProvince = stateProvince ? stateProvince : 'N/A';

            const details = {
              district: district,
              county: stateProvince,
              facility: locations[i].name,
              facilityName: locations[i].name
            };
            this.locations[locations[i].uuid] = details;
          }
        }

        this.moh731Report(this.mohReports, this.sectionDefinitions);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  public extractMonthAndYear(dateString: string) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Creating a Date object to validate the date
      const dateObject = new Date(year, month - 1, day); // Month is zero-based

      if (!isNaN(dateObject.getTime())) {
        // Date is valid, extract month and year
        this.month = dateObject.toLocaleString('default', { month: 'long' });
        this.year = year.toString();
      } else {
        // Invalid date
        console.error('Invalid date format.');
      }
    } else {
      // Invalid date format
      console.error('Invalid date format.');
    }
  }

  private moh731Report(reportsData, sectionDefinitions) {
    if (Array.isArray(reportsData) && reportsData.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      // for (let i = 0; i < reportsData.length; i++) {

      const paramsArray = this.getLocationHeaders(reportsData);
      this.location = paramsArray;
      this.extractMonthAndYear(paramsArray[0].endDate);
      const rowsArray = this.getJoinLocations(reportsData);
      this.reportData = reportsData;
      this.mohReportService
        .generateMultiplePdfs(paramsArray, rowsArray, sectionDefinitions)
        .pipe(take(1))
        .subscribe(
          (pdf) => {
            this.pdfSrc = pdf.pdfSrc;
            this.pdfMakeProxy = pdf.pdfProxy;
            this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
              this.pdfSrc
            );
            this.isBusy = false;
          },
          (err) => {
            console.error(err);
            this.errorFlag = true;
            this.isBusy = false;
          }
        );
    }
  }

  private getJoinLocations(reportsData) {
    const rowsArray = [];
    reportsData.forEach((element) => {
      if (element.join_location) {
        rowsArray.push(element);
      }
    });

    return rowsArray;
  }

  private getLocationHeaders(reportDataArray) {
    let paramsArray = [];
    reportDataArray.forEach((element) => {
      if (element.location_uuid) {
        paramsArray.push(this.getParams(element.location_uuid));
      }
    });

    // process location aggregation
    if (this.isAggregated) {
      const aggregatedLocationsHeader = {
        facilityName: '',
        facility: '',
        district: '',
        county: '',
        startDate: this.startDate,
        endDate: this.endDate,
        location_uuid: '',
        location_name: ''
      };

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.selectedLocations.length; i++) {
        if (this.selectedLocations[i].value) {
          const p = this.getParams(this.selectedLocations[i].value);
          if (
            aggregatedLocationsHeader.facilityName.indexOf(p.facilityName) < 0
          ) {
            aggregatedLocationsHeader.facilityName =
              aggregatedLocationsHeader.facilityName +
              (aggregatedLocationsHeader.facilityName.length === 0
                ? ''
                : ', ') +
              p.facilityName;
          }

          if (aggregatedLocationsHeader.facility.indexOf(p.facility) < 0) {
            aggregatedLocationsHeader.facility =
              aggregatedLocationsHeader.facility +
              (aggregatedLocationsHeader.facility.length === 0 ? '' : ', ') +
              p.facility;
          }

          if (aggregatedLocationsHeader.district.indexOf(p.district) < 0) {
            aggregatedLocationsHeader.district =
              aggregatedLocationsHeader.district +
              (aggregatedLocationsHeader.district.length === 0 ? '' : ', ') +
              p.district;
          }

          if (aggregatedLocationsHeader.county.indexOf(p.county) < 0) {
            aggregatedLocationsHeader.county =
              aggregatedLocationsHeader.county +
              (aggregatedLocationsHeader.county.length === 0 ? '' : ', ') +
              p.county;
          }

          if (
            aggregatedLocationsHeader.location_name.indexOf(p.location_name) < 0
          ) {
            aggregatedLocationsHeader.location_name =
              aggregatedLocationsHeader.location_name +
              (aggregatedLocationsHeader.location_name.length === 0
                ? ''
                : ', ') +
              p.location_name;
          }

          if (
            aggregatedLocationsHeader.location_uuid.indexOf(p.location_uuid) < 0
          ) {
            aggregatedLocationsHeader.location_uuid =
              aggregatedLocationsHeader.location_uuid +
              (aggregatedLocationsHeader.location_uuid.length === 0
                ? ''
                : ', ') +
              p.location_uuid;
          }
        }
      }

      paramsArray = [aggregatedLocationsHeader];
    }
    return paramsArray;
  }

  private getParams(locationUid) {
    const locationDetails = this.getLocationResolved(locationUid);
    let params: any;
    if (locationDetails) {
      params = {
        facilityName: locationDetails.facilityName,
        facility: locationDetails.facility,
        district: locationDetails.district,
        county: locationDetails.county,
        startDate: this.startDate,
        endDate: this.endDate,
        location_uuid: locationDetails.uuid,
        location_name: locationDetails.name
      };
    }

    return params;
  }

  private getLocationResolved(locationUuid) {
    if (locationUuid && this.locations) {
      if (this.locations[locationUuid]) {
        return this.locations[locationUuid];
      } else {
        return null;
      }
    }
    return null;
  }
}
