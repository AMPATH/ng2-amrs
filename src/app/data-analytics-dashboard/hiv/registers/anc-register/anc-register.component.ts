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
import { ANCRegisterResourceService } from 'src/app/etl-api/anc-register-resource.service';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'app-anc-register',
  templateUrl: './anc-register.component.html',
  styleUrls: ['./anc-register.component.css']
})
export class AncRegisterComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public ancRegisterData: any = [];
  public columnDefs: any = [];
  public reportName = 'AnteNatal (ANC) Register MOH 405';
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
  @ViewChild('cntdarcontentToSnapshot') contentToSnapshot!: ElementRef;

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
    public ancRegisterService: ANCRegisterResourceService,
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
    this.ancRegisterData = [];
    this.getANCRegisterData(this.params);
    this.generated = true;
  }

  public storeParamsInUrl() {
    this.params = {
      locationUuids: this.jointLocationUuids,
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getANCRegisterData(params: any) {
    this.isLoading = true;
    this.ancRegisterService.getANCRegisterRegister(params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.ancRegisterData = data;
        this.calculateTotalSummary();
        this.isLoading = false;
        this.showDraftReportAlert(this._month);
      }
    });
  }

  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.ancRegisterData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.ancRegisterData, (row) => {
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

    html2canvas(elementToSnapshot, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a0');

      const pageWidth = 841; // A0 width (portrait)
      const pageHeight = 1189; // A0 height

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;

      // Add additional pages if required
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('MOH 405 ANC Register.pdf');
    });
  }
  filterData(summaryData: any, condition: string, value) {
    if (!summaryData) {
      return '';
    }
    return (
      summaryData.filter((data) => {
        const field = data[condition];

        if (!value) {
          return;
        }

        return field === value;
      }).length || ''
    );
  }

  getPropertyTotals(
    summaryData: any[],
    property: string,
    propertyValue: string
  ) {
    return (
      summaryData.filter((data) => data[property] === propertyValue).length ||
      ''
    );
  }

  getPropertyTotalsWithAge(
    summaryData: any[],
    property: string,
    propertyValue: string,
    minAge: number,
    maxAge: number
  ) {
    return (
      summaryData.filter(
        (data) =>
          data[property] === propertyValue &&
          data['age'] >= minAge &&
          data['age'] <= maxAge
      ).length || ''
    );
  }
}
