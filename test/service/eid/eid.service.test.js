var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var mockData = require('../../mock/eid.mock');
var _ = require('underscore');
var Hapi = require('hapi');
var http = require('http');
var Promise = require('bluebird');
var eidService = require('../../../service/eid/eid.service');
require('sinon-as-promised')(Promise);
chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

chai.use(sinonChai);

describe('EID SERVICES TESTS', function () {
  describe('Testing eid service layer', function () {
    beforeEach(function (done) {
      this.request = sinon.stub(http, 'request');
      done();
    });

    afterEach(function () {
      http.request.restore();
    });

    it('should create the right payload object when generatePayload service is called with a raw DNAPCR Client Payload', function (done) {
      var options = {
        params: {
          lab: 'ampath'
        },
        query: {},
        payload: mockData.getDnaPcrMockPayload()
      };
      var payload = {};

      eidService.generatePayload(
        options.payload,
        function (res) {
          payload = res;
          done();
        },
        function (res) {
          console.log('An error occurred:', res);
          done();
        }
      );

      //check to ensure location has been resolved
      expect(payload.mflCode).to.equal('15204');
      //check to ensure infantProphylaxis: has been resolved
      expect(payload.infantProphylaxis).to.equal(5);
      //check to ensure pmtctIntervention: has been resolved
      expect(payload.pmtctIntervention).to.equal(5);
      //check to ensure feedingType: has been resolved
      expect(payload.feedingType).to.equal(0);
      //check to ensure entryPoint:: has been resolved
      expect(payload.entryPoint).to.equal(2);
      //check to ensure entryPoint:: has been resolved
      expect(payload.motherHivStatus).to.equal(2);
    });
  });
});
