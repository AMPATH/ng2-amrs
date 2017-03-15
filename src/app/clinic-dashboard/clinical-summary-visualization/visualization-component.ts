import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'clinical-summary-visualization',
  templateUrl: './visualization-component.html',
  styleUrls: ['./visualization-component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VisualizationComponent implements OnInit {
  indicators: Array<any>;
  startDate: any;
  @Input() filterModel: any;
  chartOptions: any;
  chartData: any;
  endDate: any;
  options: any = {
    date_range: true,
    gender_select: true,
    indicator_select: true,
    range_slider: true
  };
  constructor() {}

  ngOnInit() {

    this.filterModel = {};
    this.indicators = [
      {
        value: 123,
        label: 'Test 123'
      },
      {
        value: 456,
        label: 'Test 456'
      },
      {
        value: 789,
        label: 'Test 789'
      }
    ];
  }

  renderCharts() {
    console.log(this.filterModel);
    this.generateArtOverview();
  }

  generateArtOverview() {
    let a = [];
    for (let i = 0; i < (Math.round(Math.random() * 40)); ++i) a[i] = i;
    this.chartData = a;
    this.chartOptions =  {
      title : { text : 'simple chart' },
      series: [{
        data: this.chartData
      }]
    };
  }
}
