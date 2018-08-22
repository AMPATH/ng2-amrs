
import {
  Component, OnInit, EventEmitter, ElementRef, forwardRef, ViewEncapsulation, AfterViewInit
} from '@angular/core';
import { Output, Input } from '@angular/core';
// import { IndicatorResourceService } from '../../etl-api/indicator-resource.service';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ProgramWorkFlowResourceService
} from '../../openmrs-api/program-workflow-resource.service';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ProviderDashboardService } from '../services/provider-dashboard.services';

declare var jQuery;
// require('ion-rangeslider');
      // useExisting: forwardRef(() => ReportFiltersComponent),
@Component({
  selector: 'provider-dashboard-filters',
  templateUrl: './provider-dashboard-filters.component.html',
  styleUrls: ['./provider-dashboard-filters.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProviderDashboardFiltersComponent
 implements OnInit {
  @Input() public start: number;
  @Input() public end: number;
  public initialized: boolean = false;
  public loaderStatus: boolean = false;
  public programOptions: Array<any>;
  public statesOptions: Array<any>;
  public locationOptions: Array<any>;
  @Output() public onProgramChange = new EventEmitter<any>();
  @Output() public onDateChange = new EventEmitter<any>();
  @Output() public onStatesChange = new EventEmitter<any>();
  @Output() public onLocationChange = new EventEmitter<any>();
  public selectedProgramTagsSelectedAll: boolean = false;
  public selectedStatesTagsSelectedAll: boolean = false;
  public disableReportViewBtn: boolean = false;
  @Output()
  public generateReport = new EventEmitter();
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
  private _programs: Array<any> = [];
  private _states: Array<any> = [];
  private _locations: Array<any> = [];
  constructor(
              private providerDashboardService: ProviderDashboardService,
              private locationResourceService: LocationResourceService,
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
    // this.renderFilterControls();
    if (this.start && this.end) {

    }

    if (this._programs.length > 0) {
      this.selectedProgramTagsSelectedAll = true;
    }else {
      this._programs = this.programOptions;
    }
    this.getPrograms();
    this.getLocations();
    this.getCachedLocations();

  }

   public getCachedLocations() {
    this.providerDashboardService.getSelectedLocations().subscribe(
      (data)  => {
        if (data) {
          this.locations = data.locations;
        }
      });
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

    let programStates = [];
    this.programWorkFlowResourceService.getProgramWorkFlows(selectedProgram).subscribe(
      (results) => {
        let workflows: any = _.get(results, 'allWorkflows');
        if (workflows.length > 0) {
          _.each(workflows, (workflow: any) => {
            if (workflow.states.length > 0) {
              programStates = _.map(workflow.states, (state: any) => {
                return {
                  id: state.concept.uuid,
                  text: state.concept.display
                };
              });
            }
          });
        }
        this.statesOptions = programStates;
      }
    );

  }

  public selectAll() {}

  public updateStartDate(event: any) {
      this.startDateChange.emit(event);
  }
  public updateEndDate(event: any) {
      this.endDateChange.emit(event);
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

  public getSelectedLocations(locs: any) {
    this.onLocationChange.emit(locs);
    this.providerDashboardService.setSelectedLocations(locs);
  }

  public onClickedGenerate() {
    this.generateReport.emit(true);
  }
  set value(value: any) {
  }

 public registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
 public registerOnTouched(fn: () => void): void { this.onTouched = fn; }

 public getLocations() {
  this.loaderStatus = true;
  this.locationResourceService.getLocations().subscribe((results: any) => {
    this.locations = results.map((location) => {
      return {
        value: location.uuid,
        label: location.display,
        id: location.uuid,
        text: location.display
      };
    });
    this.locationOptions = this.locations;
    this.loaderStatus = false;
  }, (error) => {
    this.loaderStatus = false;
    console.error(error);
  });
}
}
