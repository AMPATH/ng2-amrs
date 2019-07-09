var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var patientReminder = require('../../service/patient-reminder.service.js');
var _ = require('underscore');
var expect = chai.expect;
chai.use(sinonChai);

describe('Patient Reminder Service Unit Tests', function () {

    beforeEach(function (done) {

        done();
    });

    afterEach(function () {

    });

    it('should load  patient reminder module',
        function () {
            expect(patientReminder).to.be.defined;
        });

    it('should preprocess patient reminder results',
        function () {
            var initialResult = {
                "startIndex": 0,
                "size": 1,
                "result": [
                    {
                        "last_encounter_date": "2016-07-18T21:00:00.000Z",
                        "person_id": 334192,
                        "person_uuid": "patient-uuid",
                        "arv_start_date": "2012-01-23T21:00:00.000Z",
                        "cur_arv_meds": "630 ## 633",
                        "viral_load": 0,
                        "vl_order_date": "2015-04-14T21:00:00.000Z",
                        "last_vl_date": "2014-06-11T21:00:00.000Z",
                        "vl_error": null,
                        "vl_error_date": "2016-07-18T21:00:00.000Z",
                        "ordered_vl_has_error": 1,
                        "vl_error_order_date": "2016-07-18T21:00:00.000Z",
                        "tb_prophylaxis_end_date": null,
                        "tb_prophylaxis_start_date": null,
                        "inh_treatment_days_remaining": null,
                        "needs_vl_coded": 3,
                        "overdue_vl_lab_order": 0,
                        "new_viral_load_present": 0,
                        "months_since_last_vl_date": 32,
                        "is_on_inh_treatment": 0,
                        "qualifies_enhanced": 0,
                        "is_pregnant": 0,
                        "is_postnatal": 0,
                        "is_infant": 0,
                        "dna_pcr_reminder": 0,
                        "has_gene_xpert_result": 0,
                        "has_dst_result": 0
                    }
                ]
            };

            var processedResults = {
                "startIndex": 0,
                "size": 1,
                "result": {
                    "person_id": 334192,
                    "person_uuid": "patient-uuid",
                    "reminders": [
                        {
                            "message": "Viral load test that was ordered on: (19-07-2016)" +
                            " resulted to an error. Please re-order.",
                            "title": "Lab Error Reminder",
                            "type": "danger",
                            "display": {
                                "banner": true,
                                "toast": true
                            }
                        },
                        {
                        "message": "Patient requires viral load. Patients older than 25 years and on ART > 1 year" +
                        " require a viral load test every year. Last viral load: LDL on" +
                        " (12-06-2014) 32 months ago.",
                        "title": "Viral Load Reminder",
                        "type": "danger",
                        "display": {
                          "banner": true,
                          "toast": true
                        }
                      }
                    ]
                }
            };
            
            var eidResults = {
              viralLoad: []
            };


            var processedReminder = patientReminder.generateReminders(initialResult.result, eidResults);

            expect(processedReminder).to.deep.equal(processedResults.result);
        });
  
  it('should return pending lab order when it exists in EID',
    function () {
      var initialResult = {
        "startIndex": 0,
        "size": 1,
        "result": [
          {
            "last_encounter_date": "2016-07-18T21:00:00.000Z",
            "person_id": 334192,
            "person_uuid": "patient-uuid",
            "arv_start_date": "2012-01-23T21:00:00.000Z",
            "cur_arv_meds": "630 ## 633",
            "viral_load": 0,
            "vl_order_date": "2015-04-14T21:00:00.000Z",
            "last_vl_date": "2014-06-11T21:00:00.000Z",
            "vl_error": null,
            "vl_error_date": "2016-07-18T21:00:00.000Z",
            "ordered_vl_has_error": 1,
            "vl_error_order_date": "2016-07-18T21:00:00.000Z",
            "tb_prophylaxis_end_date": null,
            "tb_prophylaxis_start_date": null,
            "inh_treatment_days_remaining": null,
            "needs_vl_coded": 3,
            "overdue_vl_lab_order": 0,
            "new_viral_load_present": 0,
            "months_since_last_vl_date": 32,
            "is_on_inh_treatment": 0,
            "qualifies_enhanced": 0,
            "is_pregnant": 0,
            "is_postnatal": 0,
            "is_infant": 0,
            "dna_pcr_reminder": 0,
            "has_gene_xpert_result": 0,
            "has_dst_result": 0
          }
        ]
      };
      var processedResults = {
        "startIndex": 0,
        "size": 1,
        "result": {
          "person_id": 334192,
          "person_uuid": "patient-uuid",
          "reminders": [
            {
              "message": "Patient lab Order No. is currently being processed. Sample collected" +
              " on 15-05-2017).",
              "title": "Pending Lab Order Result",
              "type": "info",
              "display": {
                "banner": true,
                "toast": true
              }
            }
          ]
        }
      };
      
      var eidResults = {
        viralLoad: [
          {
            "LabID": "1",
            "OrderNo": "",
            "PatientID": "123",
            "ProviderID": "",
            "MFLCode": "1",
            "AMRslocationID": "",
            "AMRslocation": "",
            "PatientNames": "",
            "DateCollected": "15-May-2017",
            "DateReceived": "17-May-2017",
            "DateTested": "22-May-2017",
            "Result": "Target Not Detected",
            "FinalResult": "< LDL copies/ml",
            "DateDispatched": "23-May-2017",
            "SampleStatus": "Complete"
          }
        ]
      };
      
      var processedReminder = patientReminder.generateReminders(initialResult.result, eidResults);
      
      expect(processedReminder).to.deep.equal(processedResults.result);
    });



});
