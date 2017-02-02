(function () {
    'use strict'
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    var sinon = require('sinon'); // for creating spies, mocks and stubs
    var sinonChai = require('sinon-chai'); // expection engine for sinion
    var nock = require('nock');
    var testRestUrl = 'http://testingurl:8080/openmrs';
    var eidService = require('../../service/eid.service.js');

    // Some setup
    var expect = chai.expect;
    chai.use(sinonChai);

    describe.only('EID Service Unit Tests', function () {
        var getResourceStub, getCd4ResourceStub;
        var fakeResource = {
            uri: 'http://eid.ampath.or.ke:56/order',
            query: {
                apikey: 'XXX'
            }
        };

        beforeEach(function () {
            nock.disableNetConnect();

            getResourceStub = sinon.stub(eidService, 'getResource',
                function (host, apiKey) {
                    return fakeResource;
                });

            getCd4ResourceStub = sinon.stub(eidService, 'getCd4Resource',
                function (host, apiKey) {
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
            'posts': [
                {
                    'PatientID': 'id 1',
                    'SampleStatus': 'Complete'
                },
                {
                    'PatientID': 'id 2',
                    'SampleStatus': 'Complete'
                },
                {
                    'PatientID': 'id 3',
                    'SampleStatus': 'in progress'
                },
                {
                    'PatientID': 'id 4',
                    'SampleStatus': 'Complete'
                }
            ]
        };

        var dummyResponse2 = {
            'posts': [
                {
                    'PatientID': 'id 5',
                    'SampleStatus': 'Complete'
                },
                {
                    'PatientID': 'id 6',
                    'SampleStatus': 'Complete'
                },
                {
                    'PatientID': 'id 7',
                    'SampleStatus': 'in progress'
                },
                {
                    'PatientID': 'id 8',
                    'SampleStatus': 'Complete'
                }
            ]
        };

        it('should have service defined', function () {
            expect(eidService).to.exists;
        });

        it('should set-up stubs for resource getters', function () {

            var promise = eidService.getViralLoadTestResultsByPatientIdentifier(
                'id 1', 'some host', 'some api key'
            );
            promise.catch(function (error) { /*do nothing, meant to hide errors*/ });

            var promise2 = eidService.getCd4TestResultsByPatientIdentifier(
                'id 1', 'some host', 'some api key'
            );
            promise2.catch(function (error) { /*do nothing, meant to hide errors*/ });

            expect(getResourceStub.calledWithExactly('some host', 'some api key')).to.be.true;
            expect(getCd4ResourceStub.calledWithExactly('some host', 'some api key')).to.be.true;

        });

        it('should fetch EID viral load results by date range and paging details',
            function (done) {
                var mockedRequest = nock('http://eid.ampath.or.ke:56')
                    .get('/order') // the entire URI always comes from some config file
                    .query({
                        apikey: fakeResource.query.apikey,
                        test: 2, // viral load is always test 2
                        page: 1,
                        startDate: '2004-01-01',
                        endDate: '2004-01-05'
                    })
                    .reply(200, dummyResponse);

                var promise =
                    eidService.getEidViralLoadResults('host', 'key', '2004-01-01', '2004-01-05', 1);

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

            });

        it('should fetch EID DNA PCR results by date range and paging details',
            function (done) {
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

                var promise =
                    eidService.getEidDnaPcrResults('host', 'key', '2004-01-01', '2004-01-05', 1);

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

            });

        it('should fetch EID CD4 results by date range and paging details',
            function (done) {
                var mockedRequest = nock('http://eid.ampath.or.ke:56')
                    .get('/order') // the entire URI always comes from some config file
                    .query({
                        apikey: fakeResource.query.apikey,
                        page: 1,
                        startDate: '2004-01-01',
                        endDate: '2004-01-05'
                    })
                    .reply(200, dummyResponse);

                var promise =
                    eidService.getEidCD4Results('host', 'key', '2004-01-01', '2004-01-05', 1);

                promise
                    .then(function (response) {
                        expect(getCd4ResourceStub.calledWithExactly('host', 'key')).to.be.true;
                        expect(response).to.deep.equal(dummyResponse);
                        done();
                    })
                    .catch(function (error) {
                        console.error('getEidCD4Results error', error);
                        expect(true).to.be.false; // we don't expect error
                        done();
                    });

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
                .reply(200, { posts: [] });

            var promise =
                eidService.getAllEidResultsByType('host', 'key', '2004-01-01', '2004-01-05', eidService.getEidViralLoadResults);

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
                .reply(200, { posts: [] });



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
                .reply(200, { posts: [] });


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
                .reply(200, { posts: [] });

            var promise =
                eidService.getAllEidResults('host', 'key', '2004-01-01', '2004-01-05');

            promise
                .then(function (results) {
                    console.error('results', results);
                    expect(results.viralLoad.posts.length).to.equal(8);
                    expect(results.viralLoad.posts[0]).to.deep.equal(dummyResponse.posts[0]);
                    expect(results.viralLoad.posts[4]).to.deep.equal(dummyResponse2.posts[0]);

                    expect(results.cd4.posts.length).to.equal(8);
                    expect(results.cd4.posts[0]).to.deep.equal(dummyResponse.posts[0]);
                    expect(results.cd4.posts[4]).to.deep.equal(dummyResponse2.posts[0]);

                    expect(results.dnaPcr.posts.length).to.equal(8);
                    expect(results.dnaPcr.posts[0]).to.deep.equal(dummyResponse.posts[0]);
                    expect(results.dnaPcr.posts[4]).to.deep.equal(dummyResponse2.posts[0]);

                    done();
                })
                .catch(function (error) {
                    console.error(error);
                    expect(true).to.be.false; // error not expected with the test case
                    done();
                });
        });

        // it('getPatientUuidByIdentifier should make a call to retrieve a list of ' +
        //     'patients by identifier', function (done) {
        //         var params = {
        //             q: 'patient-id',
        //             rep: 'ref',
        //             openmrsBaseUrl: testRestUrl
        //         };
        //         var request = nock(testRestUrl)
        //             .get('/ws/rest/v1/patient')
        //             .query({ q: params.q, v: params.rep })
        //             .reply(200, dummyResponse);

        //         var promise = patientService.getPatientByIdentifier(params);

        //         promise.then(function (response) {
        //             expect(response).to.deep.equal(dummyResponse.results);
        //             done();
        //         });

        //     });

        // it('getPatientUuidByIdentifier should respond with an error incase of error ',
        //     function (done) {
        //         var params = {
        //             q: 'patient-id2',
        //             rep: 'ref',
        //             openmrsBaseUrl: testRestUrl
        //         };
        //         var request = nock(testRestUrl)
        //             .get('/ws/rest/v1/patient')
        //             .query({ q: params.q, v: params.rep })
        //             .replyWithError(
        //             {
        //                 message: 'timed out',
        //                 code: 500
        //             }
        //             );

        //         var promise = patientService.getPatientByIdentifier(params);

        //         promise
        //             .then(function (response) {
        //                 expect(true).to.be.false;
        //                 done();
        //             })
        //             .catch(function (error) {
        //                 expect(error.error.message).to.equal('timed out');
        //                 done();
        //             });

        //     });

    });
})();
