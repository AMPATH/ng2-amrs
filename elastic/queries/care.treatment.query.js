module.exports = (function () {
  'use strict';

  // Create a query to fetch all documents with patients enrolled in care.
  var ADULTINIT = 1;
  var ADULTRET = 2;
  var PEADINIT = 3;
  var PEADRET = 4;
  var index = 'amrs';
  var type = 'obs';

  var _ = require('lodash');
  var ejs = require('elastic.js');
  var concepts = require('./concept.ids');

  function _queryBuilder(params, encounterTypeArray) {
    var conditions = [];
    if (!_.isEmpty(params)) {
      _handleVoidedCondition(params, conditions);
      _handleAgeCondition(params, conditions);
      _handleLocationCondition(params, conditions);
      _handlePeriodCondition(params, conditions);
      _handleGenderCondition(params, conditions);
    }

    // console.log('Params +++', params);
    var queryObj = {
      index: params['index'] || index,
      type: params['type'] || type
    };

    // basic mult-select query conditions
    var encounterType = ejs.TermsQuery('encounter_type', encounterTypeArray);

    //create query
    var _body = ejs
      .Request()
      .size(0)
      .query(ejs.BoolQuery().must(encounterType).must(conditions))
      .agg(ejs.TermsAggregation(params.aggsName).field('person_id').size(0));

    queryObj.body = _body;
    return queryObj;
  }

  /**
   * Function enrolledInCareQuery
   * Possible params properties are
   * 1. location (can be an array),
   * 2. startDate,
   * 3. endDate
   * 4. lowerAgeLimit
   * 5. upperAgeLimit
   * 6. gender
   * 7. index
   * 8. type
   * 9. voided (boolean)
   * startDate & endDate define reporting period.
   * lowerAgeLimit & upperAgeLimit define age group inclusively
   * location currently expects ids.
   */
  function enrolledInCareQuery(params) {
    var params = params || {};
    params.aggsName = params.aggsName || 'enrolled';
    var queryObj = _queryBuilder(params, [ADULTINIT, PEADINIT]);
    console.log('enrolledIncareQuery :', JSON.stringify(queryObj));

    return queryObj;
  }

  /**
   * Function activeInCareQuery
   * Possible params properties are
   * 1. location (can be an array),
   * 2. startDate,
   * 3. endDate
   * 4. lowerAgeLimit
   * 5. upperAgeLimit
   * 6. gender
   * 7. index
   * 8. type
   * 9. voided
   * startDate & endDate define reporting period.
   * lowerAgeLimit & upperAgeLimit define age group inclusively
   * location currently expects ids.
   */
  function activeInCareQuery(params) {
    var params = params || {};

    //Prepare startDate and endDate
    params.startDate = 'now-3m';
    if (params.endDate) {
      params.startDate = params.endDate + '||-3M';
    } else {
      params.endDate = 'now';
    }

    var queryObj = _queryBuilder(params, [
      ADULTINIT,
      ADULTRET,
      PEADINIT,
      PEADRET
    ]);
    console.log('activeIncareQuery :', JSON.stringify(queryObj));

    return queryObj;
  }

  // function transferOutQuery(params) {
  //   var params = params || {};

  //   var query = {
  //     index: params['index'] || index,
  //     type: params['type'] || type,
  //     body: {
  //       aggs: {
  //         transferOut: {
  //           filter: {
  //             bool: {
  //               must: [
  //                 {
  //                   bool: {
  //                     should: [
  //                       {
  //                         bool: {
  //                           must: [
  //                             {
  //                               term: {
  //                                 concept_id: 1946
  //                               }
  //                             },
  //                             {
  //                               terms: {
  //                                 value_coded: [1065]
  //                               }
  //                             }
  //                           ]
  //                         }
  //                       },
  //                       {
  //                         terms: {
  //                           concept_id: [1596, 1285]
  //                         }
  //                       }
  //                     ]
  //                   }
  //                 }
  //               ]
  //             }
  //           },
  //           aggs: {
  //             patients: {
  //               terms: {
  //                 field: 'person_id',
  //                 size: 0
  //               }
  //             }
  //           }
  //         }
  //       },
  //       size: 0
  //     }
  //   };

  //   if (!_.isEmpty(params)) {
  //     var conditions = query.body.aggs.transferOut.filter.bool.must;

  //     _handleAgeCondition(params, conditions);
  //     _handleLocationCondition(params, conditions);
  //     _handlePeriodCondition(params, conditions);

  //     //Deal with gender.
  //     if (params.gender) {
  //       var gender = {
  //         term: {
  //           gender: params.gender
  //         }
  //       };
  //       conditions.push(gender);
  //     }
  //   }
  //   return query;
  // }

  function transferOutQuery(params) {
    var params = params || {};
    // basic mult-select query conditions
    var conditions = [];
    if (!_.isEmpty(params)) {
      _handleAgeCondition(params, conditions);
      _handleLocationCondition(params, conditions);
      _handlePeriodCondition(params, conditions);
      _handleGenderCondition(params, conditions);
      _handleVoidedCondition(params, conditions);
    }
    var _body = ejs
      .Request()
      .size(0)
      .query(
        ejs
          .BoolQuery()
          .must(conditions)
          .must(
            ejs
              .BoolQuery()
              .should(
                ejs
                  .BoolQuery()
                  .must(ejs.TermQuery('concept_id', concepts.HIV_NEGATIVE))
                  .must(ejs.TermQuery('value_coded', concepts.YES))
              )
              .should(
                ejs.TermsQuery('concept_id', [
                  concepts.REASON_EXITED,
                  concepts.TRANSFERED
                ])
              )
          )
      )
      .agg(ejs.TermsAggregation(params.aggsName).field('person_id').size(0));

    var queryObj = {
      index: params['index'] || index,
      type: params['type'] || type,
      body: _body
    };

    return queryObj;
  }

  function _handlePeriodCondition(params, conditionsArray) {
    var includeCondition = false;
    var period = ejs.RangeQuery('obs_datetime');

    if (params.startDate) {
      period = ejs.RangeQuery('obs_datetime').gte(params.startDate);
      includeCondition = true;
    }

    if (params.endDate) {
      period = ejs.RangeQuery('obs_datetime').lte(params.endDate);
      includeCondition = true;
    }

    if (includeCondition) {
      conditionsArray.push(period);
    }
  }

  function _handleAgeCondition(params, conditionsArray) {
    var age = ejs.RangeQuery('birthdate');

    var includeCondition = false;

    if (params.lowerAgeLimit) {
      if (params.endDate) {
        age = ejs
          .RangeQuery('birthdate')
          .lte(params.endDate + '||-' + params.lowerAgeLimit + 'y');
      } else {
        age = ejs
          .RangeQuery('birthdate')
          .lte('now-' + params.lowerAgeLimit + 'y');
      }
      includeCondition = true;
    }

    if (params.upperAgeLimit) {
      if (params.endDate) {
        age = ejs
          .RangeQuery('birthdate')
          .gte(params.endDate + '||-' + params.upperAgeLimit + 'y');
      } else {
        age = ejs
          .RangeQuery('birthdate')
          .gte('now-' + params.upperAgeLimit + 'y');
      }
      includeCondition = true;
    }

    if (includeCondition) {
      conditionsArray.push(age);
    }
  }

  function _handleLocationCondition(params, conditionsArray) {
    if (params.location) {
      var locations = [];
      var location = ejs.TermsQuery('location_id', []);

      if (typeof params.location === 'array') {
        for (var loc in params.location) {
          locations.push(loc);
        }
      } else {
        locations.push(params.location);
      }
      location = ejs.TermsQuery('location_id', locations);
      conditionsArray.push(location);
    }
  }

  function _handleGenderCondition(params, conditionsArray) {
    if (params.gender) {
      var gender = ejs.TermQuery('gender', params.gender);
      conditionsArray.push(gender);
    }
  }

  function _handleVoidedCondition(params, conditionsArray) {
    var voided = params.voided || false;
    conditionsArray.push(ejs.TermQuery('voided', voided));
  }

  return {
    enrolledInCareQuery: enrolledInCareQuery,
    activeInCareQuery: activeInCareQuery,
    transferOutQuery: transferOutQuery
  };
})();
