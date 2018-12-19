import { Injectable } from '@angular/core';

import { Vital } from '../../../models/vital.model';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import { VitalView } from './vital-view';


@Injectable()
export class VitalsDatasource {
  private _dataSources: VitalView[] = [];
  constructor() {
  }

  get dataSources(): any {
    return _.sortBy(_.uniqBy(this._dataSources, 'name'), 'order');
  }

  addToSource(dataSource: VitalView | VitalView[]) {
    if (_.isArray(dataSource)) {
      this._dataSources = _.concat(this._dataSources, dataSource);
    } else {
      this._dataSources.push(dataSource as VitalView);
    }
  }

  public hasVital(key): boolean {
    const source = _.find(this._dataSources, (_source: VitalView) => {
      return _source.name === key;
    });

    return source !== undefined;
  }

}
