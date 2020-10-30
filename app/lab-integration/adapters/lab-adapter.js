import LabAdapterError from '../errors/adapter-error';
import * as _ from 'lodash';

const eidRestFormatter = require('../../../eid-rest-formatter');

export default class LabAdapter {
  constructor(labResults) {
    this.payloadFormatter = eidRestFormatter;
    if (Array.isArray(labResults)) {
      this.results = labResults || [];
    } else {
      throw new LabAdapterError('Please provide lab results as an array');
    }
  }

  transformLabResult(result) {
    return _.mapKeys(result, (v, k) => {
      if (k === 'order_number') k = 'OrderNo';
      if (k === 'AMRs_location') k = 'AMRSLocation';
      if (k === 'date_collected') k = 'DateCollected';
      if (k === 'result') k = 'FinalResult';
      return k;
    });
  }
}
