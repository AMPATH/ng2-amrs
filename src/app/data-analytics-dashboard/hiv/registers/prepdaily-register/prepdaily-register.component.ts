import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { RegistersResourceService } from 'src/app/etl-api/registers-resource.service';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';

interface FilterPrepOptions {
  maxAge?: number;
  prepStatus?: string;
  statusValue?: string;
  stiStatus?: string;
  stiValue?: string;
}

@Component({
  selector: 'app-prepdaily-register',
  templateUrl: './prepdaily-register.component.html',
  styleUrls: ['./prepdaily-register.component.css']
})
export class PrepdailyRegisterComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public prepRegisterData: any = [];
  public columnDefs: any = [];
  public reportName = 'PrEP Daily Activity Register';
  public currentView = 'monthly';
  public currentViewBelow = 'pdf';
  public month: string;
  public year: number;
  public quarter: string;
  public eDate: string;
  public sDate: string;
  public jointLocationUuids: string;

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;
  public enabledControls = 'datesControl, locationControl';
  public pinnedBottomRowData: any = [];
  public _month: string;
  public isReleased = true;
  public generated = false;

  private _startDate: Date = Moment().toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = new Date();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
  }

  @ViewChild('prepcontentToSnapshot') contentToSnapshot!: ElementRef;

  public _locationUuids: any = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public register: RegistersResourceService,
    private datePipe: DatePipe,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService
  ) {
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment().format('YYYY-MM-DD'))
        : (this._month = data.month);

      this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {}

  public onMonthChange(value): any {
    this._month = Moment(value).format('MM-DD-YYYY');
  }

  public generateReport(): any {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .subscribe((data) => {
        const locationValues = data.locations.map(
          (location) => `'${location.value}'`
        );
        this.jointLocationUuids = locationValues.join(', ');
      });

    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl();
    });
    this.prepRegisterData = [];
    this.getPrEPRegisterReport(this.params);
    this.generated = true;
  }

  public storeParamsInUrl() {
    this.params = {
      locationUuids: this.jointLocationUuids,
      month: Moment(this._month).format('YYYY-MM-DD'),
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getPrEPRegisterReport(params: any) {
    this.isLoading = true;
    this.register.getPrEPRegisterReport(params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.prepRegisterData = data;
        this.isLoading = false;
        this.showDraftReportAlert(this._month);
      }
    });
  }

  public onIndicatorSelected(value) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: value.field,
        indicatorHeader: value.headerName,
        indicatorGender: value.gender,
        month: this._month,
        locationUuids: value.location,
        currentView: this.currentView
      }
    });
  }

  public showDraftReportAlert(date) {
    if (date != null && date >= Moment().format('YYYY-MM-DD')) {
      this.isReleased = false;
    } else {
      this.isReleased = true;
    }
  }

  transformDate(date: string): string | null {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public takeSnapshotAndExport() {
    const elementToSnapshot = this.contentToSnapshot.nativeElement;

    html2canvas(elementToSnapshot).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('MOH 267 PrEP Daily Activity Register.pdf');
    });
  }

  filterPrepData(
    data: any[],
    age: string,
    gender: string,
    genderValue: string,
    populationType: string,
    populationValue: string,
    minAge: number,
    options: FilterPrepOptions = {}
  ): number | string {
    if (!Array.isArray(data)) {
      return '';
    }
    const { maxAge, prepStatus, statusValue, stiStatus, stiValue } = options;

    return (
      data.filter((item) => {
        const ageValue = item[age];
        const genderMatch = item[gender] === genderValue;
        const popTypeMatch = item[populationType] === populationValue;
        const minAgeMatch = ageValue >= minAge;
        const maxAgeMatch = maxAge !== undefined ? ageValue <= maxAge : true;
        const prepStatusMatch =
          prepStatus && statusValue ? item[prepStatus] === statusValue : true;

        const stiStatusMatch =
          stiStatus && stiValue ? item[stiStatus] === stiValue : true;

        return (
          genderMatch &&
          popTypeMatch &&
          minAgeMatch &&
          maxAgeMatch &&
          prepStatusMatch &&
          stiStatusMatch
        );
      }).length || ''
    );
  }

  filterPrepDiscontinued(
    data: any[],
    age: string,
    gender: string,
    genderValue: string,
    populationType: string,
    populationValue: string,
    minAge: number,
    options: FilterPrepOptions = {}
  ): number | string {
    if (!Array.isArray(data)) {
      return '';
    }
    const { maxAge, prepStatus, statusValue, stiStatus, stiValue } = options;

    return (
      data.filter((item) => {
        const ageValue = item[age];
        const genderMatch = item[gender] === genderValue;
        const popTypeMatch = item[populationType] === populationValue;
        const minAgeMatch = ageValue >= minAge;
        const maxAgeMatch = maxAge !== undefined ? ageValue <= maxAge : true;
        const prepStatusMatch =
          prepStatus && statusValue
            ? item[prepStatus] === 'R' ||
              item[prepStatus] === 'N' ||
              item[prepStatus] === 'C'
            : true;

        const stiStatusMatch =
          stiStatus && stiValue ? item[stiStatus] === stiValue : true;

        return (
          genderMatch &&
          popTypeMatch &&
          minAgeMatch &&
          maxAgeMatch &&
          prepStatusMatch &&
          stiStatusMatch
        );
      }).length || ''
    );
  }

  filterPrepDiscontinuedTotal(
    data: any[],
    age: string,
    gender: string,
    genderValue: string,
    minAge: number,
    options: FilterPrepOptions = {}
  ): number | string {
    if (!Array.isArray(data)) {
      return '';
    }
    const { maxAge, prepStatus, statusValue, stiStatus, stiValue } = options;

    return (
      data.filter((item) => {
        const ageValue = item[age];
        const genderMatch = item[gender] === genderValue;
        const minAgeMatch = ageValue >= minAge;
        const maxAgeMatch = maxAge !== undefined ? ageValue <= maxAge : true;
        const prepStatusMatch =
          prepStatus && statusValue
            ? item[prepStatus] === 'R' ||
              item[prepStatus] === 'N' ||
              item[prepStatus] === 'C'
            : true;

        const stiStatusMatch =
          stiStatus && stiValue ? item[stiStatus] === stiValue : true;

        return (
          genderMatch &&
          minAgeMatch &&
          maxAgeMatch &&
          prepStatusMatch &&
          stiStatusMatch
        );
      }).length || ''
    );
  }

  getTotalData(
    summaryData: any[],
    gender: string,
    genderValue: string,
    age: string,
    minAge: number,
    options: FilterPrepOptions = {}
  ): number | string {
    if (!Array.isArray(summaryData)) {
      return '';
    }

    const { maxAge, prepStatus, statusValue, stiStatus, stiValue } = options;

    return (
      summaryData.filter((data) => {
        const ageValue = data[age];
        const genderMatch = data[gender] === genderValue;
        const minAgeMatch = ageValue >= minAge;
        const maxAgeMatch = maxAge !== undefined ? ageValue <= maxAge : true;
        const prepStatusMatch =
          prepStatus && statusValue ? data[prepStatus] === statusValue : true;

        const stiStatusMatch =
          stiStatus && stiValue ? data[stiStatus] === stiValue : true;

        return (
          genderMatch &&
          minAgeMatch &&
          maxAgeMatch &&
          prepStatusMatch &&
          stiStatusMatch
        );
      }).length || ''
    );
  }

  filterPrepMethod(
    data: any[],
    prepMethod: string,
    prepMethodValue: number,
    prepStatus: string,
    prepStatusValue: string
  ) {
    return (
      data.filter(
        (param) =>
          param[prepMethod] === prepMethodValue &&
          param[prepStatus] === prepStatusValue
      ).length || ''
    );
  }

  getPrepMethodTotal(data: any[], prepStatus: string, prepStatusValue: number) {
    return (
      data.filter(
        (param) =>
          (param['prep_method'] === '1' ||
            param['prep_method'] === '2' ||
            param['prep_method'] === '3' ||
            param['prep_method'] === '4') &&
          param[prepStatus] === prepStatusValue
      ).length || ''
    );
  }
}
