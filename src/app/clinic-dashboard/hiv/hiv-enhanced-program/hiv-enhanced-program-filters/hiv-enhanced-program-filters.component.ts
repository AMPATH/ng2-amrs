import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'app-hiv-enhanced-program-filters',
  templateUrl: './hiv-enhanced-program-filters.component.html',
  styleUrls: ['./hiv-enhanced-program-filters.component.css']
})
export class HivEnhancedFiltersComponent implements OnInit {
  public filterCollapsed: boolean;

  @Output()
  public generateReport = new EventEmitter();

  @Output()
  public startDateChange = new EventEmitter<Date>();

  @Output()
  public endDateChange = new EventEmitter<Date>();

  @Output()
  public viremiaFilterChange = new EventEmitter<string>();

  @Input()
  public parentIsBusy = false;

  private _startDate: Date;
  public get startDate(): Date {
    return this._startDate;
  }
  @Input()
  public set startDate(v: Date) {
    this._startDate = v;
    this.startDateChange.emit(this.startDate);
  }

  @Input()
  public set viremiaFilter(v: string) {
    this.viremiaOption = v;
    this.viremiaFilterChange.emit(this.viremiaOption);
  }

  public get startDateString(): string {
    return this.startDate ? Moment(this.startDate).format('YYYY-MM-DD') : null;
  }
  public set startDateString(v: string) {
    this.startDate = new Date(v);
  }

  public get endDateString(): string {
    return this.endDate ? Moment(this.endDate).format('YYYY-MM-DD') : null;
  }
  public set endDateString(v: string) {
    this.endDate = new Date(v);
  }

  private _endDate: Date;
  public get endDate(): Date {
    return this._endDate;
  }

  private viremiaOption = 'all';

  @Input()
  public set endDate(v: Date) {
    this._endDate = v;
    this.endDateChange.emit(this.endDate);
  }

  constructor() {}

  public ngOnInit() {}

  public onClickedGenerate() {
    this.generateReport.emit();
  }

  public optionSelected(option) {
    this.viremiaFilterChange.emit(option);
  }
}
