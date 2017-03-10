import { Component, Input, Output, ViewEncapsulation, OnInit, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment/moment';

@Component({
  selector: 'dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardFiltersComponent implements OnInit {
  @Input() options: any;
  @Input() indicators: Array<any>;
  @Input() filterModel: any;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() ageRangeStart: number;
  @Input() ageRangeEnd: number;
  @Output() filterModelChange = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {
    this.filterModel = {};
  }

  onDateChanged(range: any) {
    _.extend(this.filterModel, _.mapValues(range, (_date) =>  moment(_date)));
    this.filterModelChange.emit(this.filterModel);
  }

  onGenderChanged(data: any) {
    _.extend(this.filterModel, data);
    this.filterModelChange.emit(this.filterModel);
  }

  onAgeChangeFinished(data: any) {
    _.extend(this.filterModel, data);
    this.filterModelChange.emit(this.filterModel);
  }

  onIndicatorChanged(indicators: Array<any>) {
    if (indicators.length > 0) {
      _.extend(this.filterModel, indicators);
      this.filterModelChange.emit(this.filterModel);
    }
  }
}
