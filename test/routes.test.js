
var chai = require('chai');
var routes = require('../etl-routes');
var mServer = require("../etl-server");
var db = require('../etl-db');
var dao = require('../etl-dao');
var request = require("request");
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require("sinon-chai"); //expection engine for sinion
var mockData = require('./mock/mock-data');
var nock = require('nock');
var _ = require('underscore');
var Hapi = require('hapi');
var fakeServer = require('./sinon-server-1.17.3');
var server = null;

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;


var baseUrl = "http://localhost:8002";
chai.use(sinonChai);

describe("ETL-SERVER TESTS", function() {

  describe('Testing /etl/patient/{uuid} Endpoint', function() {


    beforeEach(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      server.autoRespondAfter = 0; // answer immediately
    });

    afterEach(function() {
      server.restore();
    });
    //
    // beforeEach(function() {
    //   var okResponse = [
    //     200,
    //     { 'Content-type': 'application/json' },
    //     '{"hello":"world"}'
    //   ];
    //   server.respondWith('GET', baseUrl + '/etl/patient/123', okResponse);
    // });

    // example showing how to use a stub to fake a method
    var stub;
    beforeEach(function(done) {
      stub = sinon.stub(db, 'queryServer_test');
      // .yieldsTo(1, null, { result:mockData.getPatientMockData() });
      done();
    });

    afterEach(function () {
      stub.restore();
    });
    it("should return an array of patient record when the url /etl/patient/uuid is called", function(done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({ result:mockData.getPatientMockData() });
        var options = {
          params:{ uuid: '123' },
          query: { order:null,
            fields:null,
            startIndex: null,
            limit:null
          }
          // headers: { authorization: "Basic YWRtaW46QWRtaW4xMjM=" }
        };
        // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

        dao.getPatient(options, function(res) {
          console.log('body  ++', res);
          // console.log('body  ++',res.statusCode);
          // expect(res.statusCode).equal(200);
          // assert.equal(res.result.result[0].person_id, 123);
          // expect(dao.getPatient).calledOnce;
          // expect(res.result.result).to.be.an('array');
          done();
        });

    });
    it("should return an error when the patient uuid is not passed in /etl/patient/uuid", function(done) {
      //   var error = new Error('Not Found');
      //   // stub.callsArgWithAsync(1, error);
      //   // stub.callsArgWithAsync(1, null, {result:mockData.getPatientMockData()});
      //   var okResponse = [
      //       404,
      //       { 'Content-type': 'application/json' },
      //       '{"eroor":"Not Found"}'
      //     ];
      // server.respondWith('GET', baseUrl + '/etl/patient', okResponse);
      //   var options = {
      //     url: baseUrl+'/etl/patient',
      //     method: 'GET'
      //   };
      //   server.inject(options, function(res) {
      //      // console.log('body  ++',res.result);
      //     // console.log('body  ++',res.statusCode);
      //     expect(res.statusCode).to.equal(404);
      //     expect(res.result.error).to.equal('Not Found');
      //     done();
      //   });

    });

    it('should have route /etl/patient/{uuid}', function(done) {
      var table = server.table();
      var url = '/etl/patient/{uuid}';
      var path = null;
      _.each(table, function(r){        // console.log(r.table);
         _.each(r.table, function(p){
          if (p.path === url) path = p.path;
        });
      });
      expect(path).to.equal(url);
      done();
    });
  });

describe('Tests for /etl/custom_data Endpoint', function(){
  var stub;
    beforeEach(function () {
      stub = sinon.stub(dao, 'getCustomData'); //.returns({ one: 'fakeOne' });
    });

    afterEach(function () {
      stub.restore();
    });

    it('should have route /etl/custom_data/{userParams*3}', function(done) {
      var table = server.table();
      var url = '/etl/custom_data/{userParams*3}';
      var path = null;
      _.each(table, function(r){        // console.log(r.table);
         _.each(r.table, function(p){
          if (p.path === url) path = p.path;
        });
      });
      expect(path).to.equal(url);
      done();
    });

    it('should return an encounter record given the encounter id', function(done){
      stub.callsArgWithAsync(1, null,  {result:mockData.getCustomMockData()});
      var options = {
          url: baseUrl+'/etl/custom_data/patient/patient_id/1001',
          method: 'GET'
      };
        server.inject(options, function(res) {
          expect(res.statusCode).equal(200);
          expect(res.result.result[0].patient_id).to.equal(1001);
          expect(res.result.result[0]).to.have.property('date_created');
          expect(dao.getCustomData).calledOnce;
          expect(res.result.result).to.be.an('array');
          done();
        });

    });
});

describe('Test the Main End Point /', function() {

		it("returns status code 200", function(done) {
			// console.info('passed here');
      		request.get(baseUrl, function(error, response, body) {
      			console.log(body);
      			expect(response.statusCode).equal(200);
            done();
      		});

    	});

    	it("returns Hello, World", function(done) {
			console.info('passed here');
      		request.get(baseUrl, function(error, response, body) {
      			console.log(body);
      			expect(body).to.equal('Hello, World! HAPI Demo Server');
            done();
      		});
        	// assert.equal(200, response.statusCode);
    	});
	});
});
