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

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

chai.use(sinonChai);

describe('CLINIC LEVEL ETL-SERVER TESTS', function () {
  describe('Testing etl-dao layer', function () {
    // example showing how to use a stub to fake a method
    var stub;
    beforeEach(function (done) {
      stub = sinon.stub(db, 'queryServer_test');

      // .yieldsTo(1, null, { result:mockData.getPatientMockData() });
      done();
    });

    afterEach(function () {
      stub.restore();
    });

    //
    it('should create the right query parts object when getClinicHivSummayIndicators is called', function (done) {
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

      dao.getClinicHivSummayIndicators(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.hiv_summary_indicators');
      // if fields is null output all columns
      expect(queryParts.columns).to.equal('*');

      expect(queryParts.where).to.include(options.params.uuid);
    });

    it('should create the right fields property when getClinicHivSummayIndicators is called', function (done) {
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

      dao.getClinicHivSummayIndicators(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('array');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    it('should create the right query parts object when getClinicDefaulterList is called', function (done) {
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

      dao.getClinicDefaulterList(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_defaulters');
      // if fields is null output all columns
      console.log('Log', JSON.stringify(queryParts.columns));
      expect(queryParts.columns[0]).to.equal('*');
      expect(queryParts.columns[1]).to.equal(
        'extract(year from (from_days(datediff(now(),t3.birthdate)))) as age'
      );
      expect(queryParts.where).to.include(options.params.uuid);
    });

    it('should create the right fields property when getClinicDefaulterList is called', function (done) {
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

      dao.getClinicDefaulterList(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('array');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    it('should create the right query parts object when getHasNotReturned is called', function (done) {
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
          joins: [['a'], ['b'], ['c']]
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getHasNotReturned(options, function (res) {
        //   console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      // if fields is null output default given columns
      expect(queryParts.columns).to.equal(
        't1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers'
      );
      expect(queryParts.where).to.include(
        't1.location_uuid = ? and date(t1.rtc_date) between ? and ? and next_clinical_datetime_hiv is null'
      );
      expect(queryParts.joins).to.be.an('array');
      //expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.person_name');
      // expect(queryParts.joins).to.have.deep.property('[0][1]', 't3');

      expect(queryParts.group).to.be.an('array');
      expect(queryParts.group).to.include('person_id');
      assert.equal(queryParts.group.length, 1);
    });

    it('should create the right fields property when getHasNotReturned is called', function (done) {
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

      dao.getHasNotReturned(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('array');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    it('should create the right query parts object when getClinicMonthlyAppointmentSchedule is called', function (done) {
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
          group: []
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getClinicMonthlyAppointmentSchedule(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      expect(queryParts.where).to.include(options.params.uuid);
      expect(queryParts.group).to.be.an('array');

      expect(queryParts.group).to.include('rtc_date');
      assert.equal(queryParts.group.length, 1);
    });

    it('should create the right fields property when getClinicMonthlyAppointmentSchedule is called', function (done) {
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
          limit: null,
          group: []
        }
      };

      dao.getClinicMonthlyAppointmentSchedule(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });
    it('should create the right query parts object when getClinicMonthlyVisits is called', function (done) {
      // stub.callsArgWithAsync(1, null, { result:mockData.getPatientMockData() });
      stub.yields({
        startIndex: 0,
        size: 1,
        result: mockData.getPatientMockData()
      });
      var options = {
        params: {
          uuid: '123',
          startDate: '2015-08-03T21:00:00.000Z'
        },
        query: {
          order: null,
          fields: null,
          startIndex: null,
          limit: null,
          group: []
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getClinicMonthlyVisits(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      expect(queryParts.where).to.include(
        options.params.uuid,
        options.params.startDate
      );
    });

    it('should create the right fields property when getClinicMonthlyVisits is called', function (done) {
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
          limit: null,
          group: []
        }
      };

      dao.getClinicMonthlyVisits(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('array');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
      expect(queryParts.group).to.be.an('array');
      expect(queryParts.group).to.include('encounter_datetime');
      assert.equal(queryParts.group.length, 1);
    });

    it('should create the right query parts object when getClinicEncounterData is called', function (done) {
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
          group: []
        }
      };

      // stub.withArgsWithAsync(options).yieldsTo(mockData.getPatientMockData());

      dao.getClinicEncounterData(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      expect(queryParts.where).to.include(options.params.uuid);
      // if fields is null output all columns
      expect(queryParts.columns).to.equal(
        't1.*,t2.gender,round(datediff(t1.encounter_datetime,t2.birthdate)/365) as age,group_concat(identifier) as identifiers'
      );
      expect(queryParts.joins).to.be.an('array');
      expect(queryParts.joins).to.have.deep.property('[0][0]', 'amrs.person');
      expect(queryParts.joins).to.have.deep.property('[0][1]', 't2');
      expect(queryParts.joins).to.have.deep.property(
        '[0][2]',
        't1.person_id = t2.person_id'
      );
      expect(queryParts.joins).to.have.deep.property(
        '[1][0]',
        'amrs.patient_identifier'
      );
      expect(queryParts.joins).to.have.deep.property('[1][1]', 't3');
    });

    it('should create the right fields property when getClinicEncounterData is called', function (done) {
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
          limit: null,
          joins: [
            ['a', 't2'],
            ['c', 'd']
          ],
          group: []
        }
      };

      dao.getClinicEncounterData(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
      expect(queryParts.group).to.be.an('array');
      expect(queryParts.group).to.include('encounter_id');
      expect(queryParts.group).to.include('person_id');
      assert.equal(queryParts.group.length, 2);
    });

    it('should create the right query parts object when  getClinicAppointmentSchedule is called', function (done) {
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

      dao.getClinicAppointmentSchedule(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      expect(queryParts.where).to.include(options.params.uuid);
      // if fields is null output all columns
      expect(queryParts.columns).to.equal(
        't1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers'
      );
      expect(queryParts.joins).to.be.an('array');
      expect(queryParts.joins).to.have.deep.property(
        '[0][0]',
        'amrs.person_name'
      );
      expect(queryParts.joins).to.have.deep.property('[0][1]', 't3');

      expect(queryParts.group).to.be.an('array');
      expect(queryParts.group).to.include('person_id');
      assert.equal(queryParts.group.length, 1);
    });

    it('should create the right fields property when getClinicAppointmentSchedule is called', function (done) {
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

      dao.getClinicAppointmentSchedule(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });

    it('should create the right query parts object when  getClinicDailyVisits is called', function (done) {
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

      dao.getClinicDailyVisits(options, function (res) {
        // console.log('body2  ++', res);
        done();
      });

      // console.log('body2  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];
      expect(queryParts.table).to.equal('etl.flat_hiv_summary');
      expect(queryParts.where).to.include(options.params.uuid);
      // if fields is null output all columns
      expect(queryParts.columns).to.equal(
        't1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers'
      );
      expect(queryParts.joins).to.be.an('array');
      expect(queryParts.joins).to.have.deep.property(
        '[0][0]',
        'amrs.person_name'
      );
      expect(queryParts.joins).to.have.deep.property('[0][1]', 't3');

      expect(queryParts.group).to.be.an('array');
      expect(queryParts.group).to.include('person_id');
      assert.equal(queryParts.group.length, 1);
    });

    it('should create the right fields property when getClinicDailyVisits is called', function (done) {
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

      dao.getClinicDailyVisits(options, function (res) {
        done();
      });

      // console.log('bodyxx  ++', stub.args[0][0]);
      var queryParts = stub.args[0][0];

      expect(queryParts.columns).to.be.an('string');
      expect(queryParts.columns).to.include('a');
      expect(queryParts.columns).to.include('b');
      expect(queryParts.columns).to.include('c');
    });
  });
});
