import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'indicator-select',
  templateUrl: 'indicator-selector.component.html'
})
export class IndicatorSelectComponent implements OnInit {
  public selectedIndicators: Array<any> = [];
  public indicatorOptions: Array<any>;
  @Input() public indicators: Array<any>;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onIndicatorChange = new EventEmitter<any>();

  constructor() {}

  public ngOnInit() {
    if (this.selectedIndicators.length > 0) {
      this.onIndicatorChange.emit({ indicators: this.selectedIndicators });
    }

    this.getIndicators();
  }

  public onIndicatorSelected(indicators) {
    this.selectedIndicators = indicators;
    this.onIndicatorChange.emit({ indicators: this.selectedIndicators });
  }

  public getIndicators() {
    this.indicatorOptions = this.indicators;
  }

  public selectAll() {
    this.onIndicatorSelected(this.indicatorOptions);
  }
}
