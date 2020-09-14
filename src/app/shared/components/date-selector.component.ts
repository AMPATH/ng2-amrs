import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import * as Moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'date-selector',
  templateUrl: 'date-selector.component.html'
})
export class DateSelectorComponent implements OnInit, OnDestroy {
  public selectedDate: any;
  // @Input() default: any;

  @Input()
  public get default(): any {
    return this._default;
  }
  public set default(v: any) {
    this._default = v;

    if (Moment(v).isValid()) {
      // this.navigateDay(v);
      this.selectedDate = Moment(new Date(this.default));
      this.initDate(this.selectedDate);
      // console.log('updating', v);
    }
  }

  @Input() public hideDatePicker = false;
  @Output() public dateSelected = new EventEmitter();
  private _datePipe: DatePipe;
  private _default: any;
  private model: object = {
    date: {
      year: Moment().year(),
      month: Moment().format('MMMM'),
      day: Moment().format('DD')
    }
  };

  private dateOptions: IMyOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy'
  };

  constructor() {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    if (this.default) {
      this.selectedDate = Moment(new Date(this.default));
      this.initDate(this.selectedDate);
    } else {
      this.selectedDate = new Date();
    }

    this.dateSelected.emit(this.selectedDate);
  }

  public ngOnDestroy() {}

  public navigateDay(value) {
    if (value) {
      const m = Moment(new Date(this.selectedDate));
      const revisedDate = m.add(value, 'd');

      this.initDate(revisedDate);

      this.selectedDate = this._datePipe.transform(revisedDate, 'yyyy-MM-dd');
      this.dateSelected.emit(this.selectedDate);
    }
  }

  public onDateChanged(event: IMyDateModel): void {
    this.selectedDate = this.getDate(event.date);
    const formattedDate = this._datePipe.transform(
      this.selectedDate,
      'yyyy-MM-dd'
    );
    this.dateSelected.emit(formattedDate);
  }

  public initDate(date) {
    this.model = {
      date: {
        year: date.year(),
        month: date.format('MMM'),
        day: date.format('D')
      }
    };
  }

  public getDate(dateObject: any) {
    return dateObject.year + '-' + dateObject.month + '-' + dateObject.day;
  }
}
