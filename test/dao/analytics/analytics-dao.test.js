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

describe('ANALYTICS LEVEL ETL-SERVER TESTS', function () {
  describe('Testing etl-dao layer', function () {
    // example showing how to use a stub to fake a method
    var stub;
    beforeEach(function (done) {
      stub = sinon.stub(db, 'queryServer_test');

      // .yieldsTo(1, null, { result:mockData.getPatientMockData() });
      done();
    });

    afterEach(function () {
      stub.restore();
    });

    it('should create the right query parts object when  getHivSummaryData is called', function (done) {
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
          joins: [
            ['a', 't2'],
            ['c', 'd']
          ]
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getHivSummaryData(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      expect(queryParts.where).to.include(
        'date(encounter_datetime) >= ? and date(encounter_datetime) <= ?'
      );
      expect(queryParts.joins).to.be.an('array');
      expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.location');
      expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
      expect(queryParts.joins).to.have.deep.property(
        '[0][2]',
        't1.location_uuid = t2.uuid'
      );
      expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.person');
      expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');
    });

    it('should create the right fields property when getHivSummaryData is called', function (done) {
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
          fields: 'a,b,c',
          startIndex: null,
          limit: null
        }
      };

      dao.getHivSummaryData(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });
  });
});
