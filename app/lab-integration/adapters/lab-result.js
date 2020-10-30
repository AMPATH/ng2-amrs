import LabResultFormatError from '../errors/lab-result-error';
import * as _ from 'lodash';
var eidRestFormatter = require('../../../eid-rest-formatter');

export default class LabResult {
  constructor(data) {
    if (!data) {
      throw new LabResultFormatError('No Lab result data provided');
    }

    if (_.isNil(data.conceptUuid) || _.isNil(data.result)) {
      throw new LabResultFormatError('Malformed Result given');
    }
    this.concept = data.conceptUuid;
    this.value = data.result;
    this.obsDatetime = data.date_collected;
    this.comments = data.interpretation;
    this.rawResult = data;
  }
}
