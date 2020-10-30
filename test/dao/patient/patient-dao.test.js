var chai = require('chai');
var routes = require('../../../etl-routes');
// var server = require('../etl-server');
var db = require('../../../etl-db');
var dao = require('../../../etl-dao');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var mockData = require('../../mock/mock-data');
// var nock = require('nock');
var _ = require('underscore');
var Hapi = require('hapi');
var fakeServer = require('../../sinon-server-1.17.3');
var PassThrough = require('stream').PassThrough;
var http = require('http');
var eidRestFormatter = require('../../../eid-rest-formatter');
var Promise = require('bluebird');
require('sinon-as-promised')(Promise);
chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

chai.use(sinonChai);

describe('PATIENT LEVEL ETL-SERVER TESTS', function () {
  describe('Testing etl-dao layer', function () {
    // example showing how to use a stub to fake a method
    var stub;
    var queryDbStub;
    beforeEach(function (done) {
      stub = sinon.stub(db, 'queryServer_test');
      queryDbStub = sinon.stub(db, 'queryDb');
      this.request = sinon.stub(http, 'request');
      // .yieldsTo(1, null, { result:mockData.getPatientMockData() });
      done();
    });

    afterEach(function () {
      http.request.restore();
      stub.restore();
      queryDbStub.restore();
    });

    it('should create the right query parts object when getPatient is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '123'
        },
        query: {
          order: null,
          fields: null,
          startIndex: null,
          limit: null
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getPatient(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      //get patient always fetched data from etl.flat_hiv_summary
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      // if fields is null output all columns
      expect(queryParts.columns).to.equal('*');

      expect(queryParts.where).to.include(options.params.uuid);
    });

    it('should create the right fields property when getPatient is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '124'
        },
        query: {
          order: null,
          fields: ['a', 'b', 'c'],
          startIndex: null,
          limit: null
        }
      };

      dao.getPatient(options, function (res) {
        // console.log('bodyxx  ++', res);
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('array');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    it('should create the right query parts object when getPatientData is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '123'
        },
        query: {
          order: null,
          fields: null,
          startIndex: null,
          limit: null
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getPatientData(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_labs_and_imaging');
      // if fields is null output all columns
      expect(queryParts.columns).to.equal('t1.*, t2.cur_arv_meds');

      expect(queryParts.where).to.include(options.params.uuid);
    });

    it('should create the right fields property when getPatientData is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '124'
        },
        query: {
          order: null,
          fields: 'a,b,c',
          startIndex: null,
          limit: null
        }
      };

      dao.getPatientData(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    it('should create the right query parts object when getPatientVitals is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      queryDbStub.resolves({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '123'
        },
        query: {
          order: null,
          fields: null,
          startIndex: null,
          limit: null
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getPatientVitals(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = queryDbStub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_vitals');
      // if fields is null output all columns
      expect(queryParts.columns).to.equal('*');

      expect(queryParts.where).to.include(options.params.uuid);
    });

    it('should create the right fields property when getPatientVitals is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      queryDbStub.resolves({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '124'
        },
        query: {
          order: null,
          fields: ['a', 'b', 'c'],
          startIndex: null,
          limit: null
        }
      };

      dao.getPatientVitals(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = queryDbStub.args[0][0];

      expect(queryParts.columns).to.be.an('array');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    it('should create the right query parts object when  getPatientCountGroupedByLocation is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '123'
        },
        query: {
          order: null,
          fields: null,
          startIndex: null,
          limit: null,
          joins: [
            ['a', 't2'],
            ['c', 'd']
          ],
          group: ['a']
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());
      dao.getPatientCountGroupedByLocation(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('amrs.patient');
      // if fields is null output all columns
      expect(queryParts.columns).to.equal(
        't3.location_id,t3.name,count( distinct t1.patient_id) as total'
      );
      expect(queryParts.joins).to.be.an('array');
      expect(queryParts.joins).to.have.deep.property(
        '[0][0]',
        'amrs.encounter'
      );
      expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
      expect(queryParts.joins).to.have.deep.property(
        '[0][2]',
        't1.patient_id = t2.patient_id'
      );
      expect(queryParts.joins).to.have.deep.property('[1][0]', 'amrs.location');
      expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');

      expect(queryParts.group).to.be.an('array');
      expect(queryParts.group).to.include('t3.uuid,t3.name');
      assert.equal(queryParts.group.length, 1);
    });

    it('should create the right fields property when getPatientCountGroupedByLocation is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '124'
        },
        query: {
          order: null,
          fields: 'a,b,c',
          startIndex: null,
          limit: null
        }
      };

      dao.getPatientCountGroupedByLocation(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include(
        't3.location_id,t3.name,count( distinct t1.patient_id) as total'
      );
    });
    it('should create the right query parts object when  getPatientDetailsGroupedByLocation is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '123'
        },
        query: {
          order: null,
          fields: null,
          startIndex: null,
          limit: null,
          joins: [
            ['a', 't2'],
            ['c', 'd']
          ],
          group: ['a']
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getPatientDetailsGroupedByLocation(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('amrs.patient');
      // if fields is null output all columns
      expect(queryParts.columns).to.equal(
        'distinct t4.uuid as patientUuid, t1.patient_id, t3.given_name, t3.middle_name, t3.family_name, t4.gender, extract(year from (from_days(datediff(now(),t4.birthdate)))) as age'
      );
      expect(queryParts.joins).to.be.an('array');
      expect(queryParts.joins).to.have.deep.property(
        '[0][0]',
        'amrs.encounter'
      );
      expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
      expect(queryParts.joins).to.have.deep.property(
        '[0][2]',
        't1.patient_id = t2.patient_id'
      );
      expect(queryParts.joins).to.have.deep.property(
        '[1][0]',
        'amrs.person_name'
      );
      expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');
    });

    it('should create the right fields property when getPatientDetailsGroupedByLocation is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '124'
        },
        query: {
          order: null,
          fields: 'a,b,c',
          startIndex: null,
          limit: null
        }
      };

      dao.getPatientDetailsGroupedByLocation(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include(
        'distinct t4.uuid as patientUuid, t1.patient_id, t3.given_name, t3.middle_name, t3.family_name'
      );
    });

    it('should ensure that convertViralLoadPayloadToRestConsumableObs receives  the right input and generates the correct payload', function (done) {
      var expectedInput = {
        PatientID: 'value',
        DateCollected: '26-May-2016',
        FinalResult: 0
      };
      var patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
      var expectedOutput = {
        concept: 'a8982474-1350-11df-a1f1-0026b9348838',
        person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
        obsDatetime: '2016-05-26T00:00:00+03:00',
        value: 0
      };
      var payload = eidRestFormatter.convertViralLoadPayloadToRestConsumableObs(
        expectedInput,
        patientUuId
      );
      payload.then(function (p) {
        expect(p).to.have.property('concept');
        expect(p).to.have.property('person');
        expect(p).to.have.property('obsDatetime');
        expect(p).to.have.property('value');
        expect(p).deep.equal(expectedOutput);
        done();
      });
    });
    it('should ensure that convertCD4PayloadTORestConsumableObs receives  the right input and generates the correct payload', function (done) {
      var expectedInput = {
        PatientID: 'value',
        DateCollected: '26-May-2016',
        AVGCD3percentLymph: 81.49,
        AVGCD3AbsCnt: 1339.69,
        AVGCD3CD4percentLymph: 26.29,
        AVGCD3CD4AbsCnt: 432.28,
        CD45AbsCnt: 1644.03
      };
      var patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
      var expectedOutput = {
        concept: 'a896cce6-1350-11df-a1f1-0026b9348838',
        person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
        obsDatetime: '2016-05-26T00:00:00+03:00',
        groupMembers: [
          {
            concept: 'a89c4220-1350-11df-a1f1-0026b9348838',
            person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
            value: 81.49,
            obsDatetime: '2016-05-26T00:00:00+03:00'
          },
          {
            concept: 'a898fcd2-1350-11df-a1f1-0026b9348838',
            person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
            value: 1339.69,
            obsDatetime: '2016-05-26T00:00:00+03:00'
          },
          {
            concept: 'a8970a26-1350-11df-a1f1-0026b9348838',
            person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
            value: 26.29,
            obsDatetime: '2016-05-26T00:00:00+03:00'
          },
          {
            concept: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
            person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
            value: 432.28,
            obsDatetime: '2016-05-26T00:00:00+03:00'
          },
          {
            concept: 'a89c4914-1350-11df-a1f1-0026b9348838',
            person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
            value: 1644.03,
            obsDatetime: '2016-05-26T00:00:00+03:00'
          }
        ]
      };
      var payload = eidRestFormatter.convertCD4PayloadTORestConsumableObs(
        expectedInput,
        patientUuId
      );
      payload.then(function (p) {
        expect(p).to.have.property('concept');
        expect(p).to.have.property('person');
        expect(p).to.have.property('obsDatetime');
        expect(p).to.have.property('groupMembers');
        expect(p.groupMembers).to.be.an('array');

        expect(p).deep.equal(expectedOutput);
        done();
      });
    });
    it('should ensure that convertDNAPCRPayloadTORestConsumableObs receives  the right input and generates the correct payload', function (done) {
      var expectedInput = {
        PatientID: 'value',
        DateCollected: '26-May-2016',
        FinalResult: 'NEGATIVE'
      };
      var patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
      var expectedOutput = {
        concept: 'a898fe80-1350-11df-a1f1-0026b9348838',
        person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
        obsDatetime: '2016-05-26T00:00:00+03:00',
        value: 'a896d2cc-1350-11df-a1f1-0026b9348838'
      };
      var payload = eidRestFormatter.convertDNAPCRPayloadTORestConsumableObs(
        expectedInput,
        patientUuId
      );
      payload.then(function (p) {
        expect(p).to.have.property('concept');
        expect(p).to.have.property('person');
        expect(p).to.have.property('obsDatetime');
        expect(p).to.have.property('value');

        expect(p).deep.equal(expectedOutput);
        done();
      });
    });
    it('should ensure that convertDNAPCRPayloadTORestConsumableObs receives  the right input and generates the correct payload', function (done) {
      var expectedInput = {
        PatientID: 'value',
        DateCollected: '26-May-2016',
        FinalResult: 'POSITIVE'
      };
      var patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
      var expectedOutput = {
        concept: 'a898fe80-1350-11df-a1f1-0026b9348838',
        person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
        obsDatetime: '2016-05-26T00:00:00+03:00',
        value: 'a896f3a6-1350-11df-a1f1-0026b9348838'
      };
      var payload = eidRestFormatter.convertDNAPCRPayloadTORestConsumableObs(
        expectedInput,
        patientUuId
      );
      payload.then(function (p) {
        expect(p).to.have.property('concept');
        expect(p).to.have.property('person');
        expect(p).to.have.property('obsDatetime');
        expect(p).to.have.property('value');

        expect(p).deep.equal(expectedOutput);
        done();
      });
    });
    it('should ensure that the convertViralLoadExceptionToRestConsumableObs function generates the right output', function (done) {
      var expectedInput = {
        LabID: '173545',
        PatientID: '2524040',
        ProviderID: '1289-8',
        MFLCode: '15204',
        AMRslocationID: '14',
        AMRslocation: 'MTRH Module 3',
        PatientNames: 'XXXXXXX',
        DateCollected: '26-May-2016',
        DateReceived: '26-May-2016',
        DateTested: '30-May-2016',
        Result: '4064 ',
        FinalResult: 'wewe tu',
        DateDispatched: '08-Jun-2016'
      };
      var patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
      var payload = eidRestFormatter.convertViralLoadExceptionToRestConsumableObs(
        expectedInput,
        patientUuId
      );
      payload.then(function (p) {
        expect(p).to.have.property('concept');
        expect(p).to.have.property('person');
        expect(p).to.have.property('obsDatetime');
        expect(p).to.have.property('groupMembers');
        expect(p.groupMembers).to.be.an('array');
        done();
      });
    });
    it('should ensure that the convertCD4ExceptionTORestConsumableObs function generates the right output', function (done) {
      var expectedInput = {
        LabID: '6304',
        PatientID: '000981160-5',
        ProviderID: '',
        MFLCode: '15753',
        AMRslocationID: '3',
        AMRslocation: 'Turbo',
        PatientNames: 'XXXXXXXXXXXXXXXXXXXXXX',
        DateCollected: '02-Jun-2016',
        DateReceived: '06-Jun-2016',
        DateTested: '06-Jun-2016',
        Result: '81.49',
        AVGCD3percentLymph: 'Not done',
        AVGCD3AbsCnt: 'Not done',
        AVGCD3CD4percentLymph: 'Not done',
        AVGCD3CD4AbsCnt: 'not done',
        CD45AbsCnt: 'not done',
        DateDispatched: ''
      };
      var patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
      var payload = eidRestFormatter.convertCD4ExceptionTORestConsumableObs(
        expectedInput,
        patientUuId
      );
      payload.then(function (p) {
        expect(p).to.have.property('concept');
        expect(p).to.have.property('person');
        expect(p).to.have.property('obsDatetime');
        expect(p).to.have.property('groupMembers');
        expect(p.groupMembers).to.be.an('array');
        done();
      });
    });
  });
});
