(function () {
  'use strict';

  var etlMocks = require('../mock/etl.mock.js');
  var encounterMocks = require('../mock/encounter.mock.js');
  var noteGS = require('../../service/notes.service.js');
  var utils = require('../../service/utils.js');
  var math = require('math');
  var moment = require('moment');

  describe('NotesGeneratorService Unit Tests', function () {
    var hivSummary, encounters, vitals;
    var expectedNote;

    beforeEach(function () {
      //Get the stuff
      hivSummary = etlMocks.getHivSummaryMock();

      encounters = [
        encounterMocks.getAdultReturnRestMock(),
        encounterMocks.getTriageRestMock()
      ];

      vitals = etlMocks.getVitalsMock();

      function getEstimatedDate(startDate, period) {
        return moment(startDate).add(period, 'months').toDate().toISOString();
      }
      // bmi
      var bmi = math.round(utils.calculateBMI(vitals.weight, vitals.height), 1);
      expectedNote = {
        visitDate: hivSummary.encounter_datetime,
        scheduled: hivSummary.scheduled_visit,
        providers: [
          {
            uuid: 'pd13dddc-1359-11df-a1f1-0026b9348838',
            name: 'Unknown Unknown Unknown',
            encounterType: 'ADULTRETURN'
          },
          {
            uuid: 'pb6e31da-1359-11df-a1f1-0026b9348838',
            name: 'Giniton Giniton Giniton',
            encounterType: 'TRIAGE'
          }
        ],
        lastViralLoad: {
          value: hivSummary.vl_1,
          date: hivSummary.vl_1_date
        },
        lastCD4Count: {
          value: hivSummary.cd4_1,
          date: hivSummary.cd4_1_date
        },
        artRegimen: {
          curArvMeds: hivSummary.cur_arv_meds,
          curArvLine: hivSummary.cur_arv_line,
          arvStartDate: hivSummary.arv_start_date
        },
        tbProphylaxisPlan: {
          plan: 'START DRUGS',
          startDate: hivSummary.tb_prophylaxis_start_date,
          estimatedEndDate: getEstimatedDate(
            hivSummary.tb_prophylaxis_start_date,
            6
          )
        },
        ccHpi: [],
        assessment: [],
        otherAssessment: [],
        vitals: {
          weight: vitals.weight,
          height: vitals.height,
          bmi: bmi,
          temperature: vitals.temp,
          oxygenSaturation: vitals.oxygen_sat,
          systolicBp: vitals.systolic_bp,
          diastolicBp: vitals.diastolic_bp,
          pulse: vitals.pulse
        },
        rtcDate: hivSummary.rtc_date
      };
    });

    it(
      'generateNote() should generate a correct note given all required ' +
        'parameters',
      function () {
        var aNote = noteGS.generateNote(hivSummary, vitals, encounters);
        // console.log('expected', JSON.stringify(expectedNote,null,2));
        // console.log('aNote',JSON.stringify(aNote,null,2));
        expect(aNote).to.be.an.object;
        expect(aNote).to.deep.equal(expectedNote);
      }
    );

    it('generateNotes() should generate an expected array of notes', function () {
      var expectedNote = {
        visitDate: '2016-04-11T21:00:00.000Z',
        scheduled: null,
        providers: [],
        lastViralLoad: { value: 0, date: '2015-06-14T21:00:00.000Z' },
        lastCD4Count: { value: 149, date: '2013-09-29T21:00:00.000Z' },
        artRegimen: {
          curArvMeds: 'TDF AND 3TC AND EFV',
          curArvLine: 1,
          arvStartDate: '2013-12-09T21:00:00.000Z'
        },
        tbProphylaxisPlan: {
          plan: '',
          startDate: '',
          estimatedEndDate: ''
        },
        ccHpi: [],
        assessment: [],
        otherAssessment: [],
        vitals: {
          weight: '',
          height: '',
          bmi: '',
          temperature: '',
          oxygenSaturation: '',
          systolicBp: '',
          diastolicBp: '',
          pulse: ''
        },
        rtcDate: '2016-04-17T21:00:00.000Z'
      };
      var expected = [expectedNote];
      // console.log('expected===',expected)
      var notes = noteGS.generateNotes(encounters, [hivSummary], [vitals]);
      expect(notes).to.be.an.array;
      expect(notes.length).to.equal(1);
      expect(notes).to.deep.equal(expected);
    });

    it('generateNotes() should order CC/HPI & assessment chronologically', function () {
      var ASSESSMENT = '23f710cc-7f9c-4255-9b6b-c3e240215dba';
      var adultReturn = encounterMocks.getAdultReturnRestMock();
      var triage = encounterMocks.getTriageRestMock();

      // Change encounterDatetime to have slightly different time
      adultReturn.encounterDatetime = '2016-04-11T11:18:10.000+0300';
      triage.encounterDatetime = '2016-04-11T11:17:30.000+0300'; // happen earlier

      // Inject assessment in triage & adult return mocks.
      var triageAssessment = {
        concept: {
          uuid: ASSESSMENT,
          name: {
            uuid: 'some-name-uuid',
            name: 'ASSESSMENT'
          }
        },
        value: 'High Blood pressure, low weight',
        groupMembers: null
      };

      triage.obs.push(triageAssessment);

      // Change adult return value slightly different version
      var adultReturnAss = Object.assign({}, triageAssessment);
      adultReturnAss.value = 'Coughing, chest pain. TB suspected';

      adultReturn.obs.push(adultReturnAss);

      // Change the expected note to include the above added assessments
      var expected = Object.assign({}, expectedNote);
      var ass1Toexpect = {
        obsDatetime: triage.encounterDatetime,
        encounterType: triage.encounterType.display,
        value: triageAssessment.value
      };
      var ass2Toexpect = {
        obsDatetime: adultReturn.encounterDatetime,
        encounterType: adultReturn.encounterType.display,
        value: adultReturnAss.value
      };
      expected.assessment.push(ass1Toexpect, ass2Toexpect);

      // Create note and set expectations
      var note = noteGS.generateNote(hivSummary, vitals, [adultReturn, triage]);

      expect(note).to.deep.equal(expected);
      expect(note.assessment[0]).to.deep.equal(ass1Toexpect);
      expect(note.assessment[1]).to.deep.equal(ass2Toexpect);
    });
  });
})();
