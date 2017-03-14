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
  selectedIndicators: Array<any>;
  startDate: any;
  chartOptions: any;
  chartData: any;
  endDate: any;
  ageRangeStart: number;
  ageRangeEnd: number;
  selectedGenders: Array<string>;
  options: any = {
    date_range: true,
    gender_select: true,
    indicator_select: true,
    range_slider: true
  };
  constructor() {}

  ngOnInit() {
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

  onDateChanged(range: any) {
    this.generateArtOverview();
    this.startDate = moment(range.startDate);
    this.endDate = moment(range.endDate);
  }


  onAgeChanged(data: any) {
    this.ageRangeStart = data.from;
    this.ageRangeEnd = data.to;
  }

  onGenderChanged(genders: Array<any>) {
    this.selectedGenders = genders;
  }

  onAgeChangeFinished(data: any) {
    this.ageRangeStart = data.from;
    this.ageRangeEnd = data.to;
  }

  onIndicatorChanged(indicators: Array<any>) {
    if (indicators.length > 0) {
      this.selectedIndicators = indicators;
    }
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
