var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var Promise = require('bluebird');
//var nock = require('nock');
//var _ = require('underscore');
//var Hapi = require('hapi');
//var fakeServer = require('../sinon-server-1.17.3');
var dataResolver = require('../../programs/patient-data-resolver.service');
var patientService = require('../../service/openmrs-rest/patient.service.js');
var programService = require('../../service/openmrs-rest/program.service');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('PROGRAM DATA RESOLVER SERVICE:', function () {
  beforeEach(function (done) {
    done();
  });

  afterEach(function () {});

  it('should load program data resolver service', function () {
    expect(dataResolver).to.be.defined;
    expect(patientService).to.be.defined;
  });

  it('should use the patient service correctly to fetch a patient', function (done) {
    var patientUuid = 'some uuid';
    var stub = sinon
      .stub(patientService, 'getPatientByUuid')
      .returns(function (patientUuid, params) {
        expect(patientUuid).to.equal(patientUuid);
        expect(params).to.deep.equal({
          rep: 'full'
        }); //fetch default patient object
        var promise = new Promise(function (resolve, reject) {
          resolve({
            uuid: 'some uuid'
          });
        });
        return promise;
      });

    dataResolver
      .getPatient(patientUuid)
      .then(function (data) {
        expect(data).to.deep.equal({
          uuid: 'some uuid'
        });
        done();
        stub.restore();
      })
      .catch(function (error) {
        stub.restore();
        expect(true).to.be.false;
        done();
      });
    done();
  });

  it('should use the program service correctly to fetch an enrollment', function (done) {
    var enrollmentUuid = 'some uuid';
    var patientUuid = 'some patient uuid';
    var param = {
      programEnrollmentUuid: enrollmentUuid
    };

    var stub = sinon
      .stub(programService, 'getProgramEnrollmentByUuid')
      .returns(function (uuid, params) {
        expect(enrollmentUuid).to.equal(uuid);
        expect(params).to.deep.equal({
          rep:
            'custom:(uuid,display,voided,dateEnrolled,dateCompleted,location,' +
            'program:(uuid),states:(uuid,startDate,endDate,state:(uuid,initial,terminal,' +
            'concept:(uuid,display))))'
        }); //fetch default patient object
        var promise = new Promise(function (resolve, reject) {
          resolve({
            uuid: 'some uuid'
          });
        });
        return promise;
      });

    dataResolver
      .getProgramEnrollment(patientUuid, param)
      .then(function (data) {
        expect(data).to.deep.equal({
          uuid: 'some uuid'
        });
        done();
        stub.restore();
      })
      .catch(function (error) {
        stub.restore();
        expect(true).to.be.false;
        done();
      });
    done();
  });

  it('should fetch all the required patient data dependencies', function (done) {
    var samplePatient = {
      uuid: 'patient-uuid',
      person: {
        age: 10
      }
    };

    var sampleEnrollment = {
      uuid: 'enrollment uuid'
    };
    var patientUuid = 'some uuid';
    var keys = ['patient', 'dummyPatient', 'enrollment'];
    var stub = sinon
      .stub(patientService, 'getPatientByUuid')
      .returns(function (patientUuid, params) {
        return new Promise(function (success, error) {
          success(samplePatient);
        });
      });

    var enrollmentStub = sinon
      .stub(programService, 'getProgramEnrollmentByUuid')
      .returns(function (patientUuid, params) {
        return new Promise(function (success, error) {
          success(sampleEnrollment);
        });
      });

    var params = {
      programEnrollmentUuid: 'enrollment uuid'
    };

    dataResolver
      .getAllDataDependencies(keys, patientUuid, params)
      .then(function (dataObject) {
        expect(dataObject).to.deep.equal({
          patient: samplePatient,
          dummyPatient: samplePatient,
          enrollment: sampleEnrollment
        });
        done();
        stub.restore();
        enrollmentStub.restore();
      })
      .catch(function (error) {
        console.error('error:', error);
        expect('not expecting an error using test case').to.be.true;
        stub.restore();
        enrollmentStub.restore();
      });
    done();
  });
});
