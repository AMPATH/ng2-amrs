import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class ClinicalSummaryVisualizationService {
  colCallback = new Subject<any>();

  constructor() {

  }

  get generateTabularViewColumns(): Array<any> {
    let columns = [];
    let translateColumns = Object.keys(this.translateColumns);
    for (let i = 0; i < translateColumns.length; i++) {

      if (!translateColumns[i].match(
          new RegExp('not_on_arv|on_nevirapine|on_efavirenz|on_lopinavir' +
            '|on_atazanavir|on_raltegravir|on_other_arv_drugs'))
      ) {
        columns.push({
          headerName: this.translateColumns[translateColumns[i]],
          pinned: translateColumns[i] === 'reporting_month',
          onCellClicked: (params) => {
            this.colCallback.next(params);
          },
          cellRenderer: (column) => {
            let col = translateColumns[i];
            if (col !== 'reporting_month') {
              return '<a href="javascript:void(0);" title="'
                + this.translateColumns[translateColumns[i]] +
                '">' + column.value + '</a>';
            } else {
              return column.value;
            }
          },
          field: translateColumns[i]
        });
      }
    }
    return columns;
  }

  generateTableData(data): Array<any> {
    return data;
  }

  get translateColumns() {

    let translateMap = {
      'reporting_month': 'Reporting Month',
      'currently_in_care_total': 'Patients In Care',
      'on_art_total': 'Patients On ART',
      'not_on_art_total': 'Patients Not On ART',
      'patients_requiring_vl': 'Patients Qualified For VL',
      'tested_appropriately': 'On ART with VL',
      'not_tested_appropriately': 'On ART without VL',
      'due_for_annual_vl': 'Due For Annual VL',
      'pending_vl_orders': 'Ordered & Pending VL Result',
      'missing_vl_order': 'Missing VL Order',
      'virally_suppressed': 'Virally Suppressed',
      'perc_virally_suppressed': '% Virally Suppressed',
      'perc_tested_appropriately': '% on ART with VL',
      'not_virally_suppressed': 'Not Virally Suppressed',
      'not_on_arv': 'Not On Any ARV Drugs',
      'on_nevirapine': 'Nevirapine',
      'on_efavirenz': 'Efavirenz',
      'on_lopinavir': 'Lopinavir',
      'on_atazanavir': 'Atazanavir',
      'on_raltegravir': 'Raltegravir',
      'on_other_arv_drugs': 'Others'
    };

    return translateMap;
  }

  get flipTranlateColumns() {
    return _.invert(this.translateColumns);
  }

  getMonthDateRange(year: number, month: number): any {
    let startDate = moment([year, month]);
    let endDate = moment(startDate).endOf('month');
    return {
      startDate: startDate,
      endDate: endDate
    };
  }
}
