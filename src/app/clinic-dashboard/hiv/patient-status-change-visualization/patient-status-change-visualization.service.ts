import { Injectable, ViewChild } from '@angular/core';
import { PatientStatusDatalistCellComponent } from './patient-status-data-list-cell.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
import * as _ from 'lodash';
const highCharts = require('highcharts');

@Injectable()
export class PatientStatuChangeVisualizationService {
  public indicatorsKeys: Array<any> = [
    {
      value: 'active_return',
      label: 'Active Return Analysis',
      indicator: 'active_return'
    },
    {
      value: 'new_enrollment',
      label: 'New Enrollment Analysis',
      indicator: 'new_enrollments'
    },
    {
      value: 'transfer_in',
      label: 'Transfer In Analysis',
      indicator: 'transfer_in'
    },
    { value: 'LTFU', label: 'LTFU Analysis', indicator: 'LTFU' },
    {
      value: 'transfer_out',
      label: 'Transfer Out Analysis',
      indicator: 'transfer_out_patients'
    },
    { value: 'dead', label: 'Deaths Analysis', indicator: 'deaths' },
    {
      value: 'HIV_negative',
      label: 'HIV Negative Analysis',
      indicator: 'HIV_negative_patients'
    },
    {
      value: 'self_disengaged',
      label: 'Self Disengagements Analysis',
      indicator: 'self_disengaged_patients'
    },
    {
      value: 'self_transfer_out',
      label: 'Self Transfer Out Analysis',
      indicator: 'self_transfer_out'
    }
  ];
  public renderOptions: any = {
    cumulativeAnalysis: {
      chartOptions: {
        barIndicators: [],
        lineIndicators: [{ name: 'total_patients', yAxis: 0 }],
        areaIndicators: [],
        columnIndicators: [
          { name: 'active_in_care', yAxis: 0, stack: 'total_patients' },
          { name: 'LTFU', yAxis: 0, stack: 'total_patients' },
          { name: 'deaths', yAxis: 0, stack: 'total_patients' },
          { name: 'transfer_out_patients', yAxis: 0, stack: 'total_patients' },
          { name: 'HIV_negative_patients', yAxis: 0, stack: 'total_patients' },
          {
            name: 'self_disengaged_patients',
            yAxis: 0,
            stack: 'total_patients'
          }
        ]
      },
      tableOptions: {
        columnOptions: {
          reporting_month: {
            columnTitle: 'Reporting Month',
            tooltip: 'This is the reporting month',
            pinned: true,
            color: 'deepskyblue',
            width: 140,
            patient_list: false
          },
          total_patients: {
            columnTitle: 'Total Patients',
            pinned: false,
            color: 'deepskyblue',
            width: 120,
            patient_list: true
          },
          active_in_care: {
            columnTitle: 'Active Patients',
            pinned: false,
            color: 'deepskyblue',
            width: 130,
            patient_list: true
          },
          LTFU: {
            columnTitle: 'LTFU Cumulative',
            pinned: false,
            color: 'deepskyblue',
            patient_list: true,
            width: 160
          },
          deaths: {
            columnTitle: 'Dead Cumulative',
            pinned: false,
            color: 'deepskyblue',
            width: 160,
            patient_list: true
          },
          HIV_negative_patients: {
            columnTitle: 'HIV -Ve Cumulative',
            pinned: false,
            color: 'deepskyblue',
            width: 160,
            patient_list: true
          },
          transfer_out_patients: {
            columnTitle: 'Transfer Out Cumulative',
            pinned: false,
            color: 'deepskyblue',
            width: 200,
            patient_list: true
          },
          self_disengaged_patients: {
            columnTitle: 'Self Disengaged Cumulative',
            pinned: false,
            color: 'deepskyblue',
            width: 250,
            patient_list: true
          }
        }
      }
    },
    monthlyAnalysis: {
      chartOptions: {
        barIndicators: [],
        lineIndicators: [
          {
            name: 'patient_change_from_past_month',
            yAxis: 0
          }
        ],
        areaIndicators: [],
        columnIndicators: []
      },
      tableOptions: {
        columnOptions: {
          reporting_month: {
            columnTitle: 'Reporting Month',
            tooltip: 'This is the reporting month',
            pinned: true,
            color: 'deepskyblue',
            width: 137,
            patient_list: false
          }
        }
      }
    },
    cohortAnalysis: {
      chartOptions: {
        barIndicators: [],
        lineIndicators: [],
        areaIndicators: [],
        columnIndicators: []
      },
      tableOptions: {
        columnOptions: {
          from_month: {
            columnTitle: 'Starting Month',
            tooltip: 'This is theStarting Cohort Month',
            pinned: false,
            color: 'deepskyblue',
            width: 127,
            patient_list: false
          },
          to_month: {
            columnTitle: 'Ending Month',
            tooltip: 'This is the Ending Cohort Month',
            pinned: false,
            color: 'deepskyblue',
            width: 125,
            patient_list: false
          },
          state_change: {
            columnTitle: 'State Change',
            tooltip:
              'This is state change from starting cohort month to ending cohort month',
            pinned: false,
            color: 'deepskyblue',
            width: 275,
            patient_list: true
          },
          counts: {
            columnTitle: 'Count',
            tooltip: 'Patient counts change',
            pinned: false,
            color: 'deepskyblue',
            width: 200,
            patient_list: true
          }
        }
      }
    }
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  public generateChart(options) {
    options = _.extend(
      options,
      this.renderOptions[options.renderType].chartOptions
    );
    if (options.renderType === 'cumulativeAnalysis') {
      return this.generateCumulativeChart(options);
    } else if (options.renderType === 'cohortAnalysis') {
      return {};
    } else if (options.renderType === 'monthlyAnalysis') {
      return this.generateMonthlyAnalysisChart(options);
    }
  }

  public generateCumulativeChart(options) {
    const columnSeries = this.generateSeries(
      options,
      options.columnIndicators,
      'column'
    );
    const barSeries = this.generateSeries(
      options,
      options.barIndicators,
      'bar'
    );
    const lineSeries = this.generateSeries(
      options,
      options.lineIndicators,
      'spline'
    );
    const areaSeries = this.generateSeries(
      options,
      options.areaIndicators,
      'area'
    );
    const combinedSeries = areaSeries
      .concat(columnSeries)
      .concat(barSeries)
      .concat(lineSeries);
    return {
      chart: {
        zoomType: 'xy',
        alignTicks: false,
        events: {
          redraw: true
        }
      },
      colors: [
        '#50B432',
        '#DDDF00',
        '#d62728',
        '#7324FF',
        '#24CBE5',
        '#FF9655',
        '#058DC7',
        '#64E572',
        '#FFF263',
        '#6AF9C4'
      ],
      title: {
        text: 'Patient Care Status Cumulative Analysis'
      },
      subtitle: {
        text:
          'This graph shows cumulative breakdown of patient care status indicators.' +
          ' For each month, Total Patients = Active + LTFU + Deaths + Transfer Out' +
          ' + HIV Negative + Self Disengaged'
      },
      zoomType: 'x',
      xAxis: {
        categories: this.generateCategories(options.data),
        title: { text: 'Months' },
        crosshair: true
      },
      yAxis: [
        {
          title: {
            text: 'Number of patients',
            style: {
              color: highCharts.getOptions().colors[0]
            }
          },
          labels: {
            format: '{value}',
            style: {
              color: highCharts.getOptions().colors[0]
            }
          },
          lineWidth: 2,
          tickWidth: 1
        }
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: ' +
          '<b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          },
          stacking: 'normal'
        }
      },
      series: _.uniq(combinedSeries)
    };
  }

