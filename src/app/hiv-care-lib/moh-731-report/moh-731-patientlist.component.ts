import { Component, OnInit } from '@angular/core';
import { Moh731PatientListBaseComponent } from './moh-731-patientlist-base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Moh731ResourceService } from './moh-731-fake-resource';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'moh-731-patientlist',
  templateUrl: 'moh-731-patientlist.component.html'
})
export class Moh731PatientListComponent extends Moh731PatientListBaseComponent implements OnInit {
  moh731Params: any;
  patientData: Array<any> = [];
  dataSource: any;
  overrideColumns: Array<any> = [];
  extraColumns: Array<any> = [];
  _startDate: any;
  _endDate: any;
  locations: string = '';
  indicator: string;

  constructor(public route: ActivatedRoute,
              public moh731Resource: Moh731ResourceService,
              private router: Router) {
    super(route, moh731Resource);
    this.route.data.subscribe((params) => {
      this.moh731Params = params['moh731Params'];
    });
  }

  ngOnInit() {
    let rowCount: number = 0;
    this.addExtraColumns(this.moh731Params.indicators);
    this._startDate = moment(this.startDate);
    this._endDate = moment(this.endDate);
    if (this.moh731Params.locations) {
      _.each(this.moh731Params.locations, (location) => {
        this.locations = _.trimStart(_.trimEnd((this.locations + ', ' + location.display)
          , ','), ',');
      });
    }

    if (this.moh731Params.indicators) {
      this.searchIndicator(this.moh731Params.indicators, this.moh731Params.indicator).then(
        (matchingIndicator: Array<any>) => {
          if (matchingIndicator.length > 0) {
            this.indicator = matchingIndicator[0]['label'];
          }
        });
    }
    rowCount += this.moh731Params.size;
    let that = this;
    this.dataSource = {
      paginationPageSize: 5,
      rowCount: rowCount,
      getRows: function (params) {
        let currentRowData = that.moh731Params.result.slice(params.startRow, params.endRow);
        let lastRow = -1;
        if (currentRowData.length <= params.endRow) {
          lastRow = currentRowData.length;
        }
        params.successCallback(currentRowData, lastRow);
      }
    };

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

  goTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/' + patientUuid + '/general/landing-page']);
  }

  addExtraColumns(indicators: Array<any>) {

    let extraColumns = [
      'enrollment_date',
      'arv_first_regimen_start_date',
      'cur_regimen_arv_start_date',
      'cur_arv_line',
      'vl_1',
      'vl_1_date',
      'has_pending_vl_test',
    ];

    _.each(extraColumns, (indicator) => {
      this.searchIndicator(indicators, indicator).then((matchingIndicator: Array<any>) => {
        if (matchingIndicator.length > 0) {
          this.extraColumns.push({
            headerName: matchingIndicator[0]['label'],
            field: indicator
          });
        }
      });
    });
  }

  searchIndicator(indicators: Array<any>, trackedIndicator: string) {
    let matchingIndicator = _.filter(indicators, (_indicator) => {
      let search = _indicator['indicator'];
      return search && search.match(new RegExp(trackedIndicator));
    });
    return new Promise((resolve) => {
      resolve(matchingIndicator);
    });
  }
}
