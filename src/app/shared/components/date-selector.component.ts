import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import * as Moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'date-selector',
    templateUrl: 'date-selector.component.html'
})
export class DateSelectorComponent implements OnInit, OnDestroy {
    selectedDate: any;
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

    @Input() hideDatePicker: boolean = false;
    @Output() dateSelected = new EventEmitter();
    private _datePipe: DatePipe;
    private _default: any;
    private model: Object = {
        date: {
            year: Moment().year(), month: Moment().format('MMMM'),
            day: Moment().format('DD')
        }
    };

    private dateOptions: IMyOptions = {
        // other options...
        dateFormat: 'dd-mm-yyyy',
    };

    constructor() {
        this._datePipe = new DatePipe('en-US');
    }

    ngOnInit() {
        if (this.default) {
            this.selectedDate = Moment(new Date(this.default));
            this.initDate(this.selectedDate);
        } else {
            this.selectedDate = new Date();
        }

        this.dateSelected.emit(this.selectedDate);
    }

    ngOnDestroy() {
    }

    public navigateDay(value) {

        if (value) {
            let m = Moment(new Date(this.selectedDate));
            let revisedDate = m.add(value, 'd');

            this.initDate(revisedDate);

            this.selectedDate = this._datePipe.transform(
                revisedDate, 'yyyy-MM-dd');
            this.dateSelected.emit(this.selectedDate);

        }
    }

    onDateChanged(event: IMyDateModel): void {
        this.selectedDate = this.getDate(event.date);
        let formattedDate = this._datePipe.transform(
            this.selectedDate, 'yyyy-MM-dd');
        this.dateSelected.emit(formattedDate);
    }

    initDate(date) {
        this.model = {
            date: {
                year: date.year(), month: date.format('MMM'),
                day: date.format('D')
            }
        };
    }

    getDate(dateObject: any) {
        return dateObject.year + '-' + dateObject.month + '-' + dateObject.day;
    }
}
