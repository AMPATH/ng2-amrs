(function () {
  'use strict';
  var chai = require('chai');
  var chaiAsPromised = require('chai-as-promised');
  var nock = require('nock');
  var testRestUrl = 'http://testingurl:8080/openmrs';
  var encounterService = require('../../../service/openmrs-rest/encounter.js');

  // Some setup
  var expect = chai.expect;
  chai.use(chaiAsPromised);

  describe('Open MRS Encounter Service Unit Tests', function () {
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
          uuid: 'encounter-uuid-for-first-element',
          display: 'ADULTRETURN 01/02/2006'
        },
        {
          uuid: 'bf218490-1691-11df-97a5-7038c432aabf',
          display: 'ADULTRETURN 07/02/2006',
          links: [
            {
              uri:
                testRestUrl +
                '/ws/rest/v1/encounter/bf218490-1691-11df-97a5-7038c432aabf',
              rel: 'self'
            }
          ]
        }
      ]
    };

    it('Should have encounter service defined', function () {
      expect(encounterService).to.exists;
    });

    it(
      'getPatientEncounters Should make a call to retrieve a list of ' +
        'encounters for a patient',
      function () {
        var params = {
          patientUuid: 'patient-uuid',
          rep: 'ref',
          openmrsBaseUrl: testRestUrl
        };
        var request = nock(testRestUrl)
          .get('/ws/rest/v1/encounter')
          .query({ patient: params.patientUuid, v: params.rep })
          .reply(200, dummyResponse);

        var promise = encounterService.getPatientEncounters(params);

        expect(promise).to.be.resolved;
        expect(promise).to.eventually.deep.equal(dummyResponse.results);
      }
    );
  });
})();
