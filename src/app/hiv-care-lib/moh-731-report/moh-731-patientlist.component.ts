import {
  Component, OnInit, Input, Output, OnChanges,
  SimpleChange, EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
  Moh731PatientListResourceService
} from '../../etl-api/moh-731-patientlist-resource.service';

@Component({
  selector: 'moh-731-patientlist',
  templateUrl: 'moh-731-patientlist.component.html'
})
export class Moh731PatientListComponent implements OnInit, OnChanges {
  public patientList: Array<any> = [];
  public patientListPerIndicator: Array<any> = [];
  public dataSource: any;
  public hasError: boolean = false;
  public overrideColumns: Array<any> = [];
  public extraColumns: Array<any> = [];
  public startIndex: Array<any> = [];
  public currentStartIndexPerIndicator: number;
  public isLoading: boolean = false;
  public dataLoadedPerIndicator: boolean = false;
  public dataLoaded: Array<any> = [];
  @Input() public startDate;
  @Input() public endDate: any;
  @Input() public locations;
  @Input() public isLegacy;
  @Input() public indicator: string;
  @Output() public onLoadComplete = new EventEmitter<any>();
  public _locations: string = '';
  public _indicator: string = '';
  public _startDate;
  public _endDate;

  constructor(public route: ActivatedRoute,
              private router: Router,
              private moh731PatientListResourceService: Moh731PatientListResourceService) {
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // tslint:disable-next-line
    // for (let propName in changes) {
    //   let changedProp = changes[propName];
    //   if (!changedProp.isFirstChange()) {
    //     console.log('redrawing patient list');
    //     this.loadPatientList();
    //   }
    // }
  }

  public ngOnInit() {
    this.loadPatientList();
  }

  public loadPatientList() {
    let rowCount: number = 0;
    this.moh731PatientListResourceService.getMoh731PatientListReport({
      indicator: this.indicator,
      isLegacy: this.isLegacy,
      startIndex: this.startIndex[this.indicator] ? this.startIndex[this.indicator] : 0,
      startDate: moment(this.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.endDate).endOf('day').format('YYYY-MM-DD'),
      reportName: 'MOH-731-report',
      locationUuids: _.isArray(this.locations) ? this.locations.join(',') : this.locations
    }).subscribe((data) => {
      this.onLoadComplete.emit(true);
      this.isLoading = false;
      if (data.errorMessage) {
        this.hasError = true;
        console.log(data);
      } else {
        /**
         * Track everything per indicator provided
         */
        this.patientListPerIndicator = this.patientList[this.indicator] ?
          this.patientList[this.indicator] : [];
        this.patientListPerIndicator = this.patientListPerIndicator.concat(data.result);
        this.patientList[this.indicator] = this.patientListPerIndicator;
        this.currentStartIndexPerIndicator = this.startIndex[this.indicator];
        this.currentStartIndexPerIndicator = this.currentStartIndexPerIndicator ?
          this.currentStartIndexPerIndicator : 0;
        this.currentStartIndexPerIndicator += data.size;
        this.startIndex[this.indicator] = this.currentStartIndexPerIndicator;
        if (data.size < 300 && !this.dataLoaded[this.indicator]) {
          this.dataLoaded[this.indicator] = true;
        }
        this.dataLoadedPerIndicator = this.dataLoaded[this.indicator];
        this._startDate = moment(this.startDate);
        this._endDate = moment(this.endDate);
        if (data.locations) {
          let _location = '';
          _.each(data.locations, (location: any) => {
            _location = _.trimStart(_.trimEnd((_location + ', ' + location.name), ','), ',');
          });
          this._locations = _location;
        }

        if (data.indicators) {
          this.searchIndicator(data.indicators, this.indicator).then(
            (matchingIndicator: Array<any>) => {
              if (matchingIndicator.length > 0) {
                this._indicator = matchingIndicator[0]['label'];
              }
            });
        }
        /*
         rowCount += data.size;
        this.dataSource = {
         paginationPageSize: 50,
         rowCount: rowCount,
         getRows: function (params) {
         let currentRowData = data.result.slice(params.startRow, params.endRow);
         let lastRow = -1;
         if (currentRowData.length <= params.endRow) {
         lastRow = currentRowData.length;
         }
         params.successCallback(currentRowData, lastRow);
         }
         };*/
        this.addExtraColumns(data.indicators);
      }
    }, (err) => {
      this.isLoading = false;
    });

    this.overrideColumns.push({
      field: 'identifiers',
      onCellClicked: (column) => {
        this.goTopatientInfo(column.data.patient_uuid);
      },
      cellRenderer: (column) => {
        return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
      }
    });
  }

  public loadMorePatients() {
    this.isLoading = true;
    this.loadPatientList();
  }

  public goTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/general/general/landing-page']);
  }

  public addExtraColumns(indicators: Array<any>) {

    let extraColumns = {
      enrollment_date: 'Enrollment Date',
      arv_first_regimen_start_date: 'ARVs Initial Start Date',
      cur_regimen_arv_start_date: 'Current ARV Regimen Start Date (edited)',
      cur_arv_line: 'Current ARV Line (edited)',
      vl_1: 'Viral Load',
      vl_1_date: 'Viral Load Date',
      has_pending_vl_test: 'Pending Viral Load Test'
    };

    // tslint:disable-next-line
    for (let indicator in extraColumns) {
      this.extraColumns.push({
        headerName: extraColumns[indicator],
        field: indicator
      });
    }

    /*_.each(extraColumns, (indicator) => {
      this.searchIndicator(indicators, indicator).then((matchingIndicator: Array<any>) => {
        if (matchingIndicator.length > 0) {
          this.extraColumns.push({
            headerName: matchingIndicator[0]['label'],
            field: indicator
          });
        }
      });
    });*/
  }

  public searchIndicator(indicators: Array<any>, trackedIndicator: string) {
    let matchingIndicator = _.filter(indicators, (_indicator) => {
      let search = _indicator['indicator'];
      return search && search.match(new RegExp(trackedIndicator));
    });
    return new Promise((resolve) => {
      resolve(matchingIndicator);
    });
  }
}
