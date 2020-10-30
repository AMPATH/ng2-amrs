var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
//var nock = require('nock');
//var _ = require('underscore');
//var Hapi = require('hapi');
//var fakeServer = require('../sinon-server-1.17.3');
var dao = require('../../../dao/patient/etl-patient-hiv-summary-dao');
var db = require('../../../etl-db');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('ETL PATIENT HIV SUMMARY DAO:', function () {
  beforeEach(function (done) {
    done();
  });

  afterEach(function () {});

  it('should load dao', function () {
    expect(dao).to.be.defined;
    expect(db).to.be.defined;
  });

  it('should fetch hiv summary records for a patient by patient uuid', function (done) {
    // params: patientUuid, clinicalOnly, startIndex, limit, params object
    //params object include sortOrder,
    // should return a promise
    var expectedQueryObj = {
      columns: '*',
      table: 'etl.flat_hiv_summary',
      where: ['uuid = ? AND is_clinical_encounter = true', 'patient uuid'],
      order: [
        {
          column: 'encounter_datetime',
          asc: false
        }
      ],
      offset: 0,
      limit: 100
    };

    var mockOutput = {
      result: [],
      size: 0,
      sql:
        'SELECT * FROM etl.flat_hiv_summary `t1` WHERE (uuid = ?) ORDER BY encounter_datetime DESC LIMIT 100',
      sqlParams: ['patient uuid'],
      startIndex: '0'
    };
    var stub = sinon.stub(db, 'queryDb', function (queryObject) {
      expect(queryObject).to.deep.equal(expectedQueryObj);
      return new Promise(function (success, error) {
        success(mockOutput);
      });
    });

    dao
      .getPatientHivSummary('patient uuid', true, {}, 0, 100)
      .then(function (results) {
        expect(results).to.deep.equal(mockOutput);
        done();
        stub.restore();
      })
      .catch(function (error) {
        stub.restore();
        expect(true).to.be.false;
        done();
      });
  });
});
