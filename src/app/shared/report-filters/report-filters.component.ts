import { take } from 'rxjs/operators';
import {
  Component,
  OnInit,
  EventEmitter,
  ElementRef,
  forwardRef,
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
  styles: [
    `
      ng-select > div > div.multiple input {
        width: 100% !important;
      }
      .location-filter ng-select > div > div.multiple > div.option {
        color: #fff !important;
        border-color: #357ebd !important;
        flex-shrink: initial;
        background-color: #428bca !important;
      }
      .mr-1 {
        margin-right: 1rem;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReportFiltersComponent),
      multi: true
    }
  ]
})
export class ReportFiltersComponent
  implements OnInit, ControlValueAccessor, AfterViewInit {
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
  @Output() public startingMonthChange = new EventEmitter<any>();
  @Output() public endingMonthChange = new EventEmitter<any>();
  @Output() public locationTypeChange = new EventEmitter<any>();
  @Output() public quarterChange = new EventEmitter<any>();
  @Output() public patientTypeChange = new EventEmitter<any>();
  @Output() public sampleSizeChange = new EventEmitter<any>();
  @Output() public onIsEligibleChange = new EventEmitter<any>();
  @Output() public childStatusChange = new EventEmitter<any>();
  @Output() public onElicitedClientsChange = new EventEmitter<any>();
  @Output() public getSelectedElicitedStartDate = new EventEmitter<any>();
  @Output() public getSelectedElicitedEndDate = new EventEmitter<any>();
  @Output() public onSelectAllPrograms = new EventEmitter<any>();
  @Output() public selectedYearChange: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() public selectedQuarterChange: EventEmitter<
    string
  > = new EventEmitter<string>();
  selectedYear: string;
  selectedQuarter: string;
  isAggregated: boolean;
  years: string[] = [];
  showQuarters = false;
  quarters: string[] = [];
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
  public locationTypeOptions = [
    {
      label: 'Screening Location',
      value: 'screening_location'
    },
    {
      label: 'Primary Care Facility',
      value: 'primary_care_facility'
    }
  ];
  public patientTypeOptions = [
    {
      label: 'Adult',
      value: 'adult'
    },
    {
      label: 'Pediatric',
      value: 'PEADS'
    },
    {
      label: 'PMTCT',
      value: 'PMTCT'
    }
  ];
  public sampleSize = [
    {
      label: '10',
      value: '10'
    },
    {
      label: '20',
      value: '20'
    },
    {
      label: '30',
      value: '30'
    },
    {
      label: '40',
      value: '40'
    },
    {
      label: '50',
      value: '50'
    },
    {
      label: '60',
      value: '60'
    },
    {
      label: '70',
      value: '70'
    },
    {
      label: '80',
      value: '80'
    },
    {
      label: '90',
      value: '90'
    },
    {
      label: '100',
      value: '100'
    },
    {
      label: '110',
      value: '110'
    },
    {
      label: '120',
      value: '120'
    },
    {
      label: '130',
      value: '130'
    },
    {
      label: '140',
      value: '140'
    },
    {
      label: '150',
      value: '150'
    },
    {
      label: '160',
      value: '160'
    },
    {
      label: '170',
      value: '170'
    },
    {
      label: '180',
      value: '180'
    },
    {
      label: '190',
      value: '190'
    },
    {
      label: '200',
      value: '200'
    },
    {
      label: 'All',
      value: 'all'
    }
  ];
  public selectedLoactionType: any;
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
  @Input()
  public showAggregateControl = false;

  @Output()
  public endDateChange = new EventEmitter<Date>();
  private _startDate: Date;
  private _endDate: Date;
  private _year: string;
  private _quarter: string;
  private _startWeek: Date;
  private _report: string;
  private _indicators: Array<any> = [];
  private _gender: Array<any> = [];
  private _programs: Array<any> = [];
  private _surgeWeeks: any;
  private _currentDepartment = '';
  private _startingMonth: Date;
  private _endingMonth: Date;
  @Input()
  public dateRange: String;
  month: any;

  public programDropdownSettings: any = {
    singleSelection: false,
    text: 'Select or enter to search',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    maxHeight: 200
  };

  private _elicitedStartDate: any;
  @Input()
  public set elicitedStartDate(v: any) {
    this._elicitedStartDate = v;
  }
  public get elicitedStartDate() {
    return this._elicitedStartDate;
  }

  private _elicitedEndDate: any;
  @Input()
  public set elicitedEndDate(v: any) {
    this._elicitedEndDate = v;
  }
  public get elicitedEndDate() {
    return this._elicitedEndDate;
  }

  private _programsFT: any;
  @Input()
  public set programsFT(v: any) {
    this._programsFT = v;
  }
  public get programsFT() {
    return this._programsFT;
  }
  @Input()
  public selectAllProgramsTag = false;
  @Input()
  public isEligible: any;

  private _isEligibleOptions: any;
  @Input()
  public set isEligibleOptions(v: any) {
    this._isEligibleOptions = v;
  }
  public get isEligibleOptions() {
    return this._isEligibleOptions;
  }

  @Input()
  public childStatus: any;
  private _childStatusOptions: any;
  @Input()
  public set childStatusOptions(v: any) {
    this._childStatusOptions = v;
  }
  public get childStatusOptions() {
    return this._childStatusOptions;
  }

  @Input()
  public elicitedClients: any;
  private _elicitedClientsOptions: any;
  @Input()
  public set elicitedClientsOptions(v: any) {
    this._elicitedClientsOptions = v;
  }
  public get elicitedClientsOptions() {
    return this._elicitedClientsOptions;
  }

  private _hideGenerateReportButton = false;
  @Input()
  public set hideGenerateReportButton(v: any) {
    this._hideGenerateReportButton = v;
  }
  public get hideGenerateReportButton() {
    return this._hideGenerateReportButton;
  }

  constructor(
    private indicatorResourceService: IndicatorResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private programResourceService: ProgramResourceService,
    private programWorkFlowResourceService: ProgramWorkFlowResourceService,
    private _departmentProgramService: DepartmentProgramsConfigService,
    private _selectDepartmentService: SelectDepartmentService,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    this.years = this.generateYears();
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
    return this.month
      ? Moment(this.month).format('YYYY-MM')
      : Moment().format('YYYY-MM');
  }
  public set monthString(v: string) {
    this.month = new Date(v);
    this.onMonthChange.emit(this.month);
  }
  public get startingMonth(): Date {
    return this._startingMonth;
  }
  @Input()
  public set startingMonth(v: Date) {
    this._startingMonth = v;
    this.startingMonthChange.emit(this.startingMonth);
  }
  public get endingMonth(): Date {
    return this._endingMonth;
  }
  @Input()
  public set endingMonth(v: Date) {
    this._endingMonth = v;
    this.endingMonthChange.emit(this.endingMonth);
  }
  public get startingMonthString(): string {
    return this.startingMonth
      ? Moment(this.startingMonth).format('YYYY-MM-DD')
      : null;
  }
  public set startingMonthString(v: string) {
    this.startingMonth = new Date(v);
  }
  public get endingMonthString(): string {
    return this.endingMonth
      ? Moment(this.endingMonth).format('YYYY-MM-DD')
      : null;
  }
  public set endingMonthString(v: string) {
    this.endingMonth = new Date(v);
  }
  public ngOnInit() {
    if (this.reportType === this.cervicalScreeningReport) {
      this.genderOptions = this.genderOptions.filter((option) => {
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
    if (this._programs && this._programs.length > 0) {
      this.selectedProgramTagsSelectedAll = true;
    } else {
      this._programs = this.programOptions;
    }
    this.getCachedLocations();
    this.getCachedIsAggregated();
  }
  public isEnabled(control: string): boolean {
    return this.enabledControls.indexOf(control) > -1;
  }
  public renderFilterControls(): void {
    if (this.isEnabled('indicatorsControl')) {
      this.getIndicators();
    }
    if (
      this.isEnabled('programsControl') ||
      this.isEnabled('familyTestingControls')
    ) {
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
      .subscribe((results) => {
        if (results) {
          this.programOptions = _.map(results, (result) => {
            return { value: result.uuid, label: result.name };
          });
        }
      });
  }
  public getCachedLocations() {
    if (this._report === 'hiv-summary-report') {
      this.dataAnalyticsDashboardService
        .getSelectedIndicatorLocations()
        .pipe(take(1))
        .subscribe((data) => {
          if (data) {
            this.locations = data.locations;
          }
        });
    } else if (
      this._report === 'hiv-summary-monthly-report' ||
      this._report === 'oncology-summary-monthly-report'
    ) {
      this.dataAnalyticsDashboardService
        .getSelectedMonthlyIndicatorLocations()
        .pipe(take(1))
        .subscribe((data) => {
          if (data) {
            this.locations = data.locations;
          }
        });
    } else {
      this.dataAnalyticsDashboardService
        .getSelectedLocations()
        .pipe(take(1))
        .subscribe((data) => {
          if (data) {
            this.locations = data.locations;
          }
        });
    }
  }

  public getCachedIsAggregated() {
    this.dataAnalyticsDashboardService
      .getIsAggregated()
      .pipe()
      .subscribe((data) => {
        if (data) {
          this.isAggregated = data.isAggregated;
        }
      });
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

  public generateYears() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const startYear = 2012;
    const financialYears = [];

    for (let year = startYear; year <= currentYear; year++) {
      const nextYear = year + 1;
      const financialYear = `${year}/${nextYear.toString()}`;

      // Exclude the current/following year period if the current month is not October or after
      if (year < currentYear || (year === currentYear && currentMonth >= 10)) {
        financialYears.push(financialYear);
      }
    }

    return financialYears.reverse();
  }

  public getPrograms() {
    this.programResourceService
      .getPrograms()
      .pipe(take(1))
      .subscribe((results: any[]) => {
        if (results) {
          this.programOptions = _.map(results, (result) => {
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

  checkYear(year: string) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month index starts from 0
    this.quarters = [];

    const currentPeriod = this.getCurrentPeriod();
    if (year === currentPeriod) {
      for (let i = 1; i <= 4; i++) {
        let quarterdesc = '';
        let isQuarterComplete = false;

        switch (i) {
          case 1:
            quarterdesc = `Q${i} (October - December)`;
            isQuarterComplete = true;
            break;
          case 2:
            quarterdesc = `Q${i} (January - March)`;
            isQuarterComplete = currentMonth >= 4;
            break;
          case 3:
            quarterdesc = `Q${i} (April - June)`;
            isQuarterComplete = currentMonth >= 7;
            break;
          case 4:
            quarterdesc = `Q${i} (July - September)`;
            isQuarterComplete = currentMonth >= 10;
            break;
          default:
            break;
        }

        if (isQuarterComplete) {
          this.quarters.push(`${quarterdesc}`);
        }
      }
    } else {
      for (let i = 1; i <= 4; i++) {
        let quarterdesc = '';

        switch (i) {
          case 1:
            quarterdesc = `Q${i} (October - December)`;
            break;
          case 2:
            quarterdesc = `Q${i} (January - March)`;
            break;
          case 3:
            quarterdesc = `Q${i} (April - June)`;
            break;
          case 4:
            quarterdesc = `Q${i} (July - September)`;
            break;
          default:
            break;
        }

        this.quarters.push(`${quarterdesc}`);
      }
    }

    this.selectedQuarter = null;
    this.showQuarters = true;
    this.onYearChange(year);
  }

  getCurrentPeriod() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month index starts from 0
    const currentYear = currentDate.getFullYear();
    const financialYearEndMonth = 9; // September

    if (currentMonth < financialYearEndMonth) {
      // Current year financial year
      const startYear = currentYear - 1;
      const endYear = currentYear.toString();
      return `${startYear}/${endYear}`;
    } else {
      // Next year financial year
      const startYear = currentYear;
      const endYear = (currentYear + 1).toString();
      return `${startYear}/${endYear}`;
    }
  }

  onYearChange(year: string) {
    this._year = year;
  }

  onQuarterChange(quarter: string) {
    this._quarter = quarter;
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
    this.selectedYearChange.emit(this._year);
    this.selectedQuarterChange.emit(this._quarter);
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
      onFinish: (data) => {
        this.onAgeChangeFinish.emit({ ageFrom: data.from, ageTo: data.to });
      },
      onChange: (data) => {
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
  public onlocationTypeChange($event: any): void {
    this.locationTypeChange.emit($event.value);
  }
  public onquarterChange($event: any): void {
    this.quarterChange.emit($event.value);
  }
  public onpatientTypeChange($event: any): void {
    this.patientTypeChange.emit($event.value);
  }
  public onsampleSizeChange($event: any): void {
    this.sampleSizeChange.emit($event.value);
  }
  public selectAllProgramsFT() {
    this.onSelectAllPrograms.emit();
  }

  public testEligibleChange(value) {
    this.onIsEligibleChange.emit(value);
  }

  public onChildStatusChange(value) {
    this.childStatusChange.emit(value);
  }

  public elicitedClientsChange(value) {
    this.onElicitedClientsChange.emit(value);
  }

  public elicitationStartDateChange(value) {
    this.getSelectedElicitedStartDate.emit(value);
  }

  public elicitationEndDateChange(value) {
    this.getSelectedElicitedEndDate.emit(value);
  }

  public onAggregateChange(value) {
    this.dataAnalyticsDashboardService.setIsAggregated(value);
  }
}