  public generateMonthlyAnalysisChart(chartOptions) {
    const options: any = {};
    Object.assign(options, chartOptions);
    const colors: Array<any> = this.getMonoChromeColors(options.analysisType);
    const lineIndicators = _.union(options.lineIndicators, [
      { name: options.analysisType, yAxis: 1 }
    ]);
    const columnSeries = this.generateSeries(
      options,
      this.generateSeriesDefinition(options.analysisType),
      'column'
    );
    const barSeries = this.generateSeries(
      options,
      options.barIndicators,
      'bar'
    );
    const lineSeries = this.generateSeries(options, lineIndicators, 'spline');
    const areaSeries = this.generateSeries(
      options,
      options.areaIndicators,
      'area'
    );
    const combinedSeries = areaSeries
      .concat(columnSeries)
      .concat(barSeries)
      .concat(lineSeries);
    return {
      events: {
        redraw: true
      },
      title: {
        text: this.getAnalysisTypeById(options.analysisType).label
      },
      subtitle: {
        text:
          'This graph shows monthly transition of patients to/from ' +
          this.snakeToTitle(options.analysisType) +
          ' Patient Status'
      },
      colors: colors,
      zoomType: 'x',
      xAxis: {
        categories: this.generateCategories(options.data),
        title: { text: 'Months' },
        lineWidth: 2,
        tickWidth: 2,
        crosshair: true
      },
      yAxis: [
        {
          title: {
            text: 'Number of patients',
            style: {
              color: highCharts.getOptions().colors[0]
            }
          },
          labels: {
            format: '{value}',
            style: {
              color: highCharts.getOptions().colors[0]
            }
          },
          lineWidth: 2,
          tickWidth: 2
        },
        {
          // Secondary yAxis
          gridLineWidth: 0,
          title: {
            text: this.snakeToTitle(options.analysisType),
            style: {
              color: highCharts.getOptions().colors[2]
            }
          },
          labels: {
            format: '{value}',
            style: {
              color: highCharts.getOptions().colors[2]
            }
          },
          opposite: true
        }
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: ' +
          '<b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          },
          stacking: 'normal'
        }
      },
      series: _.uniq(combinedSeries)
    };
  }

  public generateSeriesDefinition(analysisType: string): any {
    const seriesDef = [];
    const indicators = this.getGainLostIndicators(analysisType);

    _.each(indicators.patientGain, (indicator) => {
      seriesDef.push({
        name: indicator,
        yAxis: 0,
        stack: 'patient_change_from_past_month'
      });
    });

    _.each(indicators.patientLost, (indicator) => {
      seriesDef.push({
        name: indicator,
        yAxis: 0,
        stack: 'patient_change_from_past_month'
      });
    });
    return seriesDef;
  }

  public generateColumnDefinitions(
    renderType: string,
    analysisType: string,
    indicatorDef: any
  ) {
    const columnLabelMap: any = this.generateDynamicColumns(
      analysisType,
      renderType,
      indicatorDef
    );
    const columns = [];
    for (const row in columnLabelMap) {
      if (columnLabelMap.hasOwnProperty(row)) {
        const rowData = columnLabelMap[row];
        if (_.isEmpty(rowData.tooltip) || _.isUndefined(rowData.tooltip)) {
          rowData.tooltip = this.getIndicatorDefinition(indicatorDef, row);
        }
        const column = {
          headerName: rowData.columnTitle,
          tooltipTitle: rowData.tooltip || '',
          color: rowData.color || 'deepskyblue',
          analysisType: renderType,
          pinned: rowData.pinned,
          width: rowData.width,
          suppressSizeToFit: true,
          suppressToolPanel: true,
          enableRowGroup: true,
          enablePivot: true,
          hide: rowData.hide || false,
          field: row
        };
        if (rowData.patient_list) {
          column['cellRendererFramework'] = PatientStatusDatalistCellComponent;
        }
        columns.push(column);
      }
    }
    return columns;
  }

  public processData(
    plot: string,
    result,
    analysisType,
    removeLast
  ): Array<any> {
    if (analysisType === 'cohortAnalysis') {
      // tslint:disable-next-line:no-shadowed-variable
      result.forEach((data, i) => {
        const formatted = data.indicator;
        data['state_change'] = this.snakeToTitle(
          formatted.replace('self_transfer_out_', 'self_transfer_in_')
        );
      });
      return result;
    }
    const indicators = this.getGainLostIndicators(plot);
    const data = _.cloneDeep(result); // making sure it is immutable
    _.each(data, (row, i) => {
      row['patients_gained'] = 0;
      _.each(indicators.patientGain, (indicator) => {
        row['patients_gained'] += Math.abs(row[indicator]);
      });

      row['patients_lost'] = 0;
      _.each(indicators.patientLost, (indicator) => {
        row[indicator] = Math.abs(row[indicator]) * -1;
        row['patients_lost'] += row[indicator];
      });

      row['patient_change_from_past_month'] =
        row['patients_gained'] + row['patients_lost'];
    });
    // remove last element
    const finalData = !(analysisType === 'monthlyAnalysis' && removeLast)
      ? _.cloneDeep(data)
      : _.cloneDeep(data).slice(1);
    return finalData;
  }

  private generateDynamicColumns(
    analysisType: string,
    renderType: string,
    indicatorDef: any
  ): any {
    let column = {};
    Object.assign(
      column,
      this.renderOptions[renderType].tableOptions.columnOptions
    );
    if (
      renderType === 'cumulativeAnalysis' ||
      renderType === 'cohortAnalysis'
    ) {
      return column; // not a dynamic view
    }
    const indicators = this.getGainLostIndicators(analysisType);
    column = _.merge(column, {
      [indicators.indicator]: {
        columnTitle: this.snakeToTitle(indicators.indicator),
        tooltip: this.getIndicatorDefinition(
          indicatorDef,
          indicators.indicator
        ),
        pinned: true,
        color: 'deepskyblue',
        width: 150,
        patient_list: true
      }
    });

    _.each(indicators.patientGain, (indicator) => {
      const patientStatus = indicator.split('_to_');
      const tooltip =
        'These are patients who were: "' +
        this.snakeToTitle(patientStatus[0]) +
        '" in the previous month but changed to "' +
        this.snakeToTitle(patientStatus[1]) +
        '" this reporting month';
      column = _.merge(column, {
        [indicator]: {
          columnTitle: this.snakeToTitle(indicator),
          tooltip: tooltip,
          color: 'green',
          pinned: false,
          width: 200,
          patient_list: true
        }
      });
    });

    _.each(indicators.patientLost, (indicator) => {
      const patientStatus = indicator.split('_to_');
      const tooltip =
        'These are patients who were: "' +
        this.snakeToTitle(patientStatus[0]) +
        '" in the previous month but changed to "' +
        this.snakeToTitle(patientStatus[1]) +
        '" this reporting month';
      column = _.merge(column, {
        [indicator]: {
          columnTitle: this.snakeToTitle(indicator),
          tooltip: tooltip,
          color: 'red',
          pinned: false,
          width: 200,
          patient_list: true
        }
      });
    });

    // add calculated indicators: patients_gained, patients_lost, patient_change_from_past_month
    column = _.merge(column, {
      ['patients_gained']: {
        columnTitle: this.snakeToTitle('patients_gained'),
        tooltip: 'Summation of all indicators in green',
        pinned: false,
        color: 'green',
        width: 200,
        patient_list: true
      }
    });
    column = _.merge(column, {
      ['patients_lost']: {
        columnTitle: this.snakeToTitle('patients_lost'),
        tooltip: 'Summation of all indicators in red',
        pinned: false,
        color: 'red',
        width: 200,
        patient_list: true
      }
    });
    column = _.merge(column, {
      ['patient_change_from_past_month']: {
        columnTitle: this.snakeToTitle('patient_change_from_past_month'),
        tooltip: 'Patients Gained -  Patients Lost',
        color: 'deepskyblue',
        pinned: false,
        width: 200,
        patient_list: true
      }
    });
    return column;
  }

  private getIndicatorDefinition(defns: any, indicator: string): any {
    if (_.isEmpty(defns) || _.isUndefined(defns[indicator])) {
      return '';
    }
    return defns[indicator].description;
  }

  private getGainLostIndicators(plot: string): any {
    const indicators = {
      indicator: plot,
      patientGain: [],
      patientLost: [],
      xToX: []
    };
    _.each(this.indicatorsKeys, (key, j) => {
      _.each(this.indicatorsKeys, (key2, i) => {
        if (key.value === plot && key.value !== key2.value) {
          indicators.indicator = key.indicator;
          indicators.patientLost.push(key.value + '_to_' + key2.value);
        } else if (key2.value === plot && key.value !== key2.value) {
          indicators.patientGain.push(key.value + '_to_' + key2.value);
        } else if (key.value === key2.value) {
          indicators.xToX.push(key.value + '_to_' + key2.value);
        }
      });
    });
    return indicators;
  }

  private getAnalysisTypeById(id: string): any {
    let r = null;
    _.some(this.indicatorsKeys, (el) => {
      r = el;
      return el.value === id;
    });
    return r;
  }

  private getMonoChromeColors(analysisType) {
    const indicators = this.getGainLostIndicators(analysisType);
    const colors = [];
    for (let i = 0; i < indicators.patientGain.length; i += 1) {
      colors.push(
        highCharts
          .Color('#337ab7')
          .brighten((i - 4) / 7)
          .get()
      );
    }
    for (let i = 0; i < indicators.patientLost.length; i += 1) {
      colors.push(
        highCharts
          .Color('#c1100e')
          .brighten((i - 3) / 7)
          .get()
      );
    }
    colors.push('#7324FF');
    colors.push('#50B432');
    return colors;
  }

  private snakeToTitle(str) {
    const join = str
      .split('_')
      .map((item) => {
        return item.charAt(0).toUpperCase() + item.substring(1);
      })
      .join(' ');
    return join;
  }

  private generateCategories(dataSet) {
    const processed = [];
    for (const result of dataSet) {
      processed.push(result.reporting_month);
    }
    return processed;
  }

  private generateSeries(options, indicators, type) {
    const processed = [];
    const dataSet = options.data;
    for (const indicator of indicators) {
      const data = dataSet.map((_data) => {
        return _data[indicator.name];
      });
      const column = {
        type: type,
        name: this.snakeToTitle(indicator.name),
        stack: indicator.stack || indicator.name,
        yAxis: indicator.yAxis || 0,
        point: {
          events: {
            click: (event) => {
              const _data = dataSet.find((a) => {
                return a.reporting_month === event.point.category;
              });
              const dateMoment = Moment(_data.reporting_date);
              const startOfMonth = dateMoment
                .startOf('month')
                .format('YYYY-MM-DD');
              const endOfMonth = dateMoment.endOf('month').format('YYYY-MM-DD');
              this.router.navigate(['../patient-list'], {
                relativeTo: this.route,
                queryParams: {
                  startDate: startOfMonth,
                  endDate: endOfMonth,
                  indicator: indicator.name,
                  analysis: options.renderType
                }
              });
            }
          }
        }
      };

      column['data'] = data;
      processed.push(column);
    }
    return processed;
  }
}
