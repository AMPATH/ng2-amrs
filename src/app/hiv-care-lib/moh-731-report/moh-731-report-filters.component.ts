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

export class Moh731ReportFiltersComponent implements OnInit {
    public filterCollapsed: boolean;
    @Output()
    public generateReport = new EventEmitter();

    @Output()
    public startDateChange = new EventEmitter<Date>();

    @Output()
    public endDateChange = new EventEmitter<Date>();

    @Output()
    public isLegacyVersionChange = new EventEmitter<boolean>();

    @Output()
    public isAggregatedChange = new EventEmitter<boolean>();

    @Input()
    public locationUuids: any;

    @Output()
    public locationUuidsChange = new EventEmitter<any>();

    @Input()
    public parentIsBusy: boolean = false;

    private _showIsAggregateControl: boolean = false;
    public get showIsAggregateControl(): boolean {
        return this._showIsAggregateControl;
    }
    @Input()
    public set showIsAggregateControl(v: boolean) {
        this._showIsAggregateControl = v;
    }

    private _showLocationsControl: boolean = false;
    public get showLocationsControl(): boolean {
        return this._showLocationsControl;
    }
    @Input()
    public set showLocationsControl(v: boolean) {
        this._showLocationsControl = v;
    }

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

    private _isAggregated: boolean;
    public get isAggregated(): boolean {
        return this._isAggregated;
    }
    @Input()
    public set isAggregated(v: boolean) {
        this._isAggregated = v;
        this.isAggregatedChange.emit(this.isAggregated);
    }

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

    public ngOnInit() { }

    public onClickedGenerate() {
        this.generateReport.emit();
    }

    public changeIsLegacyValue(val: boolean) {
        this.isLegacyVersion = val;
    }

    public onLocationsSelected(val) {
        console.log('selected a location', val);
        this.locationUuidsChange.emit(val.locations);
    }
}
