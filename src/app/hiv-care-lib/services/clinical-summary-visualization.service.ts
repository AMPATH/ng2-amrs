import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class ClinicalSummaryVisualizationService {
  public colCallback = new Subject<any>();

  constructor() {}

  get generateTabularViewColumns(): Array<any> {
    const columns = [];

    const translateColumns = Object.keys(
      this.translateColumns['clinical-hiv-comparative-overview']
    );
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < translateColumns.length; i++) {
      columns.push({
        headerName:
          this.translateColumns['clinical-hiv-comparative-overview'][
            translateColumns[i]
          ],
        pinned: translateColumns[i] === 'reporting_month',
        onCellClicked: (params) => {
          this.colCallback.next(params);
        },
        cellRenderer: (column) => {
          const col = translateColumns[i];
          let value = column.value;
          if (
            translateColumns[i] === 'perc_virally_suppressed' ||
            translateColumns[i] === 'perc_tested_appropriately'
          ) {
            value = value.toFixed(1);
          }
          if (col !== 'reporting_month') {
            return (
              '<a href="javascript:void(0);" title="' +
              this.translateColumns['clinical-hiv-comparative-overview'][
                translateColumns[i]
              ] +
              '">' +
              value +
              '</a>'
            );
          } else {
            return column.value;
          }
        },
        field: translateColumns[i]
      });
      if (translateColumns[i] === 'reporting_month') {
        columns[i].sort = 'desc';
      }
    }
    return columns;
  }

  public generateTableData(data): Array<any> {
    return data;
  }

  get translateColumns() {
    const translateMap = {
      'clinical-hiv-comparative-overview': {
        reporting_month: 'Reporting Month',
        currently_in_care_total: 'Patients In Care',
        on_art_total: 'Patients On ART',
        not_on_art_total: 'Patients Not On ART',
        patients_requiring_vl: 'Patients Qualified For VL',
        tested_appropriately: 'On ART with VL',
        not_tested_appropriately: 'On ART without VL',
        due_for_annual_vl: 'Due For Annual VL',
        pending_vl_orders: 'Ordered & Pending VL Result',
        missing_vl_order: 'Missing VL Order',
        virally_suppressed: 'Virally Suppressed',
        perc_virally_suppressed: '% Virally Suppressed',
        perc_tested_appropriately: '% on ART with VL',
        not_virally_suppressed: 'Not Virally Suppressed'
      },
      'clinical-art-overview': {
        not_on_arv: 'Not On Any ARV Drugs',
        on_nevirapine: 'Nevirapine',
        on_efavirenz: 'Efavirenz',
        on_lopinavir: 'Lopinavir',
        on_atazanavir: 'Atazanavir',
        on_raltegravir: 'Raltegravir',
        on_other_arv_drugs: 'Others'
      },
      'clinical-patient-care-status-overview': {
        patients_continuing_care: 'Patients In Care',
        transferred_out_patients: 'Transferred Out Patients',
        deceased_patients: 'Deceased Patients',
        untraceable_patients: 'Untraceable Patients',
        hiv_negative_patients: 'HIV Negative Patients',
        self_disengaged_from_care: 'Self Disengaged From Care',
        defaulters: 'Defaulters',
        other_patient_care_status: 'Others'
      }
    };

    return translateMap;
  }

  get flipTranlateColumns() {
    const flippedCols = {};
    _.each(this.translateColumns, (cols, index) => {
      flippedCols[index] = _.invert(cols);
    });
    return flippedCols;
  }

  public getMonthDateRange(year: number, month: number): any {
    const startDate = moment([year, month]);
    const endDate = moment(startDate).endOf('month');
    return {
      startDate: startDate,
      endDate: endDate
    };
  }
}
