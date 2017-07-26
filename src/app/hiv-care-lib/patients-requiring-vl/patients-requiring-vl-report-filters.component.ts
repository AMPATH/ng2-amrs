import {
    Component, OnInit, Input, Output,
    ChangeDetectionStrategy, EventEmitter
} from '@angular/core';

import * as Moment from 'moment';

@Component({
    selector: 'patients-requiring-vl-report-filters',
    templateUrl: 'patients-requiring-vl-report-filters.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PatientsRequiringVLReportFilters implements OnInit {
    @Output()
    generateReport = new EventEmitter();

    @Output()
    startDateChange = new EventEmitter<Date>();

    @Output()
    endDateChange = new EventEmitter<Date>();

    @Input()
    parentIsBusy: boolean = false;

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
    @Input()
    public set endDate(v: Date) {
        // console.log('changing date', v);
        this._endDate = v;
        this.endDateChange.emit(this.endDate);
    }

    constructor() { }

    ngOnInit() { }

    onClickedGenerate() {
        this.generateReport.emit();
    }
}
