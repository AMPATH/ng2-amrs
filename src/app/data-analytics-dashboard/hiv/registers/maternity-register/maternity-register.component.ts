import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';
import { RegistersResourceService } from 'src/app/etl-api/registers-resource.service';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-maternity-register',
  templateUrl: './maternity-register.component.html',
  styleUrls: ['./maternity-register.component.css']
})
export class MaternityRegisterComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public maternitySummaryData: any = [];
  public columnDefs: any = [];
  public reportName = 'Martenity Register';
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
  @ViewChild('contentToSnapshot') contentToSnapshot!: ElementRef;

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

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public register: RegistersResourceService,
    private datePipe: DatePipe,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService
  ) {
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment()
            .subtract(1, 'M')
            .endOf('month')
            .format('YYYY-MM-DD'))
        : (this._month = data.month);

      this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {}

  public onMonthChange(value): any {
    // this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
    this._month = Moment(value).format('YYYY-MM-DD');
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
    this.maternitySummaryData = [];
    this.getMaternityRegister(this.params);
    this.generated = true;
  }

  public storeParamsInUrl() {
    this.params = {
      locationUuids: this.jointLocationUuids,
      month: Moment(this._month).format('YYYY-MM-DD'),
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
    console.log('MAT PARAMS: ' + JSON.stringify(this.params));
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getMaternityRegister(params: any) {
    this.isLoading = true;
    this.register.getMaternityRegister(params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        console.log('MaternityData: ', data);
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.maternitySummaryData = data;
        this.calculateTotalSummary();
        this.isLoading = false;
        this.showDraftReportAlert(this._month);
      }
    });
  }

  // public getTxNewReport(params: any) {
  //   this.isLoading = true;
  //   this.txnewReport.getTxNewReport(params).subscribe((data) => {
  //     if (data.error) {
  //       this.showInfoMessage = true;
  //       this.errorMessage = `There has been an error while loading the report, please retry again`;
  //       this.isLoading = false;
  //     } else {
  //       this.showInfoMessage = false;
  //       this.columnDefs = data.sectionDefinitions;
  //       this.txnewReportSummaryData = data.result;
  //       this.calculateTotalSummary();
  //       this.isLoading = false;
  //       this.showDraftReportAlert(this._month);
  //     }
  //   });
  // }

  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.maternitySummaryData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.maternitySummaryData, (row) => {
        Object.keys(row).map((key) => {
          if (Number.isInteger(row[key]) === true) {
            if (totalObj[key]) {
              totalObj[key] = row[key] + totalObj[key];
            } else {
              totalObj[key] = row[key];
            }
          } else {
            if (Number.isNaN(totalObj[key])) {
              totalObj[key] = 0;
            }
            if (totalObj[key] === null) {
              totalObj[key] = 0;
            }
            totalObj[key] = 0 + totalObj[key];
          }
        });
      });
      totalObj.location = 'Totals';
      totalsRow.push(totalObj);
      this.pinnedBottomRowData = totalsRow;
    }
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
    if (date != null && date >= Moment().endOf('month').format('YYYY-MM-DD')) {
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
      pdf.save('MOH 366 Care and Treatment Daily Activity.pdf');
    });
  }

  calculateAgeTotals(summaryData: any[], minAge: number, maxAge?: number) {
    return (
      summaryData.filter(
        (data) =>
          data['age'] >= minAge &&
          (maxAge === undefined || data['age'] <= maxAge)
      ).length || ''
    );
  }

  getMaternalDeathTotals(summaryData: any[], minAge: number, maxAge?: number) {
    return (
      summaryData.filter(
        (data) =>
          data['maternal_deaths_notified'] === 'Y' &&
          data['age'] >= minAge &&
          (maxAge === undefined || data['age'] <= maxAge)
      ).length || ''
    );
  }
  getParameterTotals(
    summaryData: any[],
    parameterName: string,
    parameterValue: string | number
  ) {
    return (
      summaryData.filter((data) => data[parameterName] === parameterValue)
        .length || ''
    );
  }
}
