import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'hiv-care-indicator-definitions',
  styleUrls: [],
  templateUrl: 'indicator-definitions.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HivCareIndicatorDefComponent implements OnInit {
  indicatorDefinitionsArr: Array<any>;
  private _data = new BehaviorSubject<any>([]);
  constructor() {
  }
  @Input()
  set indicatorDefinitions(value) {
    this._data.next(value);
  }
  get indicatorDefinitions() {
    return this._data.getValue();
  }
  ngOnInit() {
    this._data
      .subscribe(x => {
        if (x) {
          this.createIndicatorDefinitionsDictionary(x);
        }
      });
  }
  createIndicatorDefinitionsDictionary(indicatorDefinitions) {
    let arr = [];
    let dictionary = {};
    _.each(indicatorDefinitions, (indicatorDefinition) => {
      dictionary[indicatorDefinition.name] = indicatorDefinition.description;
    });
    arr.push(dictionary);

    if (arr) {
      this.indicatorDefinitionsArr = arr;
    }
  }
}
