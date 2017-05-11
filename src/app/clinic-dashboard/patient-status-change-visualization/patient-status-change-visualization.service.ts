import { Injectable, ViewChild } from '@angular/core';
import { PatientStatusDatalistCellComponent } from './patient-status-data-list-cell.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class PatientStatuChangeVisualizationService {
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  public generateChart(options) {
    let columnSeries = this.generateSeries(options.data, options.columnIndicators, 'column');
    let barSeries = this.generateSeries(options.data, options.barIndicators, 'bar');
    let lineSeries = this.generateSeries(options.data, options.lineIndicators, 'spline');
    let areaSeries = this.generateSeries(options.data, options.areaIndicators, 'area');
    let combinedSeries = areaSeries.concat(columnSeries).concat(barSeries).concat(lineSeries);
    if (options.renderType === 'cumulativeBreakdown') {
      return this.generateCumulativeChart(options, combinedSeries);
    } else if (options.renderType === 'monthlyBreakdown') {
      return this.generateMonthlyChart(options, combinedSeries);
    } else if (options.renderType === 'transitionBreakdown') {
      return this.generateTransitionBreakdownChart(options, combinedSeries);
    }
  }

  public generateCumulativeChart(options, combinedSeries) {
    return {
      events: {
        redraw: true
      },
      colors: [
        '#50B432',
        '#DDDF00', '#d62728',
        '#E61DFF', '#24CBE5',
        '#FF9655', '#058DC7', '#64E572',
        '#FFF263', '#6AF9C4'],
      title: {
        text: 'Patient Care Status Cumulative Analysis',
      },
      subtitle: {
        text: 'This graph shows cumulative breakdown of patient care status indicators.' +
        ' For each month, Total Patients = Active + LTFU + Deaths + Transfer Out' +
        ' + HIV Negative + Self Disengaged',
      },
      zoomType: 'x',
      xAxis: {
        categories: this.generateCategories(options.data),
        title: {text: 'Months'},
        crosshair: true
      },
      yAxis: {
        title: {text: 'Number of patients'}
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: ' +
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
          stacking: 'normal',

        }
      },
      series: combinedSeries
    };
  }

  public generateMonthlyChart(options, combinedSeries) {
    return {
      events: {
        redraw: true
      },
      title: {
        text: 'Patient Care Status Monthly Analysis',
      },
      subtitle: {
        text: 'This graph shows monthly breakdown of patient care status indicator.' +
        ' Unlike Cumulative Analysis graph, the indicators for this graph does not ' +
        'include counts for previous months.'
      },
      colors: [
        '#50B432',
        '#d62728',
        '#E61DFF', '#24CBE5',
        '#FF9655', '#058DC7', '#64E572', '#DDDF00',
        '#FFF263', '#6AF9C4'],
      zoomType: 'x',
      xAxis: {
        categories: this.generateCategories(options.data),
        title: {text: 'Months'},
        crosshair: true
      },
      yAxis: {
        title: {text: 'Number of patients'}
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: combinedSeries
    };
  }

  public generateTransitionBreakdownChart(options, combinedSeries) {
    return {
      events: {
        redraw: true
      },
      title: {
        text: 'Patient Care Status Change Analysis',
      },
      subtitle: {
        text: 'This graph shows monthly transition of patients to/from Active In Care Status',
      },
      colors: [
        '#50B432',
        '#DDDF00',
        '#d62728',
        '#E61DFF',
        '#24CBE5',
        '#FF9655',
        '#058DC7',
        '#64E572',
        '#FFF263',
        '#6AF9C4'],
      zoomType: 'x',
      xAxis: {
        categories: this.generateCategories(options.data),
        title: {text: 'Months'},
        crosshair: true
      },
      yAxis: {
        title: {text: 'Number of patients'}
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: combinedSeries
    };
  }

  public generateColumnDefinitions(columnLabelMap: any) {
    let columns = [];
    for (let row in columnLabelMap) {
      if (columnLabelMap.hasOwnProperty(row)) {
        let rowData = columnLabelMap[row];
        let column = {
          headerName: rowData.columnTitle,
          tooltip: rowData.tooltip,
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

  private snakeToTitle(str) {
    return str.split('_').map(function (item) {
      return item.charAt(0).toUpperCase() + item.substring(1);
    }).join(' ');
  }

  private generateCategories(dataSet) {
    let processed = [];
    for (let result of dataSet) {
      processed.push(result.reporting_month);
    }
    return processed;
  }

  private generateSeries(dataSet, indicators, type) {
    let processed = [];
    for (let result of indicators) {
      let data = dataSet.map((data) => {
        return data[result];
      });
      let column = {
        type: type,
        name: this.snakeToTitle(result),
        point: {
          events: {
            click: (event) => {
              let data = dataSet.find((a) => {
                return a.reporting_month === event.point.category;
              });
              let dateMoment = Moment(data.reporting_date);
              let startOfMonth = dateMoment.startOf('month').format('YYYY-MM-DD');
              let endOfMonth = dateMoment.endOf('month').format('YYYY-MM-DD');
              this.router.navigate(['./patient-list']
                , {
                  relativeTo: this.route, queryParams: {
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                    indicator: result
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
