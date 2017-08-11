
import {
  Component, OnInit, EventEmitter, ElementRef, forwardRef, ViewEncapsulation
} from '@angular/core';
import { Output, Input } from '@angular/core';
import { IndicatorResourceService } from '../../etl-api/indicator-resource.service';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
      useExisting: forwardRef(() => ReportFilters),
      multi: true
    }
  ]
})
export class ReportFilters implements OnInit, ControlValueAccessor {
  @Input() start: number;
  @Input() end: number;
  @Output() onAgeChange = new EventEmitter<any>();
  @Output() onAgeChangeFinish = new EventEmitter<any>();
  sliderElt;
  filterCollapsed: boolean = false;
  initialized: boolean = false;
  indicatorOptions: Array<any>;
  @Output() onIndicatorChange = new EventEmitter<any>();
  @Output() onDateChange = new EventEmitter<any>();
  genderOptions: Array<any>;
  selectedIndicatorTagsSelectedAll: boolean = false;
  @Output() onGenderChange = new EventEmitter<any>();
  @Output()
  generateReport = new EventEmitter();
  @Output()
  ageRange = new EventEmitter();
  @Input()
  parentIsBusy: boolean = false;

  @Output()
  startDateChange = new EventEmitter<Date>();

  @Output()
  endDateChange = new EventEmitter<Date>();
  private _startDate: Date;
  private _endDate: Date;
  private _report: string;
  private _indicators: Array<any>;
  private _gender: Array<any> = [];
  public get startDate(): Date {
    return this._startDate;
  }
  onChange = (_) => {};
  onTouched = () => {};

  @Input()
  public set startDate(v: Date) {
    this._startDate = v;
    this.startDateChange.emit(this.startDate);
  }
  @Input()
  public set endDate(v: Date) {
    this._endDate = v;
    this.endDateChange.emit(this.endDate);
  }
  @Input()
  public set reportName(v: string) {
    this._report = v;
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
  public get endDate(): Date {
    return this._endDate;
  }
  public get reportName(): string {
    return this._report;
  }
  constructor(private indicatorResourceService: IndicatorResourceService,
              private elementRef: ElementRef) {
  }

  ngOnInit() {
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
    this.getIndicators();
  }

  onIndicatorSelected(indicator) {
    this.selectedIndicators = indicator;
  }

  getIndicators() {
    let indicators = [];
   this.indicatorResourceService.getReportIndicators({
     report: this.reportName
   }).subscribe(
     (results: any[]) => {
       for (let i = 0; i < results.length; i++) {
         let data = results[i];
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

  selectAll() {
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
  onGenderSelected(selectedGender) {
    this.selectedGender = selectedGender;
    this.onGenderChange.emit( this.selectedGender);
  }
  /*getAgeRangeOnFinish(event) {
    this.ageRange.emit(event);
  }*/
  onClickedGenerate() {
    this.generateReport.emit();
  }
  ngAfterViewInit() {
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

  writeValue(value: any): void {
    if (value != null) {
      if (this.initialized) {
        this.sliderElt.slider('value', value);
      } else {
        this.value = value;
      }
    }
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
