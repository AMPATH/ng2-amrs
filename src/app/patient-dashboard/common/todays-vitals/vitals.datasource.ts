import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { VitalView } from './vital-view';

@Injectable()
export class VitalsDatasource {
  private _vitalSources: VitalView[] = [];
  constructor() {}

  get vitalSources(): any {
    return _.sortBy(_.uniqBy(this._vitalSources, 'name'), 'order');
  }

  set vitalSources(value) {
    this._vitalSources = value;
  }

  addToVitalSource(source: VitalView | VitalView[]) {
    if (_.isArray(source)) {
      this._vitalSources = _.concat(this._vitalSources, source);
    } else {
      this._vitalSources.push(source as VitalView);
    }
  }

  public hasVital(key): boolean {
    const source = _.find(this._vitalSources, (_source: VitalView) => {
      return _source && _source.name === key;
    });
    return source !== undefined;
  }

  public getVital(key): VitalView {
    const source = _.find(this._vitalSources, (_source: VitalView) => {
      return _source && _source.name === key;
    });

    return source;
  }
}
