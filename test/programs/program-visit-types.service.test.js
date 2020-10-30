var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
//var nock = require('nock');
//var _ = require('underscore');
//var Hapi = require('hapi');
//var fakeServer = require('../sinon-server-1.17.3');
var pVisitTypes = require('../../programs/program-visit-types.service');
var dataResolver = require('../../programs/patient-data-resolver.service');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('PROGRAM VISITTYPES SERVICE:', function () {
  beforeEach(function (done) {
    done();
  });

  afterEach(function () {});

  it('should load program visit types service', function () {
    expect(pVisitTypes).to.be.defined;
  });

  it('should determine whether a visit type is allowed for a given patient', function () {
    var scope = {
      enrollmentLocationUuid: 'some location uuid',
      intendedLocationOfVisitUuid: 'some location uuid'
    };

    var visitType = {
      uuid: 'some uuid',
      name: 'some visit',
      encounterTypes: [],
      allowedIf: 'enrollmentLocationUuid === intendedLocationOfVisitUuid'
    };
    var allowed = pVisitTypes.isVisitTypeAllowed(scope, visitType);
    expect(allowed).to.be.true;
  });

  it(
    'should seperate allowed visit and disallowed visit types' +
      ' for a given patient within a program ',
    function () {
      var scope = {
        enrollmentLocationUuid: 'some location uuid',
        intendedLocationOfVisitUuid: 'some location uuid'
      };

      var programsConfig = {
        visitTypes: [
          {
            uuid: 'some uuid',
            name: 'some visit',
            encounterTypes: [],
            allowedIf: 'enrollmentLocationUuid === intendedLocationOfVisitUuid'
          },
          {
            uuid: 'some uuid 2',
            name: 'some visit 2',
            encounterTypes: [],
            allowedIf: 'enrollmentLocationUuid !== intendedLocationOfVisitUuid'
          }
        ]
      };

      var expected = {
        allowed: [programsConfig.visitTypes[0]],
        disallowed: [programsConfig.visitTypes[1]]
      };

      var actual = pVisitTypes.separateAllowedDisallowedVisitTypes(
        scope,
        programsConfig.visitTypes
      );

      expect(actual).to.deep.equal(expected);
    }
  );

  it('should fetch the visit types for a given patient, program, and intended visit location', function (done) {
    // stub the data service and check it integrates well

    var patientUuid = 'some uuid';
    var programUuid = 'some program uuid';
    var programEnrollmentUuid = 'some program enrollment uuid';
    var intendedLocationUuid = 'some location uuid';

    var programConfig = {
      'some program uuid': {
        name: 'test program',
        dataDependencies: ['patient'],
        visitTypes: [
          {
            uuid: 'visit one uuid',
            name: 'Visit One',
            encounterTypes: [] // one without rules
          },
          {
            uuid: 'visit two uuid',
            name: 'Visit Two',
            encounterTypes: [], // one with rule
            allowedIf: 'age > 10',
            ruleExplanation: 'should be of age greater than 10'
          },
          {
            uuid: 'visit three uuid',
            name: 'Visit Three',
            encounterTypes: [], // one with rule
            allowedIf: 'age < 10',
            ruleExplanation: 'should be of age less than 10'
          }
        ]
      },
      'some other program config': {
        name: 'test program'
      }
    };

    // data resolver stub
    var dataResolverStub = sinon
      .stub(dataResolver, 'getAllDataDependencies')
      .returns(function (keys, patientUuid, params) {
        expect(keys).to.deep.equal(['patient']);
        expect(patientUuid).to.equal(patientUuid);
        expect(params).to.deep.equal({
          programUuid: programUuid,
          programEnrollmentUuid: programEnrollmentUuid,
          intendedVisitLocationUuid: intendedLocationUuid
        }); // fetch default patient object
        var promise = new Promise(function (resolve, reject) {
          resolve({
            patient: {
              uuid: 'some uuid',
              person: {
                age: 20
              }
            }
          });
        });
        return promise;
      });

    var expectedProgram = {
      name: 'test program',
      dataDependencies: ['patient'],
      visitTypes: {
        allowed: [
          {
            uuid: 'visit one uuid',
            name: 'Visit One',
            encounterTypes: [] // one without rules
          },
          {
            uuid: 'visit two uuid',
            name: 'Visit Two',
            encounterTypes: [], // one with rule
            allowedIf: 'age > 10',
            ruleExplanation: 'should be of age greater than 10'
          }
        ],
        disallowed: [
          {
            uuid: 'visit three uuid',
            name: 'Visit Three',
            encounterTypes: [], // one with rule but not allowed
            allowedIf: 'age < 10',
            ruleExplanation: 'should be of age less than 10'
          }
        ]
      }
    };

    pVisitTypes
      .getPatientVisitTypes(
        patientUuid,
        programUuid,
        programEnrollmentUuid,
        intendedLocationUuid,
        programConfig
      )
      .then(function (configs) {
        expect(configs).to.deep.equal(expectedProgram);
        done();
        dataResolverStub.restore();
      })
      .catch(function (err) {
        console.error('error:', err);
        expect(true).to.be.false;
        done();
      });
    done();
  });
});
