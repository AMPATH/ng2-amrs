import * as _ from 'lodash';

export class Helpers {
  public static isNullOrUndefined(subject) {
    return (
      _.isUndefined(subject) ||
      _.isNull(subject) ||
      (typeof subject === 'string' && (subject.length === 0 || !subject.trim()))
    );
  }

  public static formatBlankOrNull(obj, text) {
    _.each(Object.keys(obj), (key) => {
      if (obj[key] === '' || obj[key] === null) {
        obj[key] = text;
      }
    });
  }

  public static isNullOrEmpty(str) {
    return !str || 0 === str.length;
  }

  public static hasAllMembersUndefinedOrNull(obj, members) {
    let hasANonNullMember = false;

    for (const member of members) {
      if (!this.isNullOrUndefined(obj[member])) {
        hasANonNullMember = true;
        break;
      }
    }

    return !hasANonNullMember;
  }

  constructor() {}
}
