var chai = require('chai');
var routes = require('../../../etl-routes');
// var server = require('../etl-server');
var db = require('../../../etl-db');
var dao = require('../../../etl-dao');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var mockData = require('../../mock/mock-data');
// var nock = require('nock');
var _ = require('underscore');
var Hapi = require('hapi');
var fakeServer = require('../../sinon-server-1.17.3');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

chai.use(sinonChai);

describe('PATIENT LEVEL ETL-SERVER TESTS', function() {

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
          expect(queryParts.columns).to.equal('t1.*, t2.cur_arv_meds');

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
          // expect(queryParts.table).to.equal('etl.flat_hiv_summary');
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
          // expect(queryParts.table).to.equal('etl.flat_hiv_summary');
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
});
