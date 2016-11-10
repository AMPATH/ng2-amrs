import * as _ from 'lodash';

export let Helpers = {
  buildUrl: (url) => {
    return {
      withParams: (params) => {
        return url + '?' + Object.keys(params).map((key) => {
          return key + '=' + params[key];
        }).join('&');
      }
    };
  },
  isNullOrUndefined: (obj) => {
    return _.isUndefined(obj) || _.isNull(obj) || (typeof obj === 'string' && (obj.length === 0 || !obj.trim()));
  },
  hasAllMembersUndefinedOrNull: (obj, members) => {

    let hasANonNullMember = false;

    for (let i = 0; i < members.length; i++) {

      if (!Helpers.isNullOrUndefined(obj[members[i]])) {
        hasANonNullMember = true;
        break;
      }
    }

    return !hasANonNullMember;
  }
};
