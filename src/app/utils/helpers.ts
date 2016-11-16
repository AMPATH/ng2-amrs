import * as _ from 'lodash';

export class Helpers {

  static isNullOrUndefined (subject) {

    return _.isUndefined(subject)
      || _.isNull(subject)
      || (typeof subject === 'string'
      && (subject.length === 0
      || !subject.trim()));

  };



  static formatBlankOrNull (obj, text) {

    _.each(Object.keys(obj), function (key) {

      if (obj[key] === '' || obj[key] === null) {
        obj[key] = text;
      }

    });

  };

  static isNullOrEmpty(str) {
    return (!str || 0 === str.length);
  };

  static hasAllMembersUndefinedOrNull(obj, members) {

    let hasANonNullMember = false;

    for (let i = 0; i < members.length; i++) {

      if (!this.isNullOrUndefined(obj[members[i]])) {

        hasANonNullMember = true;
        break;
      }
    }

    return !hasANonNullMember;
  }

  constructor() {};

}
