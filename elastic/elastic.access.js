module.exports = (function () {
  'use strict';
  var careQueries = require('./queries/care.treatment.query.js');
  var _ = require('lodash');
  var elastic = require('elasticsearch');

  var eClient = new elastic.Client({
    host: 'https://etl.ampath.or.ke/elastic',
    log: 'debug'
  });

  function getEnrolledInCare(params, callback, eCallback) {
    var query = careQueries.enrolledInCareQuery(params);
    console.log(JSON.stringify(query));
    eClient.search(query).then(
      function (data) {
        var count = data.aggregations.enrolled.buckets.length;
        if (typeof callback === 'function') {
          callback(count);
        }
      },
      function (err) {
        console.trace(err.message);
        if (typeof eCallback === 'function') {
          eCallback(err);
        }
      }
    );
  }

  function getEnrolledInCareMOh(params, callback) {
    // Below 1 year
    var params = params || {};
    params.upperAgeLimit = 1;

    var query = careQueries.enrolledInCareQuery(params);
    console.log('getEnrolledInCareMOh: below 1 query: ', JSON.stringify(query));
    var below1;
    eClient.search(query).then(function (data) {
      below1 = data.aggregations.enrolled.buckets.length;
      //Below 15 years Male
      params.upperAgeLimit = 14;
      params.gender = 'M';
      query = careQueries.enrolledInCareQuery(params);
      console.log(
        'getEnrolledInCareMOh: below 15 (female) query: ',
        JSON.stringify(query)
      );
      var below15Male;
      eClient.search(query).then(function (data) {
        below15Male = data.aggregations.enrolled.buckets.length;

        //Below 15 years Female
        params = params || {};
        params.upperAgeLimit = 14;
        params.gender = 'F';
        query = careQueries.enrolledInCareQuery(params);
        console.log(
          'getEnrolledInCareMOh: below 15 (female) query: ',
          JSON.stringify(query)
        );
        eClient.search(query).then(function (data) {
          var below15Female = data.aggregations.enrolled.buckets.length;
          delete params.upperAgeLimit;
          // 15 years and above Male
          params = params || {};
          params.lowerAgeLimit = 14;
          params.gender = 'M';
          console.log('params: ', params, 'params object', params);
          query = careQueries.enrolledInCareQuery(params);
          console.log(
            'getEnrolledInCareMOh: 15 and above (Male) query: ',
            JSON.stringify(query)
          );
          eClient.search(query).then(function (data) {
            var above15Male = data.aggregations.enrolled.buckets.length;

            // 15 years and above Female
            params = params || {};
            params.lowerAgeLimit = 14;
            params.gender = 'F';
            query = careQueries.enrolledInCareQuery(params);
            console.log(
              'getEnrolledInCareMOh: 15 and above (Female) query: ',
              JSON.stringify(query)
            );
            eClient.search(query).then(function (data) {
              var above15Female = data.aggregations.enrolled.buckets.length;
              var total =
                below15Male + below15Female + above15Female + above15Male;
              var response = {
                indicator: 'enrolled in care',
                total: total,
                below1: below1,
                below15: {
                  male: below15Male,
                  female: below15Female
                },
                above15: {
                  male: above15Male,
                  female: above15Female
                }
              };

              if (params.location) {
                response.location = params.location;
              }

              if (typeof callback === 'function') {
                callback(response);
              }
            });
          });
        });
      });
    });
  }

  function getActiveInCareMoh(params, callback, eCallback) {
    // Below 1 year
    var params = params || {};
    params.upperAgeLimit = 1;

    var query = careQueries.activeInCareQuery(params);
    console.log('getActiveInCareMoh: below 1 query: ', JSON.stringify(query));
    eClient.search(query).then(function (data) {
      var buckets = data.aggregations.active.patients.buckets;
      var below1Patients = _getPatients(buckets);
      //Get transfer outs.
      if (params.endDate) {
        var d = new Date(params.endDate);
        d.setMonth(d.getMonth() - 3);
        params.startDate = d;
      }

      var below1;
      _getActiveInCarePatientsCount(
        params,
        below1Patients,
        function (data) {
          below1 = data;
        },
        'getActiveInCareMoh: below1 tranferout query: '
      );
      // var q = careQueries.transferOutQuery(params);
      // console.log('getActiveInCareMoh: below1 tranferout query: ', JSON.stringify(query));
      // eClient.search(q).then(function(data) {
      //     var outBuckets = data.aggregations.transferOut.patients.buckets;
      //     var below1transferOuts = _getPatients(outBuckets);
      //
      //     //eliminate transfer out.
      //     var below1Count = _.difference(below1Patients, below1transferOuts).length;
      // })
      //Below 15 years Male
      params.upperAgeLimit = 14;
      params.gender = 'M';
      query = careQueries.activeInCareQuery(params);
      console.log(
        'getActiveInCareMoh: below 15 (female) query: ',
        JSON.stringify(query)
      );
      eClient.search(query).then(function (data) {
        var buckets = data.aggregations.active.patients.buckets;
        var below15Patients = _getPatients(buckets);

        //Get the transferOut
        var below15Male;
        _getActiveInCarePatientsCount(
          params,
          below15Patients,
          function (data) {
            below15Male = data;
          },
          'getActiveInCareMoh: below15 Male tranferout query: '
        );

        //Below 15 years Female
        params = params || {};
        params.upperAgeLimit = 14;
        params.gender = 'F';
        query = careQueries.activeInCareQuery(params);
        console.log(
          'getActiveInCareMoh: below 15 (female) query: ',
          JSON.stringify(query)
        );
        eClient.search(query).then(function (data) {
          var buckets = data.aggregations.active.patients.buckets;
          var below15FemalePatients = _getPatients(buckets);
          delete params.upperAgeLimit;

          //eliminate transfer out
          var below15Female;
          _getActiveInCarePatientsCount(
            params,
            below15FemalePatients,
            function (data) {
              below15Female = data;
            },
            'getActiveInCareMoh: below15 feMale tranferout query: '
          );
          // 15 years and above Male
          params = params || {};
          params.lowerAgeLimit = 14;
          params.gender = 'M';
          console.log('params: ', params, 'params object', params);
          query = careQueries.activeInCareQuery(params);
          console.log(
            'getActiveInCareMoh: 15 and above (Male) query: ',
            JSON.stringify(query)
          );
          eClient.search(query).then(function (data) {
            var buckets = data.aggregations.active.patients.buckets;
            var above15MalePatients = _getPatients(buckets);

            // Eliminate transfer outs
            var above15Male;
            _getActiveInCarePatientsCount(
              params,
              above15MalePatients,
              function (data) {
                above15Male = data;
              },
              'getActiveInCareMoh: Above 15 Male tranferout query: '
            );

            // 15 years and above Female
            params = params || {};
            params.lowerAgeLimit = 14;
            params.gender = 'F';
            query = careQueries.activeInCareQuery(params);
            console.log(
              'getActiveInCareMoh: 15 and above (Female) query: ',
              JSON.stringify(query)
            );
            eClient.search(query).then(function (data) {
              var buckets = data.aggregations.active.patients.buckets;
              var above15FemalePatients = _getPatients(buckets);

              // Eliminate transfer outs
              var above15Female;
              _getActiveInCarePatientsCount(
                params,
                above15FemalePatients,
                function (data) {
                  above15Female = data;

                  console.log(
                    'below15Male: ',
                    below15Male,
                    ', below15Female: ',
                    below15Female,
                    ', above15Female: ',
                    above15Female,
                    'above15Male:',
                    above15Male
                  );
                  var total =
                    below15Male + below15Female + above15Female + above15Male;
                  var response = {
                    indicator: 'active in care',
                    total: total,
                    below1: below1,
                    below15: {
                      male: below15Male,
                      female: below15Female
                    },
                    above15: {
                      male: above15Male,
                      female: above15Female
                    }
                  };

                  if (params.location) {
                    response.location = params.location;
                  }

                  if (typeof callback === 'function') {
                    callback(response);
                  }
                },
                'getActiveInCareMoh: Above 15 feMale tranferout query: '
              );
            });
          });
        });
      });
    });
  }

  function _getPatients(buckets) {
    var array = [];
    _.each(buckets, function (b) {
      array.push(b.key);
    });
    return array;
  }

  function _getActiveInCarePatientsCount(
    params,
    patientsCount,
    callback,
    message
  ) {
    var q = careQueries.transferOutQuery(params);
    console.log(message, JSON.stringify(q));
    eClient.search(q).then(function (data) {
      var outBuckets = data.aggregations.transferOut.patients.buckets;
      var transferOuts = _getPatients(outBuckets);

      //eliminate transfer out.
      var count = _.difference(patientsCount, transferOuts).length;
      callback(count);
    });
  }
  return {
    getEnrolledInCare: getEnrolledInCare,
    getEnrolledInCareMOh: getEnrolledInCareMOh,
    getActiveInCareMoh: getActiveInCareMoh
  };
})();
