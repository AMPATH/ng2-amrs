import { take } from 'rxjs/operators';
import {
  Component, OnInit, EventEmitter, ElementRef, forwardRef,
  ViewEncapsulation,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Output, Input } from '@angular/core';
import { IndicatorResourceService } from '../../etl-api/indicator-resource.service';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataAnalyticsDashboardService } from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../openmrs-api/program-workflow-resource.service';
declare var jQuery;
require('ion-rangeslider');
import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { SelectDepartmentService } from './../services/select-department.service';

@Component({
  selector: 'report-filters',
  // styleUrls: ['report-filters.component.css'],
  templateUrl: 'report-filters.component.html',
  styles: [`
    ng-select > div > div.multiple input {
      width: 100% !important;
    }
    .location-filter ng-select > div > div.multiple > div.option {
      color: #fff !important;
      border-color: #357ebd !important;
      flex-shrink: initial;
      background-color: #428bca !important;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReportFiltersComponent),
      multi: true
    }
  ]
})
export class ReportFiltersComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  public cervicalScreeningReport = 'cervical-cancer-screening-numbers';
  @Input() public start: number;
  @Input() public end: number;
  @Input()
  public selectedYearWeek: any;
  /* tslint:disable:no-output-on-prefix */
  @Output() public onAgeChange = new EventEmitter<any>();
  @Output() public onAgeChangeFinish = new EventEmitter<any>();
  public sliderElt;
  public filterCollapsed = false;
  public initialized = false;
  public indicatorOptions: Array<any>;
  public programOptions: Array<any>;
  @Output() public onProgramChange = new EventEmitter<any>();
  @Output() public onIndicatorChange = new EventEmitter<any>();
  @Output() public onDateChange = new EventEmitter<any>();
  @Output() public onYearWeekChange = new EventEmitter<any>();
  @Output() public onMonthChange = new EventEmitter<any>();
  public genderOptions: Array<any> = [
    {
      value: 'F',
      label: 'F'
    },
    {
      value: 'M',
      label: 'M'
    }
  ];
  public periodOptions: Array<any> = [
    {
      value: 'daily',
      label: 'Daily'
    },
    {
      value: 'monthly',
      label: 'Monthly'
    }
  ];
  public selectedIndicatorTagsSelectedAll = false;
  public selectedProgramTagsSelectedAll = false;
  @Input() public selectedPeriod = '';
  @Output() public selectedPeriodChange = new EventEmitter<any>();
  @Output() public onGenderChange = new EventEmitter<any>();
  public disableGenerateReportBtn = false;
  @Output()
  public generateReport = new EventEmitter();
  @Output()
  public ageRange = new EventEmitter();
  @Input()
  public parentIsBusy = false;
  @Output()
  public startDateChange = new EventEmitter<Date>();
  @Input()
  public isShown = false;
  @Input()
  public disableGenerateButton = false;
  @Input() public enabledControls: string[];
  @Input() public reportType: string;
  @Output()
  public locationChange = new EventEmitter<any>();
  public locations: any;
  @Output()
  public startWeekChange = new EventEmitter<Date>();

  @Output()
  public endDateChange = new EventEmitter<Date>();
  private _startDate: Date;
  private _endDate: Date;
  private _startWeek: Date;
  private _report: string;
  private _indicators: Array<any> = [];
  private _gender: Array<any> = [];
  private _programs: Array<any> = [];
  private _surgeWeeks: any;
  private _currentDepartment = '';
  month: any;
  constructor(private indicatorResourceService: IndicatorResourceService,
              private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
              private programResourceService: ProgramResourceService,
              private programWorkFlowResourceService: ProgramWorkFlowResourceService,
              private _departmentProgramService: DepartmentProgramsConfigService,
              private _selectDepartmentService: SelectDepartmentService,
              private elementRef: ElementRef,
              private cd: ChangeDetectorRef) {
}
  public get startDate(): Date {
    return this._startDate;
  }
  @Input()
  public set startDate(v: Date) {
    this._startDate = v;
    this.startDateChange.emit(this.startDate);
  }

  // tslint:disable:no-shadowed-variable
  public onChange = (_) => {};
  public onTouched = () => {};

  @Input()
  public set endDate(v: Date) {
    this._endDate = v;
    this.endDateChange.emit(this.endDate);
  }
  public get endDate(): Date {
    return this._endDate;
  }
  @Input()
  public set startWeekString(v: Date) {
    this._startWeek = v;
    this.startWeekChange.emit(this._startWeek);
  }
  public get startWeekString() {
    return this._startWeek;
  }

  @Input()
  public set surgeWeeks(v: any) {
    this._surgeWeeks = v;
  }

  public get surgeWeeks() {
    return this._surgeWeeks;
  }

  @Input()
  public set reportName(v: string) {
    this._report = v;
  }
  public get reportName(): string {
    return this._report;
  }
  @Input()
  public get selectedIndicators(): Array<any> {
    return this._indicators;
  }
  public set selectedIndicators(v: Array<any>) {
    this._indicators = v;
    this.onIndicatorChange.emit(this._indicators);
  }
  @Input()
  public get selectedPrograms(): Array<any> {
    return this._programs;
  }
  public set selectedPrograms(v: Array<any>) {
    this._programs = v;
    this.onProgramChange.emit(this._programs);
  }
  @Input()
  public get selectedGender(): Array<any> {
    return this._gender;
  }
  public set selectedGender(v: Array<any>) {
    this._gender = v;
    this.onGenderChange.emit(this._gender);
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
  @Input()
  public get monthString(): string {
    return this.month ? Moment(this.month).format('YYYY-MM') : Moment().format('YYYY-MM');
}
public set monthString(v: string) {
    this.month = new Date(v);
    this.onMonthChange.emit(this.month);
}
  public ngOnInit() {
    if (this.reportType === this.cervicalScreeningReport) {
      this.genderOptions = this.genderOptions.filter(option => {
        return option.value === 'F' && option.label === 'F';
      });
    }

    this.renderFilterControls();

    if (this.start && this.end) {
      this.onAgeChangeFinish.emit({ ageFrom: this.start, ageTo: this.end });
    }

    // this._gender = this._gender.length > 0 ? this._gender : this.genderOptions;
    // this.selectedGender = _.map(this.genderOptions, 'value');
    if (this._indicators.length > 0) {
      this.selectedIndicatorTagsSelectedAll = true;
    }
    if (this._programs.length > 0) {
      this.selectedProgramTagsSelectedAll = true;
    } else {
      this._programs = this.programOptions;
    }
    this.getCachedLocations();
  }
  public isEnabled(control: string): boolean {
    return this.enabledControls.indexOf(control) > -1;
  }
  public renderFilterControls(): void {
    if (this.isEnabled('indicatorsControl')) {
      this.getIndicators();
    }
    if (this.isEnabled('programsControl')) {
      this.getCurrentDepartment();
    }
  }
  public getCurrentDepartment() {
    const department = this._selectDepartmentService.getUserSetDepartment();
    this._currentDepartment = department;
    this.getDepartmentPrograms(department);
  }
  public getDepartmentPrograms(department) {
    this._departmentProgramService
      .getDepartmentPrograms(department)
      .pipe(take(1))
      .subscribe(results => {
        if (results) {
          this.programOptions = _.map(results, result => {
            return { value: result.uuid, label: result.name };
          });
        }
      });
  }
  public getCachedLocations() {
    if (this._report === 'hiv-summary-report') {
      this.dataAnalyticsDashboardService.getSelectedIndicatorLocations().pipe(take(1)).subscribe(
        (data)  => {
          if (data) {
            this.locations = data.locations;
          }
        });
    } else if (this._report === 'hiv-summary-monthly-report' ||
    this._report === 'oncology-summary-monthly-report') {
      this.dataAnalyticsDashboardService.getSelectedMonthlyIndicatorLocations().pipe(take(1)).subscribe(
        (data)  => {
          if (data) {
            this.locations = data.locations;
          }
        });
    } else {
      this.dataAnalyticsDashboardService.getSelectedLocations().pipe(take(1)).subscribe(
        (data)  => {
          if (data) {
            this.locations = data.locations;
          }
        });
    }

}

  public onIndicatorSelected(indicator) {
    this.selectedIndicators = indicator;
  }

  public getIndicators() {
    const indicators = [];
    this.indicatorResourceService
      .getReportIndicators({
        report: this.reportName
      })
      .pipe(take(1))
      .subscribe((results: any[]) => {
        for (const data of results) {
          for (const r in data) {
            if (data.hasOwnProperty(r)) {
              const id = data.name;
              const text = data.label;
              data['value'] = id;
              data['label'] = text;
            }
          }
          indicators.push(data);
        }
        this.indicatorOptions = indicators;
      });
  }

  public getPrograms() {
    this.programResourceService
      .getPrograms()
      .pipe(take(1))
      .subscribe((results: any[]) => {
        if (results) {
          this.programOptions = _.map(results, result => {
            return { value: result.uuid, label: result.display };
          });
        }
      });
  }

  public selectAll() {
    if (this.indicatorOptions.length > 0) {
      if (this.selectedIndicatorTagsSelectedAll === false) {
        this.selectedIndicatorTagsSelectedAll = true;
        this.selectedIndicators = this.indicatorOptions;
      } else {
        this.selectedIndicatorTagsSelectedAll = false;
        this.selectedIndicators = [];
      }
    }
  }

  public selectAllPrograms() {
    if (this.programOptions.length > 0) {
      if (this.selectedProgramTagsSelectedAll === false) {
        this.selectedProgramTagsSelectedAll = true;
        this.selectedPrograms = this.programOptions;
      } else {
        this.selectedProgramTagsSelectedAll = false;
        this.selectedPrograms = [];
      }
    }
  }
  public getSelectedLocations(locs: any) {
    if (this._report === 'hiv-summary-report') {
      this.dataAnalyticsDashboardService.setSelectedIndicatorLocations(locs);
      return;
    }
    if (
      this._report === 'hiv-summary-monthly-report' ||
      this._report === 'oncology-summary-monthly-report'
    ) {
      this.dataAnalyticsDashboardService.setSelectedMonthlyIndicatorLocations(
        locs
      );
      return;
    }
    this.dataAnalyticsDashboardService.setSelectedLocations(locs);
  }
  public onGenderSelected(selectedGender) {
    this.selectedGender = selectedGender;
    this.onGenderChange.emit(this.selectedGender);
  }

  public onPeriodChange($event) {
    this.selectedPeriodChange.emit($event.value);
  }

  public onClickedGenerate() {
    this.generateReport.emit();
  }
  public ngAfterViewInit() {
    this.cd.detectChanges();
    this.sliderElt = jQuery(this.elementRef.nativeElement).find('.slider');
    this.sliderElt.ionRangeSlider({
      type: 'double',
      grid: true,
      from: this.start,
      to: this.end,
      min: 0,
      max: 120,
      step: 1,
      grid_num: 10,
      force_edges: true,
      keyboard: true,
      onFinish: data => {
        this.onAgeChangeFinish.emit({ ageFrom: data.from, ageTo: data.to });
      },
      onChange: data => {
        this.value = { ageFrom: data.from, ageTo: data.to };
      }
    });
    this.initialized = true;
  }
  public onSelectedIndicators(v: Array<any>) {
    this._indicators = v;
    this.onIndicatorChange.emit(this._indicators);
  }

  set value(value: any) {
    this.onAgeChange.emit(value);
  }

  public writeValue(value: any): void {
    if (value != null) {
      if (this.initialized) {
        this.sliderElt.slider('value', value);
      } else {
        this.value = value;
      }
    }
  }

  public onStartWeekChange(event) {
    this.startWeekChange.emit(event);
  }

  public registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public yearWeekChange(value) {
    this.onYearWeekChange.emit(value);
  }
  public monthChange(value) {
    this.onMonthChange.emit(value);
  }
}
