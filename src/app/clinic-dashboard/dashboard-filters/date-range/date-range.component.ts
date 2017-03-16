import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements OnInit {
  @Input() startDate: string;
  @Input() endDate: string;
  @Output() onDateChange = new EventEmitter<any>();

  ngOnInit() {
    let now = moment();
    this.startDate = this.startDate ? this.startDate : now.clone().subtract(1, 'M').format();
    this.endDate  = this.endDate ? this.endDate : now.clone().format();
    this.onDateChange.emit({startDate: this.startDate, endDate: this.endDate});
  }

  updateStartDate(startDate) {
    this.startDate = startDate;
    if (this.endDate) {
      this.onDateChange.emit({startDate: this.startDate, endDate: this.endDate});
    }
  }

  updateEndDate(endDate) {
    this.endDate = endDate;
    if (this.startDate) {
      this.onDateChange.emit({startDate: this.startDate, endDate: this.endDate});
    }
  }
}
