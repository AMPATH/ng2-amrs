import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ClinicalSummaryVisualizationService } from '../services/clinical-summary-visualization.service';
const highcharts = require('highcharts');
import * as Moment from 'moment';
@Component({
  selector: 'hiv-care-overview-chart',
  styleUrls: ['hiv-care-overview-chart.component.css'],
  templateUrl: 'hiv-care-overview-chart.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HivCareComparativeChartComponent implements OnInit {
  public indicatorDef: Array<any> = [];
  public showHivCareTabularView = true;
  public showIndicatorDefinitions = false;
  private xAxisCategories: Array<any> = [];
  private patientsInCare: Array<any> = [];
  private patientsOnArt: Array<any> = [];
  private percOnArtWithVl: Array<any> = [];
  private virallySuppressed: Array<any> = [];
  private chartTitle = 'A comparative graph showing HIV Care analysis';
  private _options = new BehaviorSubject<any>(null);
  private data: any;
  private _dates: any;

  constructor(
    private route: ActivatedRoute,
    private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService,
    private router: Router
  ) {
    if (!this.options) {
      this.options = {};
    }
  }

  @Input()
  public set options(value) {
    this._options.next(value);
  }
  public get options() {
    return this._options.getValue();
  }
  public get dates(): any {
    return this._dates;
  }
  @Input('dates')
  public set dates(v: any) {
    this._dates = v;
  }

  public ngOnInit() {
    if (this._options) {
      this._options.subscribe((options) => {
        if (options) {
          this.data = options.data;
          this.indicatorDef = options.indicatorDefinitions;
          this.renderChart(options);
          this.resetDataSets();
        }
      });
    }
  }

  public goToPatientList(indicator, filters) {
    const dateRange =
      this.clinicalSummaryVisualizationService.getMonthDateRange(
        filters.split('/')[0],
        filters.split('/')[1] - 1
      );

    this.router.navigate(
      [
        './patient-list',
        'clinical-hiv-comparative-overview',
        indicator,
        dateRange.startDate.format('DD/MM/YYYY') +
          '|' +
          dateRange.endDate.format('DD/MM/YYYY')
      ],
      { relativeTo: this.route }
    );
  }

  public renderChart(options) {
    let startDate: any;
    let endDate: any;
    this.processChartData();
    if (this._dates) {
      startDate = Moment(this._dates.startDate).format('DD-MM-YYYY');
      endDate = Moment(this._dates.endDate).format('DD-MM-YYYY');
    }

    const that = this;
    _.merge(options, {
      colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
      title: { text: this.chartTitle },
      subtitle: {
        text: 'Starting from ' + startDate + ' To ' + endDate
      },
      chart: {
        zoomType: 'xy',
        alignTicks: false,
        events: {
          redraw: true
        }
      },
      background2: '#F0F0EA',
      plotOptions: {
        candlestick: {
          lineColor: '#404048'
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                const indicators =
                  that.clinicalSummaryVisualizationService.flipTranlateColumns;
                that.goToPatientList(
                  indicators['clinical-hiv-comparative-overview'][
                    this.series.name
                  ],
                  this.category
                );
              }
            }
          }
        }
      },
      xAxis: [
        {
          categories: this.xAxisCategories,
          gridLineWidth: 1,
          title: {
            text: 'Date (Month)'
          },
          crosshair: true
        }
      ],
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: '{value}',
            style: {
              color: highcharts.getOptions().colors[0]
            }
          },
          tickInterval: 100,
          title: {
            text: 'Number Of Patients',
            style: {
              color: highcharts.getOptions().colors[0]
            }
          }
        },
        {
          // Secondary yAxis
          title: {
            text: 'Percent (%)',
            rotation: -90,
            padding: 10,
            style: {
              color: highcharts.getOptions().colors[1]
            }
          },
          tickInterval: 10,
          max: 100,
          endOnTick: true,
          labels: {
            format: '{value}',
            style: {
              color: highcharts.getOptions().colors[1]
            }
          },
          opposite: true
        }
      ],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'horizontal'
      },
      series: [
        {
          name: 'Patients In Care',
          type: 'spline',
          yAxis: 0,
          data: this.patientsInCare,
          tooltip: {
            valueSuffix: ''
          }
        },
        {
          name: 'Patients On ART',
          type: 'spline',
          yAxis: 0,
          data: this.patientsOnArt,
          tooltip: {
            valueSuffix: ''
          }
        },
        {
          name: '% on ART with VL',
          type: 'spline',
          yAxis: 1,
          data: this.percOnArtWithVl,
          tooltip: {
            valueSuffix: ''
          }
        },
        {
          name: '% Virally Suppressed',
          type: 'spline',
          yAxis: 1,
          data: this.virallySuppressed,
          tooltip: {
            valueSuffix: ''
          }
        }
      ]
    });
  }

  public processChartData() {
    _.each(this.data, (result: any) => {
      this.xAxisCategories.push(result.reporting_month);
      this.patientsInCare.push(result.currently_in_care_total);
      this.patientsOnArt.push(result.on_art_total);
      this.virallySuppressed.push(result.perc_virally_suppressed);
      this.percOnArtWithVl.push(result.perc_tested_appropriately);
    });
  }

  public resetDataSets() {
    this.xAxisCategories = [];
    this.patientsInCare = [];
    this.patientsOnArt = [];
    this.virallySuppressed = [];
    this.percOnArtWithVl = [];
  }
}
