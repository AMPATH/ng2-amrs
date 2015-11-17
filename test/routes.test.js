
var chai = require('chai');
var routes = require('../etl-routes');
var server = require("../etl-server");
var dao = require('../etl-dao');
var request = require("request");
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require("sinon-chai"); //expection engine for sinion
var mockData = require('./mock/mock-data');
var nock = require('nock');
var _ = require('underscore');
var Hapi = require('hapi');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var basicHeader = function (username, password) {
    return 'Basic ' + (new Buffer(username + ':' + password, 'utf8')).toString('base64');
}

var base_url = "http://localhost:8002";
chai.use(sinonChai);

describe("ETL-SERVER TESTS", function() {
  beforeEach(function(){
     user1 = {      
        username: 'admin',
        password: 'Admin123',     
        name: 'Fake User',        
        email: 'test@test.com'
    };
  })

  describe('Testing /etl/patient/{uuid} Endpoint', function() {
    //example showing how to use a stub to fake a method
    var stub;
    beforeEach(function () {
      stub = sinon.stub(dao, 'getPatient'); //.returns({ one: 'fakeOne' });
    });

    afterEach(function () {
      stub.restore();
    });
    it("should return an array of patient record when the url /etl/patient/uuid is called", function(done) {        
        stub.callsArgWithAsync(1, null, {result:mockData.getPatientMockData()});
        var options = {
          url: base_url+'/etl/patient/123',
          method: 'GET',
          headers: { authorization: "Basic YWRtaW46QWRtaW4xMjM=" }
        };

        server.inject(options, function(res) {
          // console.log('body  ++',res.result);
          // console.log('body  ++',res.statusCode);
          expect(res.statusCode).equal(200);
          assert.equal(res.result.result[0].person_id, 123); 
          expect(dao.getPatient).calledOnce;
          expect(res.result.result).to.be.an('array');
          done();       
        });        
                  
    });
    it("should return an error when the patient uuid is not passed in /etl/patient/uuid", function(done) {
        var error = new Error('Not Found');        
        stub.callsArgWithAsync(1, error);
        // stub.callsArgWithAsync(1, null, {result:mockData.getPatientMockData()});
        var options = {
          url: base_url+'/etl/patient',
          method: 'GET'
        };
        server.inject(options, function(res) {
           // console.log('body  ++',res.result);
          // console.log('body  ++',res.statusCode);
          expect(res.statusCode).to.equal(404);
          expect(res.result.error).to.equal('Not Found');
          done();       
        });        
                  
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
          url: base_url+'/etl/custom_data/patient/patient_id/1001',
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
      		request.get(base_url, function(error, response, body) {
      			console.log(body);
      			expect(response.statusCode).equal(200);
            done();
      		});
         	
    	});

    	it("returns Hello, World", function(done) {
			console.info('passed here');
      		request.get(base_url, function(error, response, body) {
      			console.log(body);
      			expect(body).to.equal('Hello, World! HAPI Demo Server');     
            done(); 			
      		});
        	// assert.equal(200, response.statusCode);     	
    	});	   	
	});
});