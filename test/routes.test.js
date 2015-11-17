
var chai = require('chai');
var routes = require('../etl-routes');
var server = require("../etl-server");
var dao = require('../etl-dao');
var request = require("request");
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require("sinon-chai"); //expection engine for sinion
var mockData = require('./mock/mock-data');
var nock = require('nock');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var base_url = "http://localhost:8002";
chai.use(sinonChai);

describe("ETL-SERVER TESTS", function() {

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
          method: 'GET'
        };
        server.inject(options, function(res) {
          // console.log('body  ++',res.result);
          // console.log('body  ++',res.statusCode);
          expect(res.statusCode).equal(200);
          assert.equal(res.statusCode, 200);
          assert.equal(res.result.result[0].person_id, 123); 
          expect(dao.getPatient).calledOnce;  
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
           console.log('body  ++',res.result);
          // console.log('body  ++',res.statusCode);
          expect(res.statusCode).to.equal(404);
          expect(res.result.error).to.equal('Not Found');
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