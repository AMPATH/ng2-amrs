import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

import * as moment from "moment";

@Component({
  selector: "date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.css"],
})
export class DateRangeComponent implements OnInit {
  @Input() public startDate: string;
  @Input() public endDate: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onDateChange = new EventEmitter<any>();

  public ngOnInit() {
    const now = moment();
    this.startDate = this.startDate
      ? this.startDate
      : now.clone().subtract(1, "y").format();
    this.endDate = this.endDate ? this.endDate : now.clone().format();
    this.onDateChange.emit({
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  public updateStartDate(startDate) {
    this.startDate = startDate;
    if (this.endDate) {
      this.onDateChange.emit({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
  }

  public updateEndDate(endDate) {
    this.endDate = endDate;
    if (this.startDate) {
      this.onDateChange.emit({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
  }
}
