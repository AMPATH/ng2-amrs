import {
    Component, OnInit, Input, Output,
    ChangeDetectionStrategy, EventEmitter
} from '@angular/core';

import * as Moment from 'moment';

@Component({
    selector: 'moh-731-report-filters',
    templateUrl: 'moh-731-report-filters.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Moh731ReportFilters implements OnInit {
    public filterCollapsed: boolean;
    @Output()
    generateReport = new EventEmitter();

    @Output()
    startDateChange = new EventEmitter<Date>();

    @Output()
    endDateChange = new EventEmitter<Date>();

    @Output()
    isLegacyVersionChange = new EventEmitter<boolean>();

    @Input()
    parentIsBusy: boolean = false;

    // private _showIsAggregateControl: boolean = false;
    // public get showIsAggregateControl(): boolean {
    //     return this._showIsAggregateControl;
    // }
    // @Input()
    // public set showIsAggregateControl(v: boolean) {
    //     this._showIsAggregateControl = v;
    // }

    // private _showLocationsControl: boolean = false;
    // public get showLocationsControl(): boolean {
    //     return this._showLocationsControl;
    // }
    // @Input()
    // public set showLocationsControl(v: boolean) {
    //     this._showLocationsControl = v;
    // }

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

    // private _isAggregated: boolean;
    // public get isAggregated(): boolean {
    //     return this._isAggregated;
    // }
    // @Input()
    // public set isAggregated(v: boolean) {
    //     this._isAggregated = v;
    // }

    private _isLegacyVersion: boolean = true;
    public get isLegacyVersion(): boolean {
        return this._isLegacyVersion;
    }
    @Input()
    public set isLegacyVersion(v: boolean) {
        this._isLegacyVersion = v;
        this.isLegacyVersionChange.emit(this.isLegacyVersion);
    }

    constructor() { }

    ngOnInit() { }

    onClickedGenerate() {
        this.generateReport.emit();
    }

    changeIsLegacyValue(val: boolean) {
        this.isLegacyVersion = val;
    }
}
