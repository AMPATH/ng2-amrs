
import {
  Component, OnInit, EventEmitter, ElementRef, forwardRef,
  ViewEncapsulation, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { Output, Input } from '@angular/core';
import { IndicatorResourceService } from '../../etl-api/indicator-resource.service';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import {
  ProgramWorkFlowResourceService
} from '../../openmrs-api/program-workflow-resource.service';
declare var jQuery;
require('ion-rangeslider');

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
  @Input() public start: number;
  @Input() public end: number;
  @Output() public onAgeChange = new EventEmitter<any>();
  @Output() public onAgeChangeFinish = new EventEmitter<any>();
  public sliderElt;
  public filterCollapsed: boolean = false;
  public initialized: boolean = false;
  public indicatorOptions: Array<any>;
  public programOptions: Array<any>;
  public statesOptions: Array<any>;
  @Output() public onProgramChange = new EventEmitter<any>();
  @Output() public onIndicatorChange = new EventEmitter<any>();
  @Output() public onDateChange = new EventEmitter<any>();
  @Output() public onStatesChange = new EventEmitter<any>();
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
  public selectedIndicatorTagsSelectedAll: boolean = false;
  public selectedProgramTagsSelectedAll: boolean = false;
  public selectedStatesTagsSelectedAll: boolean = false;
  @Output() public onGenderChange = new EventEmitter<any>();
  public disableGenerateReportBtn: boolean = false;
  @Output()
  public generateReport = new EventEmitter();
  @Output()
  public ageRange = new EventEmitter();
  @Input()
  public parentIsBusy: boolean = false;
  @Output()
  public startDateChange = new EventEmitter<Date>();
  @Input()
  public isShown: boolean = false;
  @Input()
  public disableGenerateButton: boolean = false;
  @Input() public enabledControls: string[];
  @Output()
  public locationChange = new EventEmitter<any>();
  public locations: any;

  @Output()
  public  endDateChange = new EventEmitter<Date>();
  private _startDate: Date;
  private _endDate: Date;
  private _report: string;
  private _indicators: Array<any> = [];
  private _gender: Array<any> = [];
  private _programs: Array<any> = [];
  private _states: Array<any> = [];
  constructor(private indicatorResourceService: IndicatorResourceService,
              private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
              private programResourceService: ProgramResourceService,
              private programWorkFlowResourceService: ProgramWorkFlowResourceService,
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
  public set reportName(v: string) {
    this._report = v;
  }
  public get reportName(): string {
    return this._report;
  }
  @Input()
  public get selectedIndicators(): Array<any> {
    return this._indicators ;
  }
  public set selectedIndicators(v: Array<any>) {
    this._indicators = v;
    this.onIndicatorChange.emit(this._indicators);
  }
  @Input()
  public get selectedPrograms(): Array<any> {
    return this._programs ;
  }
  public set selectedPrograms(v: Array<any>) {
    this._programs = v;
    if (this._programs) {
      this.statesOptions = [];
      this.getProgramWorkFlowStates(this._programs);
    }

    this.onProgramChange.emit(this._programs);

  }
  @Input()
  public get selectedStates(): Array<any> {
    return this._states ;
  }
  public set selectedStates(v: Array<any>) {
    this._states = v;
    this.onStatesChange.emit(this._states);

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

  public ngOnInit() {
    this.renderFilterControls();
    if (this.start && this.end) {
      this.onAgeChangeFinish.emit({ageFrom: this.start, ageTo: this.end});
    }

    // this._gender = this._gender.length > 0 ? this._gender : this.genderOptions;
    // this.selectedGender = _.map(this.genderOptions, 'value');
    if (this._indicators.length > 0) {
      this.selectedIndicatorTagsSelectedAll = true;
    }
    if (this._programs.length > 0) {
      this.selectedProgramTagsSelectedAll = true;
    }else {
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
    if (this.isEnabled('programWorkFlowControl')) {
      this.getPrograms();
    }
  }
   public getCachedLocations() {
      if (this._report === 'hiv-summary-report') {
        this.dataAnalyticsDashboardService.getSelectedIndicatorLocations().subscribe(
          (data)  => {
            if (data) {
              this.locations = data.locations;
            }
          });
      } else if (this._report === 'hiv-summary-monthly-report' ||
      this._report === 'oncology-summary-monthly-report') {
        this.dataAnalyticsDashboardService.getSelectedMonthlyIndicatorLocations().subscribe(
          (data)  => {
            if (data) {
              this.locations = data.locations;
            }
          });
      } else {
        this.dataAnalyticsDashboardService.getSelectedLocations().subscribe(
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
    let indicators = [];
    this.indicatorResourceService.getReportIndicators({
     report: this.reportName
   }).subscribe(
     (results: any[]) => {

       for (let data of results) {
         for (let r in data) {
           if (data.hasOwnProperty(r)) {
             let id = data.name;
             let text = data.label;
             data['value'] = id;
             data['label'] = text;
           }
         }
         indicators.push(data);
       }
       this.indicatorOptions = indicators;
     }
   );

  }

  public getPrograms() {
    let programs = [];
    this.programResourceService.getPrograms().subscribe(
      (results: any[]) => {

          for (let data of results) {

            if (!_.isEmpty(data.allWorkflows)) {
            for (let r in data) {

              if (data.hasOwnProperty(r)) {
                let id = data.uuid;
                let text = data.display;
                data['value'] = id;
                data['label'] = text;

              }
            }
            programs.push(data);
            }

          }
          this.programOptions = programs;
      }
    );

  }
  public getProgramWorkFlowStates(uuid) {
    let selectedProgram;
    if (uuid[0] && uuid[0] !== 'undefined' && uuid[0] !== undefined) {
       selectedProgram = uuid[0];

    }

    let programs = [];
    if (selectedProgram) {
    this.programWorkFlowResourceService.getProgramWorkFlows(selectedProgram.value).subscribe(
      (results) => {
        let workflows = _.get(results, 'allWorkflows');
        if (workflows.length > 0) {
            _.each(workflows, (workflow: any) => {
              if (workflow.states.length > 0) {
                programs = _.map(workflow.states, (state: any) => {
                  return {
/*
                    id: state.uuid,
                    text: state.concept.display
*/
                    value: state.concept.uuid,
                    label: state.concept.display
                  };
                });
              }
            });
          }
        this.statesOptions = programs;
      }
    );
   }
  }

  public selectAll() {
    if (this.indicatorOptions .length > 0) {
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
    if (this.programOptions .length > 0) {
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
    if (this._report === 'hiv-summary-monthly-report' ||
    this._report === 'oncology-summary-monthly-report') {
      this.dataAnalyticsDashboardService.setSelectedMonthlyIndicatorLocations(locs);
      return;
    }
    this.dataAnalyticsDashboardService.setSelectedLocations(locs);
  }
  public onGenderSelected(selectedGender) {
    this.selectedGender = selectedGender;
    this.onGenderChange.emit( this.selectedGender);
  }
  public selectAllStates() {
    if (this.programOptions .length > 0) {
      if (this.selectedStatesTagsSelectedAll === false) {
        this.selectedStatesTagsSelectedAll = true;
        this.selectedStates = this.statesOptions;
      } else {
        this.selectedStatesTagsSelectedAll = false;
        this.selectedStates = [];
      }
    }
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
      onFinish: (data) => {
        this.onAgeChangeFinish.emit({ageFrom: data.from, ageTo: data.to});
      },
      onChange: (data) => {
        this.value = {ageFrom: data.from, ageTo: data.to};
      }
    });
    this.initialized = true;
  }
  public  onSelectedIndicators(v: Array<any>) {
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

 public registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
 public registerOnTouched(fn: () => void): void { this.onTouched = fn; }

}
