'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var nock = require('nock');
var testRestUrl = 'http://testingurl:8080/openmrs';
var programService = require('../../../service/openmrs-rest/program.service');

// Some setup
var expect = chai.expect;
chai.use(chaiAsPromised);

describe('Open MRS Program Service Unit Tests', function () {
  beforeEach(function () {
    nock.disableNetConnect();
  });

  afterEach(function () {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should have patient service defined', function () {
    expect(programService).to.exists;
  });

  it(
    'should have getProgramEnrollmentByUuid make a call to retrieve a' +
      'patient program enrollment by uuid',
    function (done) {
      var uuid = 'some-program-uuid';
      var params = {
        rep: 'ref',
        openmrsBaseUrl: testRestUrl
      };

      var dummyRes = {
        uuid: 'some-program-uuid'
      };

      var request = nock(testRestUrl)
        .get('/ws/rest/v1/programenrollment/' + uuid)
        .query({ v: params.rep })
        .reply(200, dummyRes);

      var promise = programService.getProgramEnrollmentByUuid(uuid, params);

      promise.then(function (response) {
        expect(response).to.deep.equal(dummyRes);
        done();
      });
    }
  );

  it(
    'should have getProgramEnrollmentByUuid return an error when call to retrieve a' +
      'patient program enrollment by uuid fails',
    function (done) {
      var uuid = 'some-program-uuid';
      var params = {
        rep: 'ref',
        openmrsBaseUrl: testRestUrl
      };

      var dummyRes = {
        uuid: 'some-program-uuid'
      };

      var request = nock(testRestUrl)
        .get('/ws/rest/v1/programenrollment/' + uuid)
        .query({ v: params.rep })
        .replyWithError({
          message: 'timed out',
          code: 500
        });

      var promise = programService.getProgramEnrollmentByUuid(uuid, params);

      promise
        .then(function (response) {
          expect(true).to.be.false;
          done();
        })
        .catch(function (error) {
          expect(error.error.message).to.equal('timed out');
          done();
        });
    }
  );
});
