import {
  Component, OnInit, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {
  PatientStatuChangeVisualizationService
}
  from './patient-status-change-visualization.service';
import * as _ from 'lodash';

@Component({
  selector: 'patient-status-change-visualization',
  templateUrl: './patient-status-change-visualization.component.html',
  providers: [PatientStatuChangeVisualizationService],
  styleUrls: ['./patient-status-change-visualization.component.css']
})

export class PatientStatusChangeVisualizationComponent implements OnInit, OnChanges {

  @Input()
  public renderType: string;
  public renderOptions: any = {
    cumulativeBreakdown: {
      chartOptions: {
        barIndicators: [],
        lineIndicators: ['total_patients'],
        areaIndicators: [],
        columnIndicators: ['active_in_care', 'LTFU', 'deaths',
          'transfer_out_patients', 'HIV_negative_patients',
          'self_disengaged_patients']
      },
      tableOptions: {
        columnOptions: {
          'reporting_month': {
            columnTitle: 'Reporting Month',
            tooltip: 'This is the reporting month',
            pinned: true,
            width: 150,
            patient_list: false
          },
          'total_patients': {
            columnTitle: 'Total Patients',
            tooltip: 'These are all patients ever enrolled into care ' +
            'as of end of the reporting month',
            pinned: true,
            width: 160,
            patient_list: true
          },
          'active_in_care': {
            columnTitle: 'Active Patients',
            tooltip: 'A patient is active in care if it has been ' +
            'less than 90 days from the RTC date within the given reporting period ',
            pinned: true,
            width: 160,
            patient_list: true
          },
          'LTFU': {
            columnTitle: 'LTFU Cumulative',
            tooltip: 'A patient is LTFU if it has been greater than' +
            ' 90 days from the RTC date within the given reporting period ',
            pinned: false,
            patient_list: true,
            width: 160
          },
          'deaths': {
            columnTitle: 'Dead Cumulative',
            tooltip: 'These are dead patients ever reported',
            pinned: false,
            width: 160,
            patient_list: true
          },
          'HIV_negative_patients': {
            columnTitle: 'HIV -Ve Cumulative',
            tooltip: 'These are HIV Negative patients ever reported',
            pinned: false,
            width: 160,
            patient_list: true
          },
          'transfer_out_patients': {
            columnTitle: 'Transfer Out Cumulative',
            tooltip: 'These are patients ever transferred' +
            ' to other Ampath or NON Ampath facility',
            pinned: false,
            width: 200,
            patient_list: true
          },
          'self_disengaged_patients': {
            columnTitle: 'Self Disengaged Cumulative',
            tooltip: 'These are patients ever disengaged out of care by themselves',
            pinned: false,
            width: 200,
            patient_list: true
          },
          'cumulative_deficit': {
            columnTitle: 'Cumulative Deficit',
            tooltip: 'Number of patients who are neither dead,' +
            ' negative, self-disengaged, active nor LTFU',
            pinned: false,
            width: 160,
            patient_list: true,
            hide: false
          }

        }
      }
    },
    monthlyBreakdown: {
      chartOptions: {
        barIndicators: [],
        lineIndicators: ['patient_change_this_month'],
        areaIndicators: [],
        columnIndicators: ['new_patients', 'deaths_this_month',
          'transfer_out_patients_this_month', 'HIV_negative_patients_this_month',
          'self_disengaged_patients_this_month'
        ]
      },
      tableOptions: {

        columnOptions: {
          'reporting_month': {
            columnTitle: 'Reporting Month',
            tooltip: 'This is the reporting month',
            pinned: true,
            width: 150,
            patient_list: false
          },
          'total_patients': {
            columnTitle: 'Total Patients',
            tooltip: 'These are all patients ever enrolled into ' +
            'care as of end of the reporting month',
            pinned: true,
            width: 150,
            patient_list: true
          },
          'active_in_care': {
            columnTitle: 'Active Patients',
            tooltip: 'A patient is active in care if it has been less' +
            ' than 90 days from the RTC date within the given reporting period ',
            pinned: true,
            width: 150,
            patient_list: true
          },
          'new_patients': {
            columnTitle: 'New Patients',
            tooltip: 'These are patients enrolled into care within the reporting month',
            pinned: false,
            width: 120,
            patient_list: true
          },
          'transfer_out_patients_this_month': {
            columnTitle: 'Transfer Out this Month',
            tooltip: 'These are patients transferred to other Ampath' +
            ' or NON Ampath facility within the reporting month',
            pinned: false,
            width: 180,
            patient_list: true
          },
          'deaths_this_month': {
            columnTitle: 'Dead this Month',
            tooltip: 'These are deaths that occurred within the reporting month',
            pinned: false,
            width: 120,
            patient_list: true
          },
          'HIV_negative_patients_this_month': {
            columnTitle: 'HIV -Ve this Month',
            tooltip: 'These are HIV Negative patients that were reported' +
            ' within the reporting month',
            pinned: false,
            width: 120,
            patient_list: true
          },
          'self_disengaged_patients_this_month': {
            columnTitle: 'Self Disengaged this Month',
            tooltip: 'These are patients that have disengaged themselves' +
            ' from care within the reporting month',
            pinned: false,
            width: 150,
            patient_list: true
          },
          'transfer_in': {
            columnTitle: 'Transfer In',
            tooltip: 'These are patients who transferred into the selected' +
            ' facility within the reporting month',
            pinned: false,
            width: 120,
            patient_list: true
          },
          'patients_gained_this_month': {
            columnTitle: 'Gain',
            tooltip: 'row.new_patients + row.transfer_in',
            pinned: false,
            width: 90,
            patient_list: true
          },
          'patients_lost_this_month': {
            columnTitle: 'Lost',
            tooltip: 'row.transfer_out_patients_this_month + row.HIV_negative_patients_this_month' +
            ' + row.deaths_this_month + row.self_disengaged_patients_this_month',
            pinned: false,
            width: 90,
            patient_list: true
          },
          'patient_change_this_month': {
            columnTitle: 'Change This Month',
            tooltip: 'row.patients_gained_this_month + row.patients_lost_this_month',
            pinned: false,
            width: 200,
            patient_list: true,
            hide: false
          }

        }
      }
    },
    transitionBreakdown: {
      chartOptions: {
        barIndicators: [],
        lineIndicators: ['patient_change_from_past_month'],
        areaIndicators: [],
        columnIndicators: [
          'LTFU_to_active_in_care', 'active_in_care_to_LTFU', 'active_in_care_to_death',
          'active_in_care_to_transfer_out', 'transfer_in', 'new_patients'

        ]
      },
      tableOptions: {

        columnOptions: {
          'reporting_month': {
            columnTitle: 'Reporting Month',
            tooltip: 'This is the reporting month',
            pinned: true,
            width: 150,
            patient_list: false
          },
          'total_patients': {
            columnTitle: 'Total patients',
            tooltip: 'These are all patients ever enrolled into care as ' +
            'of end of the reporting month',
            pinned: true,
            width: 120,
            patient_list: true
          },
          'active_in_care': {
            columnTitle: 'Active Patients',
            tooltip: 'A patient is active in care if it has been less than 90 days' +
            ' from the RTC date within the given reporting period',
            pinned: true,
            width: 130,
            patient_list: true
          },
          'transfer_in': {
            columnTitle: 'Transfer In',
            tooltip: 'These are patients who transferred into the selected facility' +
            ' within the reporting month',
            pinned: false,
            width: 100,
            patient_list: true
          },
          'LTFU_to_active_in_care': {
            columnTitle: 'LTFU to Active In care',
            tooltip: 'These are patients who were LTFU in the previous reporting' +
            ' month, but changed to active in care in this reporting month',
            pinned: false,
            width: 200,
            patient_list: true
          },
          'active_in_care_to_LTFU': {
            columnTitle: 'Active To LTFU',
            tooltip: 'These are patient who were Active in care on the previous ' +
            'reporting month, but changed to LTFU in this reporting month',
            pinned: false,
            width: 150,
            patient_list: true
          },
          'active_in_care_to_transfer_out': {
            columnTitle: 'Active To Transfer Out',
            tooltip: 'These are patients who were Active in care in the previous ' +
            'reporting month, but changed to transferred out in this reporting month',
            pinned: false,
            width: 200,
            patient_list: true
          },
          'active_in_care_to_death': {
            columnTitle: 'Active To Dead',
            tooltip: 'These are patients who were  Active in care in the previous' +
            ' reporting month, but died within this reporting month',
            pinned: false,
            width: 150,
            patient_list: true
          },
          'patients_gained': {
            columnTitle: 'Gain',
            tooltip: 'row.new_patients + row.transfer_in + row.LTFU_to_active_in_care',
            pinned: false,
            width: 90,
            patient_list: true
          },
          'patients_lost': {
            columnTitle: 'Lost',
            tooltip: 'row.active_in_care_to_transfer_out + row.active_in_care_to_death ' +
            '+ row.active_in_care_to_LTFU',
            pinned: false,
            width: 90,
            patient_list: true
          },
          'patient_change_from_past_month': {
            columnTitle: 'Change From Past Month',
            tooltip: 'row.patients_gained + row.patients_lost',
            pinned: false,
            width: 200,
            patient_list: true,
            hide: false
          }

        }
      }
    }
  };
  @Input()
  public data: Array<any> = [];
  public chartOptions: any;
  public columns: Array<any> = [];

  constructor(private patientStatusService: PatientStatuChangeVisualizationService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.renderView();
    }
  }

  ngOnInit() {
    this.renderView();
  }

  public renderChart(): void {
    this.chartOptions = this.patientStatusService.generateChart({
      lineIndicators: this.renderOptions[this.renderType].chartOptions.lineIndicators,
      areaIndicators: this.renderOptions[this.renderType].chartOptions.areaIndicators,
      barIndicators: this.renderOptions[this.renderType].chartOptions.barIndicators,
      columnIndicators: this.renderOptions[this.renderType].chartOptions.columnIndicators,
      renderType: this.renderType,
      data: this.data
    });
  }

  public renderDataTable(): void {
    let columnDefinitions: Array<any> =
      this.renderOptions[this.renderType].tableOptions.columnOptions;
    this.columns = this.patientStatusService
      .generateColumnDefinitions(columnDefinitions);
  }

  public renderView(): void {
    this.renderChart();
    this.renderDataTable();
  }

  public redrawChart(): void {
    this.chartOptions = {};
    this.renderChart();
  }

}
