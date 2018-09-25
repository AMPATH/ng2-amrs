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
  templateUrl: 'moh-731-patientlist.component.html',
  styleUrls: ['moh-731-patientlist.component.css']
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
  public hasLoadedAll: boolean = false;
  public dataLoadedPerIndicator: boolean = false;
  public dataLoaded: Array<any> = [];
  public params: any = {
    startDate: '',
    endDate: '',
    locations: '',
    indicators: '',
    isLegacy: ''

  };
  public _locations: string = '';
  public _indicator: string = '';
  public _startDate;
  public _endDate;
  public busyIndicator: any = {
     busy: false,
     message: ''
  };

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
    this.route
    .queryParams
    .subscribe((params) => {
    if (params) {
            this.params = params;
            this.loadPatientList(this.params);
        }
    }, (error) => {
        console.error('Error', error);
    });
  }

  public loadPatientList(params: any) {
    console.log('Params', params);
    this.busyIndicator = {
      busy: true,
      message: 'Loading Patient List...please wait'
    };
    let rowCount: number = 0;
    this.moh731PatientListResourceService.getMoh731PatientListReport({
      indicator: params.indicators,
      isLegacy: params.isLegacy,
      startIndex: this.startIndex[params.indicators] ? this.startIndex[params.indicators] : 0,
      startDate: moment(params.startDate).format('YYYY-MM-DD'),
      endDate: moment(params.endDate).endOf('day').format('YYYY-MM-DD'),
      reportName: 'MOH-731-report-2017',
      locationUuids: _.isArray(params.locations) ? params.locations.join(',') : params.locations
    }).take(1).subscribe((data) => {
      this.isLoading = false;
      if (data.errorMessage) {
        this.hasError = true;
        console.log(data);
      } else {
        /**
         * Track everything per indicator provided
         */
        this.patientListPerIndicator = this.patientList[params.indicators] ?
          this.patientList[params.indicators] : [];
        this.patientListPerIndicator = this.patientListPerIndicator.concat(data.result);
        this.patientList[params.indicators] = this.patientListPerIndicator;
        this.currentStartIndexPerIndicator = this.startIndex[params.indicators];
        this.currentStartIndexPerIndicator = this.currentStartIndexPerIndicator ?
          this.currentStartIndexPerIndicator : 0;
        this.currentStartIndexPerIndicator += data.size;
        this.startIndex[params.indicators] = this.currentStartIndexPerIndicator;
        if (data.size < 300 && !this.dataLoaded[params.indicators]) {
          this.dataLoaded[params.indicator] = true;
        }

        //  console.log('loaded patients', data);
        if (data.result.length < 300) {
          this.hasLoadedAll = true;
        }

        this.dataLoadedPerIndicator = this.dataLoaded[params.indicators];
        this._startDate = moment(params.startDate);
        this._endDate = moment(params.endDate);
        if (data.locations) {
          let _location = '';
          _.each(data.locations, (location: any) => {
            _location = _.trimStart(_.trimEnd((_location + ', ' + location.name), ','), ',');
          });
          this._locations = _location;
        }

        if (data.indicators) {
          this.searchIndicator(data.indicators, params.indicators).then(
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
      this.busyIndicator = {
        busy: false,
        message: ''
      };
    }, (err) => {
      this.isLoading = false;
      this.busyIndicator = {
        busy: false,
        message: ''
      };
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
    this.loadPatientList(this.params);
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
