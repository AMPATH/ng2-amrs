var chai = require('chai');
// var routes = require('../etl-routes');
// var server = require('../etl-server');
var db = require('../etl-db');
var dao = require('../etl-dao');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var mockData = require('./mock/mock-data');
var nock = require('nock');
var _ = require('underscore');
var Hapi = require('hapi');
var fakeServer = require('./sinon-server-1.17.3');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('ETL-SERVER TESTS', function() {

  describe('Testing DAO', function() {

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
