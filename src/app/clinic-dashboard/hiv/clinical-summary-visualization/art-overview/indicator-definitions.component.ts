import { Component, ViewEncapsulation, Input, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as _ from "lodash";

@Component({
  selector: "art-overview-indicator-definitions",
  styleUrls: [],
  templateUrl: "./indicator-definitions.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ArtOverviewIndicatorDefComponent implements OnInit {
  public indicatorDefinitionsArr: Array<any>;
  private _data = new BehaviorSubject<any>([]);
  constructor() {}
  @Input()
  set indicatorDefinitions(value) {
    this._data.next(value);
  }
  get indicatorDefinitions() {
    return this._data.getValue();
  }
  public ngOnInit() {
    this._data.subscribe((x) => {
      if (x) {
        this.createIndicatorDefinitionsDictionary(x);
      }
    });
  }
  public createIndicatorDefinitionsDictionary(indicatorDefinitions: any[]) {
    const arr = [];
    const dictionary = {};
    _.each(indicatorDefinitions, (indicatorDefinition: any) => {
      dictionary[indicatorDefinition.name] = indicatorDefinition.description;
    });
    arr.push(dictionary);

    if (arr) {
      this.indicatorDefinitionsArr = arr;
    }
  }
}
