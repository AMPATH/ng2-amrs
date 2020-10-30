(function () {
  'use strict';
  var chai = require('chai');
  var chaiAsPromised = require('chai-as-promised');
  var sinon = require('sinon'); // for creating spies, mocks and stubs
  var sinonChai = require('sinon-chai'); // expection engine for sinion
  var nock = require('nock');
  var testRestUrl = 'http://testingurl:8080/openmrs';
  var eidService = require('../../service/eid.service.js');
  var patientService = require('../../service/openmrs-rest/patient.service.js');
  var _ = require('underscore');

  // Some setup
  var expect = chai.expect;
  chai.use(sinonChai);

  describe('EID Service Unit Tests', function () {
    var getResourceStub, getCd4ResourceStub;
    var fakeResource = {
      uri: 'http://eid.ampath.or.ke:56/order',
      query: {
        apikey: 'XXX'
      }
    };

    beforeEach(function () {
      nock.disableNetConnect();

      getResourceStub = sinon
        .stub(eidService, 'getResource')
        .returns(function (host, apiKey) {
          return fakeResource;
        });

      getCd4ResourceStub = sinon
        .stub(eidService, 'getCd4Resource')
        .returns(function (host, apiKey) {
          return fakeResource;
        });
    });

    afterEach(function () {
      nock.cleanAll();
      nock.enableNetConnect();
      getResourceStub.restore();
      getCd4ResourceStub.restore();
    });

    var dummyResponse = {
      posts: [
        {
          PatientID: 'id 1',
          SampleStatus: 'Complete'
        },
        {
          PatientID: 'id 2',
          SampleStatus: 'Complete'
        },
        {
          PatientID: 'id 3',
          SampleStatus: 'in progress'
        },
        {
          PatientID: 'id 4',
          SampleStatus: 'Complete'
        }
      ]
    };

    var dummyResponse2 = {
      posts: [
        {
          PatientID: 'id 5',
          SampleStatus: 'Complete'
        },
        {
          PatientID: 'id 6',
          SampleStatus: 'Complete'
        },
        {
          PatientID: 'id 7',
          SampleStatus: 'in progress'
        },
        {
          PatientID: 'id 8',
          SampleStatus: 'Complete'
        }
      ]
    };

    it('should have service defined', function () {
      expect(eidService).to.exists;
    });

    it('should set-up stubs for resource getters', function () {
      // var promise = eidService.getViralLoadTestResultsByPatientIdentifier(
      //     'id 1', 'some host', 'some api key'
      // );
      // promise.catch(function (error) { /*do nothing, meant to hide errors*/ });
      // var promise2 = eidService.getCd4TestResultsByPatientIdentifier(
      //     'id 1', 'some host', 'some api key'
      // );
      // promise2.catch(function (error) { /*do nothing, meant to hide errors*/ });
      // expect(getResourceStub.calledWithExactly('some host', 'some api key')).to.be.true;
      // expect(getCd4ResourceStub.calledWithExactly('some host', 'some api key')).to.be.true;
    });

    it('should fetch EID viral load results by date range and paging details', function (done) {
      var mockedRequest = nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 2, // viral load is always test 2
          page: 1,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        });
      mockedRequest.reply(200, dummyResponse);

      var promise = eidService.getEidViralLoadResults(
        'host',
        'key',
        '2004-01-01',
        '2004-01-05',
        1
      );

      promise
        .then(function (response) {
          expect(getResourceStub.calledWithExactly('host', 'key')).to.be.true;
          expect(response).to.deep.equal(dummyResponse);
          done();
        })
        .catch(function (error) {
          console.error('getEidViralLoadResults error', error);
          expect(true).to.be.false; // we don't expect error
          done();
        });
      done();
    });

    it('should fetch EID DNA PCR results by date range and paging details', function (done) {
      var mockedRequest = nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 1, // dna pcr is always test 1
          page: 1,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse);

      var promise = eidService.getEidDnaPcrResults(
        'host',
        'key',
        '2004-01-01',
        '2004-01-05',
        1
      );

      promise
        .then(function (response) {
          expect(getResourceStub.calledWithExactly('host', 'key')).to.be.true;
          expect(response).to.deep.equal(dummyResponse);
          done();
        })
        .catch(function (error) {
          console.error('getEidDnaPcrResults error', error);
          expect(true).to.be.false; // we don't expect error
          done();
        });
      done();
    });

    it('should fetch EID CD4 results by date range and paging details', function (done) {
      var mockedRequest = nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          page: 1,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse);

      var promise = eidService.getEidCD4Results(
        'host',
        'key',
        '2004-01-01',
        '2004-01-05',
        1
      );

      promise
        .then(function (response) {
          expect(
            getCd4ResourceStub.calledWithExactly('host', 'key')
          ).to.be.true;
          expect(response).to.deep.equal(dummyResponse);
          done();
        })
        .catch(function (error) {
          console.error('getEidCD4Results error', error);
          expect(true).to.be.false; // we don't expect error
          done();
        });
      done();
    });

    it('should fetch all EID results to the last page per type and date range', function (done) {
      // set up mocks for viral load
      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 2, // viral load is always test 2
          page: 1,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 2, // viral load is always test 2
          page: 2,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse2);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 2, // viral load is always test 2
          page: 3,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, {
          posts: []
        });

      var promise = eidService.getAllEidResultsByType(
        'host',
        'key',
        '2004-01-01',
        '2004-01-05',
        eidService.getEidViralLoadResults
      );

      promise
        .then(function (results) {
          expect(results.posts.length).to.equal(8);
          expect(results.posts[0]).to.deep.equal(dummyResponse.posts[0]);
          expect(results.posts[4]).to.deep.equal(dummyResponse2.posts[0]);
          done();
        })
        .catch(function (error) {
          console.error(error);
          expect(true).to.be.false; // error not expected with the test case
          done();
        });
      done();
    });

    it('should fetch patient identifiers with results by lab type', function (done) {
      // stub a list of all available labs
      var resultsByTypeStub = sinon
        .stub(eidService, 'getAllEidResultsByType')
        .returns(function (host, apikey, startDate, endDate, fetchingFunc) {
          return new Promise(function (resolve, reject) {
            resolve(dummyResponse);
          });
        });

      eidService
        .getPatientIdentifiersWithEidResultsByType(
          'host',
          'key',
          '2017-01-01',
          '2017-01-31',
          eidService.getEidViralLoadResults
        )
        .then(function (response) {
          expect(response).to.deep.equal({
            patientIdentifiers: ['id 1', 'id 2', 'id 4']
          });
          resultsByTypeStub.restore();
          done();
        })
        .catch(function (error) {
          console.error('unexpected error', error);
          expect(true).to.be.false;
          resultsByTypeStub.restore();
          done();
        });
      done();
      resultsByTypeStub.restore();
    });

    it('should return error when fetching patient identifiers with results by lab type fails', function (done) {
      // stub a list of all available labs
      var resultsByTypeStub = sinon
        .stub(eidService, 'getAllEidResultsByType')
        .returns(function (host, apikey, startDate, endDate, fetchingFunc) {
          return new Promise(function (resolve, reject) {
            reject('unknown error');
          });
        });

      eidService
        .getPatientIdentifiersWithEidResultsByType(
          'host',
          'key',
          '2017-01-01',
          '2017-01-31',
          eidService.getEidViralLoadResults
        )
        .then(function (response) {
          expect(true).to.be.false; // we don't expect error at this point
          resultsByTypeStub.restore();
          done();
        })
        .catch(function (error) {
          expect(error).to.deep.equal({
            patientIdentifiers: [],
            host: 'host',
            error: 'unknown error'
          });
          resultsByTypeStub.restore();
          done();
        });
      done();
    });

    it('should fetch all EID lab results by date range', function (done) {
      // set up mocks for viral load
      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 2, // viral load is always test 2
          page: 1,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 2, // viral load is always test 2
          page: 2,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse2);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 2, // viral load is always test 2
          page: 3,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, {
          posts: []
        });

      // set up mocks for DNA PCR
      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 1,
          page: 1,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 1,
          page: 2,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse2);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          test: 1,
          page: 3,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, {
          posts: []
        });

      // set up mocks for CD4
      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          page: 1,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          page: 2,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, dummyResponse2);

      nock('http://eid.ampath.or.ke:56')
        .get('/order') // the entire URI always comes from some config file
        .query({
          apikey: fakeResource.query.apikey,
          page: 3,
          startDate: '2004-01-01',
          endDate: '2004-01-05'
        })
        .reply(200, {
          posts: []
        });

      var promise = eidService.getAllEidResults(
        {
          host: 'host',
          generalApiKey: 'key',
          cd4ApiKey: 'key'
        },
        '2004-01-01',
        '2004-01-05'
      );

      promise
        .then(function (results) {
          expect(results.viralLoad.posts.length).to.equal(8);
          expect(results.viralLoad.posts[0]).to.deep.equal(
            dummyResponse.posts[0]
          );
          expect(results.viralLoad.posts[4]).to.deep.equal(
            dummyResponse2.posts[0]
          );

          expect(results.cd4.posts.length).to.equal(8);
          expect(results.cd4.posts[0]).to.deep.equal(dummyResponse.posts[0]);
          expect(results.cd4.posts[4]).to.deep.equal(dummyResponse2.posts[0]);

          expect(results.dnaPcr.posts.length).to.equal(8);
          expect(results.dnaPcr.posts[0]).to.deep.equal(dummyResponse.posts[0]);
          expect(results.dnaPcr.posts[4]).to.deep.equal(
            dummyResponse2.posts[0]
          );

          done();
        })
        .catch(function (error) {
          console.error(error);
          expect(true).to.be.false; // error not expected with the test case
          done();
        });
      done();
    });

    it('should fetch all EID results from all labs for a given date range', function (done) {
      // stub a list of all available labs
      var locationStub = sinon
        .stub(eidService, 'getAvailableLabServers')
        .returns(function (filterLocations) {
          return new Promise(function (resolve, reject) {
            resolve([
              {
                name: 'ampath',
                host: 'http://blah.ampath.or.ke',
                generalApiKey: 'xx1',
                cd4ApiKey: 'xx2',
                loadCd4: true
              },
              {
                name: 'alupe',
                host: 'http://10.50.80.1',
                generalApiKey: 'xx3',
                cd4ApiKey: 'xx4',
                loadCd4: true
              }
            ]);
          });
        });

      var allResultsStub = sinon
        .stub(eidService, 'getAllEidResults')
        .returns(function (server, startDate, endDate) {
          return new Promise(function (resolve, reject) {
            if (server.host === 'http://blah.ampath.or.ke') {
              resolve({
                viralLoad: {
                  posts: dummyResponse.posts
                },
                cd4: {
                  posts: []
                },
                dnaPcr: {
                  posts: dummyResponse2.posts
                }
              });
            } else {
              resolve({
                viralLoad: {
                  posts: []
                },
                cd4: {
                  posts: dummyResponse.posts
                },
                dnaPcr: {
                  posts: []
                }
              });
            }
          });
        });

      var promise = eidService.getAllEidResultsFromAllSites(
        '01-01-2017',
        '01-04-2017'
      );

      promise
        .then(function (results) {
          expect(results).to.deep.equal([
            {
              viralLoad: {
                posts: dummyResponse.posts
              },
              cd4: {
                posts: []
              },
              dnaPcr: {
                posts: dummyResponse2.posts
              },
              lab: 'ampath'
            },
            {
              viralLoad: {
                posts: []
              },
              cd4: {
                posts: dummyResponse.posts
              },
              dnaPcr: {
                posts: []
              },
              lab: 'alupe'
            }
          ]);
          done();
          locationStub.restore();
          allResultsStub.restore();
        })
        .catch(function (error) {
          // didn't expect an error at this point
          console.error(error);
          expect(true).to.be.false;
          done();
          locationStub.restore();
          allResultsStub.restore();
        });
      done();
    });

    it('should fetch patient uuids with EID results for a given time period', function (done) {
      var labResultsStub = sinon
        .stub(eidService, 'getAllEidResultsFromAllSites')
        .returns(function (startDate, endDate) {
          return new Promise(function (resolve, reject) {
            if (startDate === '01-01-2017' && endDate === '01-04-2017') {
              resolve([
                {
                  viralLoad: {
                    posts: dummyResponse.posts
                  },
                  cd4: {
                    posts: []
                  },
                  dnaPcr: {
                    posts: dummyResponse2.posts
                  },
                  lab: 'ampath'
                },
                {
                  viralLoad: {
                    posts: []
                  },
                  cd4: {
                    posts: dummyResponse.posts
                  },
                  dnaPcr: {
                    posts: []
                  },
                  lab: 'alupe'
                }
              ]);
            } else {
              reject('Unexpected date params');
            }
          });
        });

      var patientServiceStub = sinon
        .stub(patientService, 'getPatientUuidsByIdentifiers')
        .returns(function (patientIds) {
          return new Promise(function (resolve, reject) {
            function allArraysAlike(arrays) {
              return _.all(arrays, function (array) {
                return (
                  array.length == arrays[0].length &&
                  _.difference(array, arrays[0]).length == 0
                );
              });
            }

            if (
              _(patientIds).isEqual([
                'id 1',
                'id 2',
                'id 4',
                'id 5',
                'id 6',
                'id 8'
              ])
            ) {
              resolve([
                {
                  identifier: 'id 1',
                  patientUuid: 'uuid 1'
                },
                {
                  identifier: 'id 2',
                  patientUuid: 'uuid 2'
                },
                {
                  identifier: 'id 4',
                  hasError: true
                },
                {
                  identifier: 'id 5',
                  patientUuid: 'uuid 5'
                },
                {
                  identifier: 'id 6',
                  patientUuid: 'uuid 6'
                },
                {
                  identifier: 'id 8',
                  patientUuid: 'uuid 8'
                }
              ]);
            } else {
              reject('Unexpected patient identifier list');
            }
          });
        });

      var promise = eidService.getPatientsWithEidResults(
        '01-01-2017',
        '01-04-2017'
      );

      promise
        .then(function (results) {
          expect(results).to.deep.equal([
            'uuid 1',
            'uuid 2',
            'uuid 5',
            'uuid 6',
            'uuid 8'
          ]);
          done();
          labResultsStub.restore();
          patientServiceStub.restore();
        })
        .catch(function (error) {
          // didn't expect an error at this point
          console.error(error);
          expect(true).to.be.false;
          done();
          labResultsStub.restore();
          patientServiceStub.restore();
        });
      done();
    });
  });
})();
