import { Component, OnInit, EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core/src/metadata/directives';
import * as _ from 'lodash';
import { IndicatorResourceService } from '../../../etl-api/indicator-resource.service';


@Component({
  selector: 'indicator-disaggregator',
  templateUrl: 'indicator-disaggregator.component.html'
})
export class IndicatorDisaggregatorComponent implements OnInit {
  indicatorOptions: Array<any>;
  @Input() public filterOptions: Array<any> = [];
  @Output() public onFilterModelChange = new EventEmitter<any>();
  @Output() public filterModel: any = {};

  constructor(private indicatorResourceService: IndicatorResourceService) {
  }

  getIndicatorFilters() {
    this.indicatorResourceService.getIndicatorDisaggregationFilters({})
      .subscribe(
      (results: any[]) => {
        this.filterOptions = results;
        _.each(this.filterOptions, (filterOption) => {
          this.filterModel[filterOption.control] = null;
        });
      }
    );

  }

  ngOnInit() {
    this.getIndicatorFilters();
  }

  public onModelChange(key, value) {
    let model = {};
    model[key] = value;
    _.extend(this.filterModel, model);
    this.onFilterModelChange.emit(this.filterModel);
  }

  public selectAll(key) {
    _.each(this.filterOptions, (filterOption) => {
      if (filterOption.control === key) {
        this.filterModel[filterOption.control] = _.map(filterOption.options, 'value');
      }
    });
  }

}
