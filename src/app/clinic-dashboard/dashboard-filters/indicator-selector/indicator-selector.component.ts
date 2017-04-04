import { Component, OnInit, EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'indicator-select',
  templateUrl: 'indicator-selector.component.html'
})
export class IndicatorSelectComponent implements OnInit {
  selectedIndicators: Array<any> = [];
  indicatorOptions: Array<any>;
  @Input() indicators: Array<any>;
  @Output() onIndicatorChange = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
    if (this.selectedIndicators.length > 0 ) {
      this.onIndicatorChange.emit({ indicators: this.selectedIndicators});
    }

    this.getIndicators();
  }

  onIndicatorSelected(indicators) {
    this.selectedIndicators = indicators;
    this.onIndicatorChange.emit({ indicators: this.selectedIndicators});
  }

  getIndicators() {
    this.indicatorOptions = this.indicators;
  }

  selectAll() {
    this.onIndicatorSelected(this.indicatorOptions);
  }
}
