import * as _ from 'lodash';

export var Helpers = {

  buildUrl:(url)=>{

    return {
      withParams: (params) => {
        return url + '?' + Object.keys(params).map((key) => {
            return key + '=' + params[key];
          }).join('&');
      }
    };

  },
  isNullOrUndefined : (subject)=>{

    return _.isUndefined(subject) || _.isNull(subject) || (typeof subject === 'string' && (subject.length ===0 || !subject.trim()));

  },
  formatBlankOrNull(obj, text) {

    _.each(Object.keys(obj), function(key) {

      if (obj[key] === '' || obj[key] === null) {
        obj[key] = text;
      }

    });

  },
  isNullOrEmpty : (str)=>{
    return (!str || 0 === str.length);
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
