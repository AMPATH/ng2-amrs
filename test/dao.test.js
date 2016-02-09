var chai = require('chai');
var routes = require('../etl-routes');
// var server = require('../etl-server');
var db = require('../etl-db');
var dao = require('../etl-dao');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var mockData = require('./mock/mock-data');
// var nock = require('nock');
var _ = require('underscore');
var Hapi = require('hapi');
var fakeServer = require('./sinon-server-1.17.3');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

chai.use(sinonChai);

describe('ETL-SERVER TESTS', function() {

  describe('Testing etl-dao layer', function() {

    // example showing how to use a stub to fake a method
    var stub;
    beforeEach(function(done) {
      stub = sinon.stub(db, 'queryServer_test');

      // .yieldsTo(1, null, { result:mockData.getPatientMockData() });
      done();
    });

    afterEach(function() {
      stub.restore();
    });

    it('should create the right query parts object when getPatient is called',
    function(done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '123'
        },
        query: {
          order: null,
          fields: null,
          startIndex: null,
          limit: null
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getPatient(options, function(res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      //get patient always fetched data from etl.flat_hiv_summary
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      // if fields is null output all columns
      expect(queryParts.columns).to.equal('*');

      expect(queryParts.where).to.include(options.params.uuid);
    });

    it('should create the right fields property when getPatient is called',
    function(done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '124'
        },
        query: {
          order: null,
          fields: ['a', 'b', 'c'],
          startIndex: null,
          limit: null
        }
      };

      dao.getPatient(options, function(res) {
        // console.log('bodyxx  ++', res);
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('array');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    // it('should have route /etl/patient/{uuid}', function(done) {
    //   var table = server.table();
    //   var url = '/etl/patient/{uuid}';
    //   var path = null;
    //   _.each(table, function(r) { // console.log(r.table);
    //     _.each(r.table, function(p) {
    //       if (p.path === url) path = p.path;
    //     });
    //   });
    //
    //   expect(path).to.equal(url);
    //   done();
    // });

    it('should create the right query parts object when getPatientData is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '123'
            },
            query: {
              order: null,
              fields: null,
              startIndex: null,
              limit: null
            }
          };

          // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

          dao.getPatientData(options, function(res) {
            // console.log('body2  ++', res);
            done();
          });

          // console.log('body2  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];
          expect(queryParts.table).to.equal('etl.flat_labs_and_imaging');
          // if fields is null output all columns
          expect(queryParts.columns).to.equal('*');

          expect(queryParts.where).to.include(options.params.uuid);
        });

    it('should create the right fields property when getPatientData is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '124'
            },
            query: {
              order: null,
              fields: "a,b,c",
              startIndex: null,
              limit: null
            }
          };

          dao.getPatientData(options, function(res) {
            done();
          });

          // console.log('bodyxx  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];

          expect(queryParts.columns).to.be.an('string');
          expect(queryParts.columns).to.include('a');
          expect(queryParts.columns).to.include('b');
          expect(queryParts.columns).to.include('c');
        });

    it('should create the right query parts object when getPatientVitals is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '123'
            },
            query: {
              order: null,
              fields: null,
              startIndex: null,
              limit: null
            }
          };

          // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

          dao.getPatientVitals(options, function(res) {
            // console.log('body2  ++', res);
            done();
          });

          // console.log('body2  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];
          expect(queryParts.table).to.equal('etl.flat_vitals');
          // if fields is null output all columns
          expect(queryParts.columns).to.equal('*');

          expect(queryParts.where).to.include(options.params.uuid);
        });

    it('should create the right fields property when getPatientVitals is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '124'
            },
            query: {
              order: null,
              fields: ['a', 'b', 'c'],
              startIndex: null,
              limit: null
            }
          };

          dao.getPatientVitals(options, function(res) {
            done();
          });

          // console.log('bodyxx  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];

          expect(queryParts.columns).to.be.an('array');
          expect(queryParts.columns).to.include('a');
          expect(queryParts.columns).to.include('b');
          expect(queryParts.columns).to.include('c');
        });
    //
    it('should create the right query parts object when getClinicHivSummayIndicators is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '123'
            },
            query: {
              order: null,
              fields: null,
              startIndex: null,
              limit: null
            }
          };

          // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

          dao.getClinicHivSummayIndicators(options, function(res) {
            // console.log('body2  ++', res);
            done();
          });

          // console.log('body2  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];
          expect(queryParts.table).to.equal('etl.hiv_summary_indicators');
          // if fields is null output all columns
          expect(queryParts.columns).to.equal('*');

          expect(queryParts.where).to.include(options.params.uuid);
        });

    it('should create the right fields property when getClinicHivSummayIndicators is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '124'
            },
            query: {
              order: null,
              fields: ['a', 'b', 'c'],
              startIndex: null,
              limit: null
            }
          };

          dao.getClinicHivSummayIndicators(options, function(res) {
            done();
          });

          // console.log('bodyxx  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];

          expect(queryParts.columns).to.be.an('array');
          expect(queryParts.columns).to.include('a');
          expect(queryParts.columns).to.include('b');
          expect(queryParts.columns).to.include('c');
        });


    it('should create the right query parts object when getClinicDefaulterList is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '123'
            },
            query: {
              order: null,
              fields: null,
              startIndex: null,
              limit: null
            }
          };

          // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

          dao.getClinicDefaulterList(options, function(res) {
            // console.log('body2  ++', res);
            done();
          });

          // console.log('body2  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];
          expect(queryParts.table).to.equal('etl.flat_defaulters');
          // if fields is null output all columns
          expect(queryParts.columns).to.equal('*');

          expect(queryParts.where).to.include(options.params.uuid);
        });

    it('should create the right fields property when getClinicDefaulterList is called',
        function(done) {
          // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
          stub.yields({
            startIndex: 0,
            size: 1,
            result: mockData.getPatientMockData()
          });
          var options = {
            params: {
              uuid: '124'
            },
            query: {
              order: null,
              fields: ['a', 'b', 'c'],
              startIndex: null,
              limit: null
            }
          };

          dao.getClinicDefaulterList(options, function(res) {
            done();
          });

          // console.log('bodyxx  ++', stub.args[0][0]);
          var queryParts = stub.args[0][0];

          expect(queryParts.columns).to.be.an('array');
          expect(queryParts.columns).to.include('a');
          expect(queryParts.columns).to.include('b');
          expect(queryParts.columns).to.include('c');
        });

      it('should create the right query parts object when getHasNotReturned is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins: [['a'],['b'],['c']]
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao.getHasNotReturned(options, function(res) {
                //   console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              // if fields is null output default given columns
              expect(queryParts.columns).to.equal('t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers');

              expect(queryParts.where).to.include("t1.location_uuid = ? and t1.rtc_date between ? and ? and next_clinic_datetime is null");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'etl.derived_encounter');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.encounter_id = t2.encounter_id');
              expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.person_name');
              expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');

              expect(queryParts.group).to.be.an('array');
              expect(queryParts.group).to.include('person_id');
              assert.equal(queryParts.group.length, 1);

          });

      it('should create the right fields property when getHasNotReturned is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: ['a', 'b', 'c'],
                      startIndex: null,
                      limit: null
                  }
              };

              dao.getHasNotReturned(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('array');
              expect(queryParts.columns).to.include('a');
              expect(queryParts.columns).to.include('b');
              expect(queryParts.columns).to.include('c');
          });

      it('should create the right query parts object when getClinicMonthlyAppointmentSchedule is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      group:[]
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao.getClinicMonthlyAppointmentSchedule(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              expect(queryParts.where).to.include(options.params.uuid);
              expect(queryParts.group).to.be.an('array');

              expect(queryParts.group).to.include('rtc_date');
              assert.equal(queryParts.group.length, 1);


          });

      it('should create the right fields property when getClinicMonthlyAppointmentSchedule is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null,
                      group:[]
                  }
              };

              dao.getClinicMonthlyAppointmentSchedule(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include('a');
              expect(queryParts.columns).to.include('b');
              expect(queryParts.columns).to.include('c');
          });
      it('should create the right query parts object when getClinicMonthlyVisits is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123',
                      startDate: "2015-08-03T21:00:00.000Z"

                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      group:[]
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao.getClinicMonthlyVisits(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              expect(queryParts.where).to.include(options.params.uuid,options.params.startDate);


          });

      it('should create the right fields property when getClinicMonthlyVisits is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: ['a', 'b', 'c'],
                      startIndex: null,
                      limit: null,
                      group:[]
                  }
              };

              dao.getClinicMonthlyVisits(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('array');
              expect(queryParts.columns).to.include('a');
              expect(queryParts.columns).to.include('b');
              expect(queryParts.columns).to.include('c');
              expect(queryParts.group).to.be.an('array');
              expect(queryParts.group).to.include('encounter_datetime');
              assert.equal(queryParts.group.length, 1);
          });

      it('should create the right query parts object when getClinicEncounterData is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:[]
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao.getClinicEncounterData(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              expect(queryParts.where).to.include(options.params.uuid);
              // if fields is null output all columns
              expect(queryParts.columns).to.equal("t1.*,t2.gender,round(datediff(t1.encounter_datetime,t2.birthdate)/365) as age,group_concat(identifier) as identifiers");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.person');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.person_id = t2.person_id');
              expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.patient_identifier');
              expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');




          });

      it('should create the right fields property when getClinicEncounterData is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:[]
                  }
              };

              dao.getClinicEncounterData(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include('a');
              expect(queryParts.columns).to.include('b');
              expect(queryParts.columns).to.include('c');
              expect(queryParts.group).to.be.an('array');
              expect(queryParts.group).to.include('encounter_id');
              expect(queryParts.group).to.include('person_id');
              assert.equal(queryParts.group.length, 2);


          });

      it('should create the right query parts object when  getClinicAppointmentSchedule is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:['a']
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao. getClinicAppointmentSchedule(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              expect(queryParts.where).to.include(options.params.uuid);
              // if fields is null output all columns
              expect(queryParts.columns).to.equal("t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'etl.derived_encounter');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.encounter_id = t2.encounter_id');
              expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.person_name');
              expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');

              expect(queryParts.group).to.be.an('array');
              expect(queryParts.group).to.include('person_id');
              assert.equal(queryParts.group.length, 1);


          });

      it('should create the right fields property when getClinicAppointmentSchedule is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null
                  }
              };

              dao. getClinicAppointmentSchedule(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include('a');
              expect(queryParts.columns).to.include('b');
              expect(queryParts.columns).to.include('c');
          });

      it('should create the right query parts object when  getClinicDailyVisits is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:['a']
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao. getClinicDailyVisits(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              expect(queryParts.where).to.include(options.params.uuid);
              // if fields is null output all columns
              expect(queryParts.columns).to.equal("t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'etl.derived_encounter');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.encounter_id = t2.encounter_id');
              expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.person_name');
              expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');

              expect(queryParts.group).to.be.an('array');
              expect(queryParts.group).to.include('person_id');
              assert.equal(queryParts.group.length, 1);


          });

      it('should create the right fields property when getClinicDailyVisits is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null
                  }
              };

              dao. getClinicDailyVisits(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include('a');
              expect(queryParts.columns).to.include('b');
              expect(queryParts.columns).to.include('c');
          });

      it('should create the right query parts object when  getPatientCountGroupedByLocation is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:['a']
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());
              dao. getPatientCountGroupedByLocation(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('amrs.patient');
              // if fields is null output all columns
              expect(queryParts.columns).to.equal("t3.location_id,t3.name,count( distinct t1.patient_id) as total");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.encounter');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.patient_id = t2.patient_id');
              expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.location');
              expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');

              expect(queryParts.group).to.be.an('array');
              expect(queryParts.group).to.include('t3.uuid,t3.name');
              assert.equal(queryParts.group.length, 1);


          });

      it('should create the right fields property when getPatientCountGroupedByLocation is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null
                  }
              };

              dao. getPatientCountGroupedByLocation(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include('t3.location_id,t3.name,count( distinct t1.patient_id) as total');

          });
      it('should create the right query parts object when  getPatientDetailsGroupedByLocation is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:['a']
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao. getPatientDetailsGroupedByLocation(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('amrs.patient');
              // if fields is null output all columns
              expect(queryParts.columns).to.equal("distinct t4.uuid as patientUuid, t1.patient_id, t3.given_name, t3.middle_name, t3.family_name");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.encounter');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.patient_id = t2.patient_id');
              expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.person_name');
              expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');

          });

      it('should create the right fields property when getPatientDetailsGroupedByLocation is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '124'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null
                  }
              };

              dao. getPatientDetailsGroupedByLocation(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include('distinct t4.uuid as patientUuid, t1.patient_id, t3.given_name, t3.middle_name, t3.family_name');

          });

     it('should create the right query parts object when  getPatientListByIndicator is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {

                  params: {
                      reportName: 'reportName'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:['a'],
                      locations: "123,456",
                      indicator: 'indicator'
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao. getPatientListByIndicator(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              // if fields is null output all columns
              expect(queryParts.columns).to.equal("t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.person_name');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.person_id = t2.person_id');

          });

      it('should create the right fields property when getPatientListByIndicator is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      reportName: 'reportName'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null,
                      locations: "123,456",
                      indicator: 'indicator'

                  }
              };

              dao.getPatientListByIndicator(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include("t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid");

          });

      it('should create the right query parts object when  getHivSummaryData is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      uuid: '123'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],

                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao. getHivSummaryData(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              expect(queryParts.where).to.include("encounter_datetime >= ? and encounter_datetime <= ? and t1.location_id in ?");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.location');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.location_uuid = t2.uuid');
              expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.person');
              expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');

          });

      it('should create the right fields property when getHivSummaryData is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      locations: '124'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null
                  }
              };

              dao. getHivSummaryData(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];

              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include('a');
              expect(queryParts.columns).to.include('b');
              expect(queryParts.columns).to.include('c');
          });

      it('should create the right query parts object when  getPatientByIndicatorAndLocation is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {

                  params: {
                      reportName: 'reportName'
                  },
                  query: {
                      order: null,
                      fields: null,
                      startIndex: null,
                      limit: null,
                      joins:[['a','t2'],['c','d']],
                      group:['a'],
                      locations: "123,456",
                      indicator: 'indicator'
                  }
              };

              // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

              dao. getPatientByIndicatorAndLocation(options, function(res) {
                  // console.log('body2  ++', res);
                  done();
              });

              // console.log('body2  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.table).to.equal('etl.flat_hiv_summary');
              // if fields is null output all columns
              expect(queryParts.columns).to.equal("t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid");
              expect(queryParts.joins).to.be.an('array');
              expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.person_name');
              expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
              expect(queryParts.joins).to.have.deep.property('[0][2]', 't1.person_id = t2.person_id');

          });

      it('should create the right fields property when getPatientByIndicatorAndLocation is called',
          function(done) {
              // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
              stub.yields({
                  startIndex: 0,
                  size: 1,
                  result: mockData.getPatientMockData()
              });
              var options = {
                  params: {
                      reportName: 'reportName'
                  },
                  query: {
                      order: null,
                      fields: "a,b,c",
                      startIndex: null,
                      limit: null,
                      group:['a'],
                      locations: "123,456",
                      indicator: 'indicator'

                  }
              };

              dao.getPatientByIndicatorAndLocation(options, function(res) {
                  done();
              });

              // console.log('bodyxx  ++', stub.args[0][0]);
              var queryParts = stub.args[0][0];
              expect(queryParts.columns).to.be.an('string');
              expect(queryParts.columns).to.include("t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid");
              expect(queryParts.group).to.be.an('array');
              expect(queryParts.group).to.include('t1.person_id');
              assert.equal(queryParts.group.length, 1);

          });




  });

  // describe('Tests for /etl/custom_data Endpoint', function() {
  //   var stub;
  //   beforeEach(function() {
  //     stub = sinon.stub(dao, 'getCustomData'); //.returns({ one: 'fakeOne' });
  //   });
  //
  //   afterEach(function() {
  //     stub.restore();
  //   });
  //
  //   it('should have route /etl/custom_data/{userParams*3}', function(done) {
  //     var table = server.table();
  //     var url = '/etl/custom_data/{userParams*3}';
  //     var path = null;
  //     _.each(table, function(r) { // console.log(r.table);
  //       _.each(r.table, function(p) {
  //         if (p.path === url) path = p.path;
  //       });
  //     });
  //
  //     expect(path).to.equal(url);
  //     done();
  //   });
  // });

  // describe('Test the Main End Point /', function() {
  //   it('returns status code 200', function(done) {
  //     // console.info('passed here');
  //     request.get(baseUrl, function(error, response, body) {
  //       console.log(body);
  //       expect(response.statusCode).equal(200);
  //       done();
  //     });
  //   });
  //
  //   it('returns Hello, World', function(done) {
  //     console.info('passed here');
  //     request.get(baseUrl, function(error, response, body) {
  //       console.log(body);
  //       expect(body).to.equal('Hello, World! HAPI Demo Server');
  //       done();
  //     });
  //
  //     // assert.equal(200, response.statusCode);
  //   });
  // });
});
