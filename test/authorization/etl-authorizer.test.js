var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var userMocks = require('../mock/user-mock');
//var nock = require('nock');
//var _ = require('underscore');
//var Hapi = require('hapi');
//var fakeServer = require('../sinon-server-1.17.3');
var etlAuthorizer = require('../../authorization/etl-authorizer');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('ETL-AUTHORIZER TESTS', function() {

    //var stub;
    var userSample;
    beforeEach(function(done) {
      //stub = sinon.stub(db, 'queryServer_test');
      userSample = userMocks.getMockedUser();
      etlAuthorizer.setUser(userSample);
      done();
    });

    afterEach(function() {
      //stub.restore();
      etlAuthorizer.setUser(undefined);
    });
    
    it('should inject user mocks',
    function(){
        expect(userMocks).to.be.defined;
        expect(userSample).to.be.defined;
    });
    
    it('should set user when setUser is called',
    function(){
        etlAuthorizer.setUser(userSample);
        expect(etlAuthorizer.getUser()).to.deep.equal(userSample);
    });
    
    it('should return true when a user has a certain privilege' + 
    ' and hasPrivilege is invoked ',
    function(){
        var toFind = userSample.privileges[2].display;
        var hasPrivilege =  etlAuthorizer.hasPrivilege(toFind);
        expect(hasPrivilege).to.be.true;       
    });
    
    it('should always return true when a user is a super user' + 
    ' and hasPrivilege is invoked ',
    function(){
        
        var userWithSuperUserRole =  userMocks.getMockedUser();
        
        //add super user role
        var superUserRole = {
            uuid:'some-uuid',
            display: 'System Developer' //this is a super user role
        };
        
        userWithSuperUserRole.roles.push(superUserRole);
        
        //make privileges empty as is the case with super user roles
         userWithSuperUserRole.privileges = [];
         
         //set the user 
         etlAuthorizer.setUser(userWithSuperUserRole);
          
        var hasPrivilege =  etlAuthorizer.hasPrivilege('some random feature');
        expect(hasPrivilege).to.be.true;       
    });
    
    
});