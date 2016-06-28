(function() {
  'use strict';
  
  var etlMocks = require('../mock/etl.mock.js');
  var encounterMocks = require('../mock/encounter.mock.js');
  var noteGS = require('../../service/notes.service.js');
  var utils = require('../../service/utils.js');
  var math = require('math');
  var moment = require('moment');
  
  describe('NotesGeneratorService Unit Tests', function() {
    var hivSummary, encounters, vitals;
    var expectedNote;

    beforeEach(function() {
      //Get the stuff
      hivSummary = etlMocks.getHivSummaryMock();
      
      encounters = [
        encounterMocks.getAdultReturnRestMock(),
        encounterMocks.getTriageRestMock()
      ];
      
      vitals = etlMocks.getVitalsMock();
      
      function getEstimatedDate(startDate, period) {
        return moment(startDate).add(period, 'months')
                              .toDate().toISOString();
      }
      // bmi
      var bmi = math.round(utils.calculateBMI(vitals.weight, vitals.height), 1);
      expectedNote = {
        visitDate:hivSummary.encounter_datetime, 
        scheduled: hivSummary.scheduled_visit,
        providers:[{
          uuid:'pd13dddc-1359-11df-a1f1-0026b9348838',
          name: 'Unknown Unknown Unknown',
          encounterType: 'ADULTRETURN'
        }, {
          uuid:'pb6e31da-1359-11df-a1f1-0026b9348838',
          name: 'Giniton Giniton Giniton',
          encounterType: 'TRIAGE'
        }],
        lastViralLoad: {
          value: hivSummary.vl_1,
          date: hivSummary.vl_1_date,
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
          startDate:hivSummary.tb_prophylaxis_start_date,
          estimatedEndDate: getEstimatedDate(
                              hivSummary.tb_prophylaxis_start_date, 6)
        },
        ccHpi: [],
        assessment: [], 
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
    
    it('generateNote() should generate a correct note given all required ' + 
       'parameters', function(){
        var aNote = noteGS.generateNote(hivSummary, vitals, encounters);
        // console.log('expected', JSON.stringify(expectedNote,null,2));
        // console.log('aNote',JSON.stringify(aNote,null,2));
        expect(aNote).to.be.an.object;
        expect(aNote).to.deep.equal(expectedNote);
    });
    
    it('generateNotes() should generate an expected array of notes', function() {    
      var expected = [expectedNote];
      var notes = noteGS.generateNotes(encounters, [hivSummary], [vitals]);
      expect(notes).to.be.an.array;
      expect(notes.length).to.equal(1);
      expect(notes).to.deep.equal(expected);     
    });
  });
})();
