var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var patientFlowSamples = require('../mock/patient-flow-sample');
//var nock = require('nock');
//var _ = require('underscore');
//var Hapi = require('hapi');
var fakeServer = require('../sinon-server-1.17.3');
var patientFlowProcessor = require('../../report-post-processors/patient-flow-processor');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('PATIENT FLOW PROCESSOR TESTS', function () {
  beforeEach(function (done) {
    done();
  });

  afterEach(function () {});

  it('should inject patient flow samples', function () {
    expect(patientFlowSamples).to.be.defined;
  });

  it('should inject patient flow module', function () {
    expect(patientFlowProcessor).to.be.defined;
  });

  it('should group results by visit id when groupResultsByVisitId', function () {
    var unGroupedResults = patientFlowSamples.getPatientFlowSample();
    var groupedResults = patientFlowProcessor.groupResultsByVisitId(
      unGroupedResults.result
    );

    //examine results
    //CHECK 1: the sample contians only three visits
    expect(groupedResults.length).to.equal(3);

    //CHECK 2: should still be ordered
    expect(groupedResults[0].visit_id).to.equal(26727);
    expect(groupedResults[2].visit_id).to.equal(26731);

    //CHECK 3: sets time visit started correctly
    expect(groupedResults[0].registered).to.equal('2016-06-15T04:47:21.000Z');
    expect(groupedResults[2].registered).to.equal('2016-06-15T04:49:26.000Z');

    //CHECK 4: sets triage time correctly //use encounter_id 110 for triage
    expect(groupedResults[0].triaged).to.equal('2016-06-15T05:16:34.000Z');
    expect(groupedResults[2].triaged).to.equal('2016-06-15T05:16:34.000Z');

    //CHECK 5: sets waiting time to triage correctly
    expect(groupedResults[0].time_to_be_triaged).to.equal(29);
    expect(groupedResults[2].time_to_be_triaged).to.equal(30);

    //CHECK 6: sets time to be seen by a clinician correctly
    //i.e the encounter date time for the first clinical encounter
    expect(groupedResults[0].seen_by_clinician).to.equal(
      '2016-06-15T05:35:44.000Z'
    );
    expect(groupedResults[1].seen_by_clinician).to.equal(
      '2016-06-15T05:40:51.000Z'
    );
    expect(groupedResults[2].seen_by_clinician).to.equal(null);

    //CHECK 7: groups encounters correctly in order they arrived
    expect(groupedResults[1].encounters.length).to.equal(3);
    expect(groupedResults[1].encounters[0].encounter_type).to.equal(110);
    expect(groupedResults[1].encounters[1].encounter_type).to.equal(2);
    expect(groupedResults[1].encounters[2].encounter_type).to.equal(3);

    //CHECK 8: sets visit end time correctly
    //this is usually the last encounter creation date
    expect(groupedResults[0].completed_visit).to.equal(
      '2016-06-15T05:44:25.000Z'
    );
    expect(groupedResults[1].completed_visit).to.equal(
      '2016-06-15T05:56:59.000Z'
    );
    expect(groupedResults[2].completed_visit).to.equal(
      '2016-06-15T05:48:14.000Z'
    );

    //CHECK 9: calculates time_to_be_seen_by_clinician
    expect(groupedResults[0].time_to_be_seen_by_clinician !== undefined).to.be
      .true;

    //CHECK 10: calculates time_to_complete_visit
    expect(groupedResults[0].time_to_complete_visit !== undefined).to.be.true;
  });

  it('should calculate time span in minutes when _getTimeSpanInMinutes', function () {
    var difference = patientFlowProcessor._getTimeSpanInMinutes(
      '2016-06-15T05:16:34.000Z',
      '2016-06-15T05:46:30.000Z'
    );
    expect(difference).to.equal(30);
  });

  it('should calculate time to be seen by clinician correctly when _handleTimeToBeSeenByClinician', function () {
    //CASE 1: triage exisits
    var visitWithTriage = {
      registered: '2016-06-15T05:10:34.000Z',
      triaged: '2016-06-15T05:16:34.000Z',
      seen_by_clinician: '2016-06-15T05:46:34.000Z'
    };

    patientFlowProcessor._handleTimeToBeSeenByClinician(visitWithTriage);

    expect(visitWithTriage.time_to_be_seen_by_clinician).to.equal(30);

    //CASE 2: triage doesn't exist
    var visitWithoutTriage = {
      registered: '2016-06-15T05:16:34.000Z',
      seen_by_clinician: '2016-06-15T05:56:34.000Z'
    };

    patientFlowProcessor._handleTimeToBeSeenByClinician(visitWithoutTriage);

    expect(visitWithoutTriage.time_to_be_seen_by_clinician).to.equal(40);
  });

  it('should calculate time to complete visit correctly when _handleTimeToBeSeenByClinician', function () {
    //case both values present
    var visit = {
      registered: '2016-06-15T05:10:30.000Z',
      seen_by_clinician: '2016-06-15T05:56:34.000Z',
      completed_visit: '2016-06-15T05:56:34.000Z'
    };

    patientFlowProcessor._handleTimeToCompleteVisit(visit);

    expect(visit.time_to_complete_visit).to.equal(46);

    //case values absent
    var emptyVisit = {};
    patientFlowProcessor._handleTimeToCompleteVisit(emptyVisit);

    expect(emptyVisit.time_to_complete_visit).to.equal(null);
  });

  it('should calculate average waiting time when _calculateAverageWaitingTime', function () {
    var arrayOfPatientFlowData = [
      {
        time_to_be_seen_by_clinician: 5,
        time_to_be_triaged: 5,
        time_to_complete_visit: 3
      },
      {
        time_to_be_seen_by_clinician: 10,
        time_to_be_triaged: 10,
        time_to_complete_visit: 84
      },
      {
        time_to_be_seen_by_clinician: 15,
        time_to_be_triaged: 16,
        time_to_complete_visit: null
      },
      {
        time_to_be_seen_by_clinician: null,
        time_to_be_triaged: null,
        time_to_complete_visit: 8
      },
      {
        time_to_be_seen_by_clinician: 5,
        time_to_be_triaged: 5,
        time_to_complete_visit: 4
      },
      {
        time_to_be_seen_by_clinician: null,
        time_to_be_triaged: null,
        time_to_complete_visit: null
      }
    ];

    //average triage waiting time = 36/4 = 9.00

    //average clinician waiting time = 35/4 = 8.75

    //average waitingTime = (9.00 + 8.75)/2 = 8.88

    //average visit completion time = 99/4 = 24.75

    //incomplete visits is where there's no clinical encounter

    var expectedAverageTimeObject = {
      averageWaitingTime: '8.9',
      averageVisitCompletionTime: '24.8',
      averageTriageWaitingTime: '9.0',
      averageClinicianWaitingTime: '8.8'
    };

    var actualAverageTimeObject = patientFlowProcessor.calculateAverageWaitingTime(
      arrayOfPatientFlowData
    );
    //console.log(actualAverageWaitingTimeObject);

    expect(expectedAverageTimeObject).to.deep.equal(actualAverageTimeObject);
  });

  it('should get incomplete visits count when _getIncompleteVisitsCount', function () {
    var arrayOfPatientFlowData = [
      {
        seen_by_clinician: '2016-06-15T05:56:34.000Z'
      },
      {
        seen_by_clinician: '2016-06-15T05:56:34.000Z'
      },
      {
        seen_by_clinician: '2016-06-15T05:56:34.000Z'
      },
      {
        seen_by_clinician: null
      },
      {
        seen_by_clinician: '2016-06-15T05:56:34.000Z'
      },
      {
        seen_by_clinician: null
      }
    ];

    expect(
      patientFlowProcessor.getIncompleteVisitsCount(arrayOfPatientFlowData)
    ).to.equal(2);
  });

  it('should calculate median waiting time when _calculateAverageWaitingTime', function () {
    var arrayOfPatientFlowData = [
      {
        time_to_be_seen_by_clinician: 5,
        time_to_be_triaged: 5,
        time_to_complete_visit: 3
      },
      {
        time_to_be_seen_by_clinician: 10,
        time_to_be_triaged: 10,
        time_to_complete_visit: 84
      },
      {
        time_to_be_seen_by_clinician: 15,
        time_to_be_triaged: 16,
        time_to_complete_visit: null
      },
      {
        time_to_be_seen_by_clinician: null,
        time_to_be_triaged: null,
        time_to_complete_visit: 8
      },
      {
        time_to_be_seen_by_clinician: 5,
        time_to_be_triaged: 5,
        time_to_complete_visit: 4
      },
      {
        time_to_be_seen_by_clinician: null,
        time_to_be_triaged: null,
        time_to_complete_visit: null
      }
    ];

    var expectedMedianTimeObject = {
      medianWaitingTime: '7.5', // 5,5,5,5,10,10,15,16
      medianVisitCompletionTime: '6.0', // 3,4,8,84
      medianTriageWaitingTime: '7.5', //5,5,10,16
      medianClinicianWaitingTime: '7.5' //5,5,10,15
    };

    var actualAverageTimeObject = patientFlowProcessor.calculateMedianWaitingTime(
      arrayOfPatientFlowData
    );
    //console.log(actualAverageWaitingTimeObject);

    expect(expectedMedianTimeObject).to.deep.equal(actualAverageTimeObject);
  });
});
