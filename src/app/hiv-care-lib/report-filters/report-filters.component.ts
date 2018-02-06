
import {
  Component, OnInit, EventEmitter, ElementRef, forwardRef, ViewEncapsulation, AfterViewInit
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
  styleUrls: ['report-filters.component.css'],
  templateUrl: 'report-filters.component.html',
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
  public genderOptions: Array<any>;
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
              private elementRef: ElementRef) {
  }
  public get startDate(): Date {
    return this._startDate;
  }
  @Input()
  public set startDate(v: Date) {
    this._startDate = v;
    console.log('data2222222----->>>>this.startDate', this.startDate);
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
    //this.getProgramWorkFlowStates(this._programs);
    console.log('vvvvvvvvvvvvvvvv',v);
    this._programs = v;
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
    this._init();
    if (this.start && this.end) {
      this.onAgeChangeFinish.emit({ageFrom: this.start, ageTo: this.end});
    }
    this.genderOptions = [
      {
        id: 'F',
        text: 'Female'
      },
      {
        id: 'M',
        text: 'Male'
      }
    ];
    this._gender = this._gender.length > 0 ? this._gender : this.genderOptions;
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
    this.getProgramWorkFlowStates('781d8a88-1359-11df-a1f1-0026b9348838');
  }
   public getCachedLocations() {
    this.dataAnalyticsDashboardService.getSelectedLocations().subscribe(
      (data)  => {
        if (data) {
          this.locations = data.locations;
        }
      });
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
             data['id'] = id;
             data['text'] = text;
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
          for (let r in data) {
            if (data.hasOwnProperty(r)) {
              let id = data.uuid;
              let text = data.display;
              data['id'] = id;
              data['text'] = text;
            }
          }
          programs.push(data);
        }
        this.programOptions = programs;
      }
    );

  }
  public getProgramWorkFlowStates(uuid) {
    let selectedProgram;
    if (uuid[0] && uuid[0].id !== 'undefined' && uuid[0].id !== undefined) {
       selectedProgram = uuid[0].id;

    }

    let programs = [];
    this.programWorkFlowResourceService.getProgramWorkFlows(selectedProgram).subscribe(
      (results) => {
        console.log("tererer", results);
        let workflows = _.get(results, 'allWorkflows');
          if(workflows.length > 0) {
            _.each(workflows, (workflow: any) =>{
              if(workflow.states.length > 0) {
                programs = _.map(workflow.states, (state: any) => {
                  return {
                    id: state.uuid,
                    text: state.concept.display
                  }
                });
              }
            });
          }
        console.log('states', programs);
        this.statesOptions = programs;
      }
    );

  }

  public selectAll() {
    let indicatorsSelected = [];
    if (this.indicatorOptions .length > 0) {
      if (this.selectedIndicatorTagsSelectedAll === false) {
        this.selectedIndicatorTagsSelectedAll = true;
        _.each(this.indicatorOptions, (data) => {
          indicatorsSelected.push( data);
        });
        this.selectedIndicators = indicatorsSelected;
      } else {
        this.selectedIndicatorTagsSelectedAll = false;
        this.selectedIndicators = [];
      }
    }

  }

  public selectAllPrograms() {
    let selectedProgram = [];
    if (this.programOptions .length > 0) {
      if (this.selectedProgramTagsSelectedAll === false) {
        this.selectedProgramTagsSelectedAll = true;
        _.each(this.programOptions, (data) => {
          selectedProgram.push( data);
        });
        this.selectedPrograms = selectedProgram;
      } else {
        this.selectedProgramTagsSelectedAll = false;
        this.selectedPrograms = [];
      }
    }
  }

  public getSelectedLocations(locs: any) {
      this.dataAnalyticsDashboardService.setSelectedLocations(locs);
    }
  public onGenderSelected(selectedGender) {
    this.selectedGender = selectedGender;
    this.onGenderChange.emit( this.selectedGender);
  }
  public selectAllStates() {
    let selectedState = [];
    if (this.programOptions .length > 0) {
      if (this.selectedStatesTagsSelectedAll === false) {
        this.selectedStatesTagsSelectedAll = true;
        _.each(this.statesOptions, (data) => {
          selectedState.push( data);
        });
        this.selectedStates = selectedState;
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
  private _init() {
    this.programWorkFlowResourceService.getProgramWorkFlows('781d8a88-1359-11df-a1f1-0026b9348838')
      .subscribe((workflows: any) => {
        console.log('workflows',workflows)
        /*this.programWorkflows = workflows.allWorkflows;
        if (this.programWorkflows.length === 0) {
          this.program.isReferring = false;
          this.onAborting.emit(this.program);
        } else {
          this.program.isReferring = true;
        }*/
      });
  }
}
