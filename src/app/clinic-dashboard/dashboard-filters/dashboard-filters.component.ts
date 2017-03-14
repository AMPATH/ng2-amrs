import { Component, Input, Output, ViewEncapsulation, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardFiltersComponent implements OnInit {
  @Input() options: Array<any>;
  @Input() indicators: Array<any>;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() ageRangeStart: number;
  @Input() ageRangeEnd: number;
  @Output() onDateChange = new EventEmitter<any>();
  @Output() onGenderChange = new EventEmitter<any>();
  @Output() onIndicatorChange = new EventEmitter<any>();
  @Output() onAgeChange = new EventEmitter<any>();
  @Output() onAgeChangeFinish = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {
  }

  onDateChanged(range: any) {
    this.onDateChange.emit(range);
  }

  onAgeChanged(data: any) {
    this.onAgeChange.emit(data);
  }

  onGenderChanged(data: any) {
    this.onGenderChange.emit(data);
  }

  onAgeChangeFinished(data: any) {
    this.onAgeChangeFinish.emit(data);
  }

  onIndicatorChanged(indicators: Array<any>) {
    if (indicators.length > 0) {
      this.onIndicatorChange.emit(indicators);
    }
  }
}
