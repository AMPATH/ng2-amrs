import { Component, ViewEncapsulation, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicalSummaryVisualizationService
} from '../../services/clinical-summary-visualization.service';

@Component({
  selector: 'art-overview-chart',
  styleUrls: ['./art-overview.component.css'],
  templateUrl: './art-overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ArtOverviewComponent {
  categories: Array<any> = [];
  series: Array<any> = [];
  totalPatients: number;
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
        this.data = options.data;
        this.renderChart(options);
        this.resetDataSets();
      });
    }
  }

  goToPatientList(indicator, filters) {
    this.router.navigate(['./patient-list', 'clinical-art-overview', indicator,
        filters.startDate.format('DD/MM/YYYY') + '|' + filters.endDate.format('DD/MM/YYYY')]
      , {relativeTo: this.route});
  }

  renderChart(options) {

    this.processChartData();
    let that = this;
    _.merge(options, {
      chart: {
        type: 'pie',

        events: {
          redraw: true
        }
      },
      exporting: {
        enabled: true
      },
      plotOptions: {
        pie: {
          center: ['50%', '50%'],
          title: {
            verticalAlign: 'middle',
            name: 'ART',
            floating: true
          },
          allowPointSelect: true,
          showInLegend: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          }
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                let indicators = that.clinicalSummaryVisualizationService.flipTranlateColumns;
                if (that.options && that.options.filters.endDate) {
                  that.goToPatientList(indicators['clinical-art-overview'][this.name],
                    that.options.filters);
                }

              }
            }
          }
        }
      },
      tooltip: {
        pointFormatter: function () {
          return this.y + ' (' + this.percentage.toFixed(2) + '%)';
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        y: 100,
        verticalAlign: 'top',
        labelFormatter: function () {
          return this.name + ' (' + this.percentage.toFixed(2) + '%)';
        }
      },
      categories: this.categories,
      series: [
        {
          innerSize: '30%',
          data: this.series
        }
      ]
    });
  }

  processChartData() {
    let data = this.data[0], i = 0;
    this.totalPatients = data ? data.patients : 0;
    let colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'];
    for (let indicator in data) {
      if (!indicator.match(new RegExp('location_uuid|location_id|patients'))) {

        let cols =
          this.clinicalSummaryVisualizationService.translateColumns['clinical-art-overview'];
        console.log('sfsf', cols);
        this.categories.push(cols[indicator]);
        this.series.push({
          name: cols[indicator],
          y: data[indicator],
          color: colors[i]
        });
        i++;
      }
    }
  }

  resetDataSets() {
    this.series = [];
  }
}
