import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'patient-status-indicator-definition',
  styleUrls: [],
  templateUrl: './indicator-definition.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PatientStatusIndicatorDefComponent implements OnInit {
  public indicatorDes: any;
  private _data = new BehaviorSubject<any>([]);
  constructor() {
  }
  @Input()
  set indicatorDefinition(value) {
    this._data.next(value);
  }
  get indicatorDefinition() {
    return this._data.getValue();
  }
  public ngOnInit() {
    this._data
      .subscribe((x) => {
        if (x) {
           this.processResult(x);
        }
      });
  }
  public processResult(result: any[]) {
    let des = [];
    let obj = {};
    _.each(result, (data: any) => {
      obj[data.name] = data.description;
    });
    des.push(obj);

    this.indicatorDes = des;

  }
}
