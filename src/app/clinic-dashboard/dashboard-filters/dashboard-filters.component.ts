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
  @Input() public options: any;
  @Input() public indicators: Array<any>;
  @Input() public filterModel: any;
  @Input() public startDate: string;
  @Input() public endDate: string;
  @Input() public ageRangeStart: number;
  @Input() public ageRangeEnd: number;
  @Output() public filterModelChange = new EventEmitter<any>();
  constructor() {}

  public ngOnInit() {
    this.filterModel = {};
  }

  public onDateChanged(range: any) {
    _.extend(this.filterModel, _.mapValues(range, (_date) =>  moment(_date)));
    this.filterModelChange.emit(this.filterModel);
  }

  public onGenderChanged(data: any) {
    _.extend(this.filterModel, data);
    this.filterModelChange.emit(this.filterModel);
  }

  public onAgeChangeFinished(data: any) {
    _.extend(this.filterModel, data);
    this.filterModelChange.emit(this.filterModel);
  }

  public onIndicatorChanged(indicators: Array<any>) {
    if (indicators.length > 0) {
      _.extend(this.filterModel, indicators);
      this.filterModelChange.emit(this.filterModel);
    }
  }
}
