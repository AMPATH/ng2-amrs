(function () {
  'use strict';
  var chai = require('chai');
  var chaiAsPromised = require('chai-as-promised');
  var nock = require('nock');
  var testRestUrl = 'http://testingurl:8080/openmrs';
  var patientService = require('../../../service/openmrs-rest/patient.service.js');

  // Some setup
  var expect = chai.expect;
  chai.use(chaiAsPromised);

  describe('Open MRS Patient Service Unit Tests', function () {
    beforeEach(function () {
      nock.disableNetConnect();
    });

    afterEach(function () {
      nock.cleanAll();
      nock.enableNetConnect();
    });

    var dummyResponse = {
      results: [
        {
          uuid: 'uuid 1',
          display: 'Test Patient One'
        }
      ]
    };

    it('Should have encounter service defined', function () {
      expect(patientService).to.exists;
    });

    it(
      'getPatientUuidByUuid should make a call to retrieve a' +
        'patient by uuid',
      function (done) {
        var uuid = 'some-patient-uuid';
        var params = {
          rep: 'ref',
          openmrsBaseUrl: testRestUrl
        };

        var dummyRes = {
          uuid: 'some-patient-uuid'
        };

        var request = nock(testRestUrl)
          .get('/ws/rest/v1/patient/' + uuid)
          .query({ v: params.rep })
          .reply(200, dummyRes);

        var promise = patientService.getPatientByUuid(uuid, params);

        promise.then(function (response) {
          expect(response).to.deep.equal(dummyRes);
          done();
        });
      }
    );

    it('getPatientUuidByUuid should respond with an error incase of error ', function (done) {
      var uuid = 'some-patient-uuid2';
      var params = {
        rep: 'ref',
        openmrsBaseUrl: testRestUrl
      };

      var request = nock(testRestUrl)
        .get('/ws/rest/v1/patient/' + uuid)
        .query({ v: params.rep })
        .replyWithError({
          message: 'timed out',
          code: 500
        });

      var promise = patientService.getPatientByUuid(uuid, params);

      promise
        .then(function (response) {
          expect(true).to.be.false;
          done();
        })
        .catch(function (error) {
          expect(error.error.message).to.equal('timed out');
          done();
        });
    });

    it(
      'getPatientUuidByIdentifier should make a call to retrieve a list of ' +
        'patients by identifier',
      function (done) {
        var params = {
          q: 'patient-id',
          rep: 'ref',
          openmrsBaseUrl: testRestUrl
        };
        var request = nock(testRestUrl)
          .get('/ws/rest/v1/patient')
          .query({ q: params.q, v: params.rep })
          .reply(200, dummyResponse);

        var promise = patientService.getPatientByIdentifier(params);

        promise.then(function (response) {
          expect(response).to.deep.equal(dummyResponse.results);
          done();
        });
      }
    );

    it('getPatientUuidByIdentifier should respond with an error incase of error ', function (done) {
      var params = {
        q: 'patient-id2',
        rep: 'ref',
        openmrsBaseUrl: testRestUrl
      };
      var request = nock(testRestUrl)
        .get('/ws/rest/v1/patient')
        .query({ q: params.q, v: params.rep })
        .replyWithError({
          message: 'timed out',
          code: 500
        });

      var promise = patientService.getPatientByIdentifier(params);

      promise
        .then(function (response) {
          expect(true).to.be.false;
          done();
        })
        .catch(function (error) {
          expect(error.error.message).to.equal('timed out');
          done();
        });
    });

    it('should fetch patient uuids by patient ids', function (done) {
      var params = {
        q: 'id 1',
        rep: 'default',
        openmrsBaseUrl: testRestUrl
      };
      var request = nock(testRestUrl)
        .get('/ws/rest/v1/patient')
        .query({ q: params.q, v: params.rep })
        .reply(200, {
          results: [
            {
              uuid: 'uuid 1',
              display: 'Test Patient 1'
            }
          ]
        });

      var params2 = {
        q: 'id 2',
        rep: 'default',
        openmrsBaseUrl: testRestUrl
      };

      var request2 = nock(testRestUrl)
        .get('/ws/rest/v1/patient')
        .query({ q: params2.q, v: params2.rep })
        .reply(200, {
          results: [
            {
              uuid: 'uuid 2',
              display: 'Test Patient 2'
            }
          ]
        });

      var params3 = {
        q: 'id 3',
        rep: 'ref',
        openmrsBaseUrl: testRestUrl
      };

      var request2 = nock(testRestUrl)
        .get('/ws/rest/v1/patient')
        .query({ q: params3.q, v: params3.rep })
        .replyWithError({
          message: 'timed out',
          code: 500
        });

      var promise = patientService.getPatientUuidsByIdentifiers(
        ['id 1', 'id 2', 'id 3'],
        testRestUrl
      );

      promise
        .then(function (response) {
          expect(response).to.deep.equal([
            {
              identifier: 'id 1',
              patientUuid: 'uuid 1'
            },
            {
              identifier: 'id 2',
              patientUuid: 'uuid 2'
            },
            {
              identifier: 'id 3',
              hasError: true
            }
          ]);
          done();
        })
        .catch(function (error) {
          expect(true).to.be.false;
          done();
        });
    });
  });
})();
