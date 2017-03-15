import {
  Component, Input, Output, OnInit,
  EventEmitter, ElementRef, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var jQuery;
require('ion-rangeslider');

@Component({
  selector: 'range-slider',
  template: `<label>Age Range</label>
  <input type="text" class="slider" />`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true
    }
  ],
  styleUrls: ['range-slider.component.css']
})
export class RangeSliderComponent implements OnInit, ControlValueAccessor {
  @Input() start: number;
  @Input() end: number;
  @Output() onAgeChange = new EventEmitter<any>();
  @Output() onAgeChangeFinish = new EventEmitter<any>();
  sliderElt;
  initialized: boolean = false;
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.start && this.end) {
      this.onAgeChangeFinish.emit({ageFrom: this.start, ageTo: this.end});
    }
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
