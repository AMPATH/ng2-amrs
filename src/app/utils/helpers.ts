import * as _ from 'lodash';

export var Helpers = {
  buildUrl:(url)=>{
    return {
      withParams : (params)=>{
        return url+'?'+Object.keys(params).map((key)=> {
          return key + '=' + params[key];
        }).join('&');
      }
    }
  },
  isNullOrUndefined : (obj)=>{
    return _.isUndefined(obj) || _.isNull(obj) || (typeof obj === 'string' && (obj.length ===0 || !obj.trim()));
  },
  hasAllMembersUndefinedOrNull : (obj,members)=>{

    var hasA_nonNullMember = false;

    for (var i = 0; i < members.length; i++) {

      if (!Helpers.isNullOrUndefined(obj[members[i]])) {
        hasA_nonNullMember = true;
        break;
      }
    }

    return !hasA_nonNullMember;
  }
};
