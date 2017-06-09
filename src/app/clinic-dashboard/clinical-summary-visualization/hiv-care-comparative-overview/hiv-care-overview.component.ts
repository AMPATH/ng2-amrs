import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ClinicalSummaryVisualizationService
} from '../../services/clinical-summary-visualization.service';
const highcharts = require('highcharts');

@Component({
  selector: 'hiv-care-overview',
  styleUrls: ['./hiv-care-overview.component.css'],
  templateUrl: './hiv-care-overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HivCareComparativeOverviewComponent implements OnInit {
  xAxisCategories: Array<any> = [];
  patientsInCare: Array<any> = [];
  patientsOnArt: Array<any> = [];
  percOnArtWithVl: Array<any> = [];
  virallySuppressed: Array<any> = [];
  indicatorDef: Array<any> = [];
  showHivCareTabularView: boolean = true;
  showIndicatorDefinitions: boolean = false;
  private _options = new BehaviorSubject<any>(null);
  private data: any;

  constructor(private route: ActivatedRoute,
              private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService,
              private router: Router) {
    if (!this.options) {
      this.options = {};
    }
  }

  @Input()
  set options(value) {
    this._options.next(value);
  }

  get options() {
    return this._options.getValue();
  }

  ngOnInit() {
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

  goToPatientList(indicator, filters) {
    this.router.navigate(['./patient-list', 'clinical-hiv-comparative-overview', indicator,
        filters.startDate.format('DD/MM/YYYY') + '|' + filters.endDate.format('DD/MM/YYYY')]
      , {relativeTo: this.route});
  }

  renderChart(options) {

    this.processChartData();

    let that = this;
    _.merge(options, {
      colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
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
                let indicators = that.clinicalSummaryVisualizationService.flipTranlateColumns;
                that.goToPatientList(
                  indicators['clinical-hiv-comparative-overview'][this.series.name],
                  that.options.filters);
              }
            }
          }
        }
      },
      xAxis: [{
        categories: this.xAxisCategories,
        gridLineWidth: 1,
        title: {
          text: 'Date (Month)'
        },
        crosshair: true
      }],
      yAxis: [
        { // Primary yAxis
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
        { // Secondary yAxis
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
        }],
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
        }]
    });
  }

  processChartData() {
    _.each(this.data, (result) => {
      this.xAxisCategories.push(result.reporting_month);
      this.patientsInCare.push(result.currently_in_care_total);
      this.patientsOnArt.push(result.on_art_total);
      this.virallySuppressed.push(result.perc_virally_suppressed);
      this.percOnArtWithVl.push(result.perc_tested_appropriately);
    });
  }

  resetDataSets() {
    this.xAxisCategories = [];
    this.patientsInCare = [];
    this.patientsOnArt = [];
    this.virallySuppressed = [];
    this.percOnArtWithVl = [];
  }

}
