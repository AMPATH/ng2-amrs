import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter,
} from "@angular/core";

import * as Moment from "moment";

@Component({
  selector: "patients-requiring-vl-report-filters",
  templateUrl: "./patients-requiring-vl-report-filters.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientsRequiringVLReportFiltersComponent implements OnInit {
  @Output()
  public generateReport = new EventEmitter();

  @Output()
  public startDateChange = new EventEmitter<Date>();

  @Output()
  public endDateChange = new EventEmitter<Date>();

  @Input()
  public parentIsBusy = false;

  public filterCollapsed = false;

  private _startDate: Date;
  public get startDate(): Date {
    return this._startDate;
  }
  @Input()
  public set startDate(v: Date) {
    // console.log('changing date', v);
    this._startDate = v;
    this.startDateChange.emit(this.startDate);
  }

  public get startDateString(): string {
    return this.startDate ? Moment(this.startDate).format("YYYY-MM-DD") : null;
  }
  public set startDateString(v: string) {
    this.startDate = new Date(v);
  }

  public get endDateString(): string {
    return this.endDate ? Moment(this.endDate).format("YYYY-MM-DD") : null;
  }
  public set endDateString(v: string) {
    this.endDate = new Date(v);
  }

  private _endDate: Date;
  public get endDate(): Date {
    return this._endDate;
  }
  @Input()
  public set endDate(v: Date) {
    // console.log('changing date', v);
    this._endDate = v;
    this.endDateChange.emit(this.endDate);
  }

  constructor() {}

  public ngOnInit() {}

  public onClickedGenerate() {
    this.generateReport.emit();
  }
}
