import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import * as Moment from 'moment';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistersResourceService } from 'src/app/etl-api/registers-resource.service';
import { DatePipe } from '@angular/common';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';

@Component({
  selector: 'app-moh731-report-view',
  templateUrl: './moh731-report-view.component.html',
  styleUrls: ['./moh731-report-view.component.css']
})
export class Moh731ReportViewComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  @Input() MOH731RegisterData: any;
  @Output() generateReportEvent = new EventEmitter<void>();
  @Output() indicatorSelectedEvent = new EventEmitter<void>();
  public columnDefs: any = [];
  public reportName = 'MOH 731 REPORT';
  public currentView = 'monthly';
  public currentViewBelow = 'pdf';
  public month: string;
  public year: number;
  public quarter: string;
  public eDate: string;
  public sDate: string;
  public jointLocationUuids = [];

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
  public showIsAggregateControl = false;
  public showLocationsControl = true;
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

  private _startDate: Date = Moment()
    .subtract(1, 'months')
    .startOf('month')
    .toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = Moment()
    .subtract(1, 'months')
    .endOf('month')
    .toDate();
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
        ? (this._month = Moment().format('YYYY-MM-DD'))
        : (this._month = data.month);

      this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {}

  public onMonthChange(value): any {
    this._month = Moment(value).format('YYYY-MM-DD');
  }

  public storeParamsInUrl() {
    this.params = {
      locationUuids: this.getSelectedLocations(this.jointLocationUuids),
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public generateReport(): any {
    this.generateReportEvent.emit();
  }

  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.MOH731RegisterData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.MOH731RegisterData, (row) => {
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
    this.indicatorSelectedEvent.emit(value);
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
      pdf.save('MOH 731 Register.pdf');
    });
  }

  private getSelectedLocations(locationUuids: any): string {
    if (!locationUuids || locationUuids.length === 0) {
      return '';
    }

    let selectedLocations = '';

    for (let i = 0; i < locationUuids.length; i++) {
      if (i === 0) {
        selectedLocations = selectedLocations + (locationUuids[0] as any).value;
      } else {
        selectedLocations =
          selectedLocations + ',' + (locationUuids[i] as any).value;
      }
    }
    return selectedLocations;
  }
}
