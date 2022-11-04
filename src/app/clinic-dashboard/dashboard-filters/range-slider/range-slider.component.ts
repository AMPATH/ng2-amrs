// tslint:disable:no-output-on-prefix
import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ElementRef,
  forwardRef,
  AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var jQuery;
require('ion-rangeslider');

@Component({
  selector: 'range-slider',
  template: `<label>Age Range</label> <input type="text" class="slider" />`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true
    }
  ],
  styleUrls: ['range-slider.component.css']
})
export class RangeSliderComponent
  implements OnInit, ControlValueAccessor, AfterViewInit
{
  @Input() public start: number;
  @Input() public end: number;
  @Output() public onAgeChange = new EventEmitter<any>();
  @Output() public onAgeChangeFinish = new EventEmitter<any>();
  public sliderElt;
  public initialized = false;

  constructor(private elementRef: ElementRef) {}

  public ngOnInit() {
    if (this.start && this.end) {
      this.onAgeChangeFinish.emit({ ageFrom: this.start, ageTo: this.end });
    }
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
        this.onAgeChangeFinish.emit({ ageFrom: data.from, ageTo: data.to });
      },
      onChange: (data) => {
        this.value = { ageFrom: data.from, ageTo: data.to };
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

  public registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  private onChange = (_) => {};
  private onTouched = () => {};
}
