(function(){
  'use strict';

  var dao = require('../etl-dao');
  var _ = require('underscore');
  var moment = require('moment');
  var DEFAULT_NO_NOTES = 40;
  var TB_PROPHY_PERIOD = 6; // In months.
  var CONCEPT_UUIDS = {
    CUR_TB_TX_DETAILED: 'a8afdb8c-1350-11df-a1f1-0026b9348838',
    CUR_TB_TX: 'a899e444-1350-11df-a1f1-0026b9348838',
    TB_TX_DRUG_STARTED_DETAILED: 'a89fe6f0-1350-11df-a1f1-0026b9348838',
    TB_TX_PLAN: 'a89c1fd4-1350-11df-a1f1-0026b9348838',
    CC_HPI: 'a89ffbf4-1350-11df-a1f1-0026b9348838',
    ASSESSMENT: '23f710cc-7f9c-4255-9b6b-c3e240215dba',
    TB_PROPHY_PLAN: 'a89c1cfa-1350-11df-a1f1-0026b9348838'
  };

  var encOrder = {
    2: 1, // ADULTRETURN
    1: 10, // ADULTINITIAL
    4: 1, // PEDSRETURN
    3: 10, // PEDSINITIAL
    110: 20, // TRIAGE
    99999: 30, // Special Lab encounter code
    21: 40, // OUTREACHFIELDFU
    17: 50, // ECSTABLE
    other: 100 // Any other encounter
  };

  var generateNotes = function(encounters, hivSummaries, vitals, endDate) {
      // Make endDate today if not specified
      if (endDate) {
        if (typeof endDate === 'string') {
          try {
            endDate = Date.parse(endDate);
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        endDate = moment();
      }

      // Set startIndex to 0 if not passed
      var startIndex = startIndex || 0;

      // Limit to DEFAULT_NO_NOTES notes if not specified 
      // (i.e DEFAULT_NO_NOTES encounters going backward)
      var limit = limit || DEFAULT_NO_NOTES;

      if (!hivSummaries || _.isEmpty(hivSummaries)) {
        throw new Error('No summaries returned');
      } else {
        // TODO: Need to determine whether it is wise to fail if others are
        // not available as well.
        var hivModels = hivSummaries;
        
        // Group the summaries based on date
        var summaryDateGrouped = {};
        _.each(hivModels, function(model) {
          var key = moment(model.encounter_datetime).format('MMM_DD_YYYY');
          model.ordering = encOrder[model.encounter_type] || encOrder.other;
          if (Array.isArray(summaryDateGrouped[key])) {
            summaryDateGrouped[key].push(model);
          } else {
            summaryDateGrouped[key] = [model];
          }
        });

        // Sort the groups according to ordering column
        _.each(summaryDateGrouped, function(group) {
          group.sort(function compare(x, y) {
            return x.ordering - y.ordering;
          });
        });

        // Now pick the most preferred encounter in every group.
        var massagedHivModels = _.map(summaryDateGrouped, function(group) {
          return _.first(group);
        });
        
        // Deal with vitals.
        var vitalDateGrouped = {};
        if (vitals && !_.isEmpty(vitals)) {
          var vitalModels = vitals;

          // Create a date grouped representation

          _.each(vitalModels, function(model) {
            var key = moment(model.encounter_datetime).format('MMM_DD_YYYY');
            vitalDateGrouped[key] = model;
          });
        }
        
        // Deal with encounters
        var encDateGrouped = {};
        if (encounters && !_.isEmpty(encounters)) {
          // Group encounters by date
          _.each(encounters, function(encounter) {
            var key = moment(encounter.encounterDatetime).format('MMM_DD_YYYY');
            if (Array.isArray(encDateGrouped[key])) {
              encDateGrouped[key].push(encounter);
            } else {
              encDateGrouped[key] = [encounter];
            }
          });
        }

        // Generate notes for each Hiv summary date.
        var notes = [];
        for (var dateKey in summaryDateGrouped) {
          var note = generateNote(_.first(summaryDateGrouped[dateKey]),
            vitalDateGrouped[dateKey], encDateGrouped[dateKey]);
          notes.push(note);
        }

        return notes;
      }
  }

  /**
   * This method will try to generate note for available data, i.e it won't
   * fail because one of the expected data object is null
   */
  function generateNote(hivSummaryModel, vitalsModel, encounters) {
    if (Array.isArray(encounters) && !_.isEmpty(encounters)) {
      //Create a corresponding array of models
      var encModelArray = encounters;
    }
    var noInfo = '';
    var note = {
      visitDate: hivSummaryModel.encounter_datetime,
      scheduled: hivSummaryModel.scheduled_visit,
      providers: [],
      lastViralLoad: {
        value: hivSummaryModel.vl_1,
        date: hivSummaryModel.vl_1_date,
      },
      lastCD4Count: {
        value: hivSummaryModel.cd4_1,
        date: hivSummaryModel.cd4_1_date
      },
      artRegimen: {
        curArvMeds: noInfo,
        curArvLine: noInfo,
        startDate: noInfo
      },
      tbProphylaxisPlan: {
        plan: noInfo,
        startDate: noInfo,
        estimatedEndDate: noInfo
      },
      ccHpi: '',
      assessment: '',
      vitals: {
        weight: noInfo,
        height: noInfo,
        bmi: noInfo,
        temperature: noInfo,
        oxygenSaturation: noInfo,
        systolicBp: noInfo,
        diastolicBp: noInfo,
        pulse: noInfo
      },
      rtcDate: hivSummaryModel.rtc_date
    };

    if (vitalsModel && !_.isEmpty(vitalsModel)) {

      note.vitals = {
        weight: vitalsModel.weight,
        height: vitalsModel.height,
        bmi: vitalsModel.bmi,
        temperature: vitalsModel.temp,
        oxygenSaturation: vitalsModel.oxygen_sat,
        systolicBp: vitalsModel.systolic_bp || '',
        diastolicBp: vitalsModel.diastolic_bp || '',
        pulse: vitalsModel.pulse
      };
    }

    //Get the providers & regimens
    if (Array.isArray(encounters) && !_.isEmpty(encounters)) {
      note.providers = _getProviders(encounters);

      // Get CC/HPI & Assessment
      var ccHpi = _findTextObsValue(encounters, CONCEPT_UUIDS.CC_HPI,
        __findObsWithGivenConcept);

      var assessment = _findTextObsValue(encounters, CONCEPT_UUIDS.ASSESSMENT,
        __findObsWithGivenConcept);

      note.ccHpi = ccHpi || 'None';
      note.assessment = assessment || 'None';

      // Get TB prophylaxis
      note.tbProphylaxisPlan = _constructTBProphylaxisPlan(encounters, hivSummaryModel,
        __findObsWithGivenConcept);
    } else {
      console.log('encounters array is null or empty');
    }

    // Get ART regimen
    if (!_.isEmpty(hivSummaryModel.cur_arv_meds)) {
      // Just use the stuff from Etl
      note.artRegimen = {
        curArvMeds: hivSummaryModel.cur_arv_meds,
        curArvLine: hivSummaryModel.cur_arv_line,
        arvStartDate: hivSummaryModel.arv_start_date
      };
    } else {
      // TODO: Try getting it from encounters.
    }

    return note;
  }

  function _getProviders(encModelArray) {
    var providers = [];
    _.each(encModelArray, function(encModel) {
      var providerObject = encModel.provider || {};
      var encounterType = encModel.encounterType || {};
      var provider = {
        uuid: providerObject.uuid || '',
        name: providerObject.display || '',
        encounterType: encounterType.display || ''
      };
      providers.push(provider);
    });
    return _.uniq(providers, false, function(provider) {
      return provider.uuid + provider.encounterType;
    });
  }

  /*
   * TODO: Make this recursive to be able to search deeper than one level
   */
  function __findObsWithGivenConcept(obsArray, conceptUuid, grouper) {
    var grouper = grouper || false;
    var found = null;
    if (grouper) {
      found = [];
      _.each(obsArray, function(obs) {
        if (obs.groupMembers !== null && obs.concept !== null && obs.concept.uuid === conceptUuid) {
          found.push(obs);
        }
      });
    } else {
      // Non grouper concepts
      found = _.find(obsArray, function(obs) {
        return (obs.concept !== null && obs.concept.uuid === conceptUuid);
      });
    }
    return found;
  }

  function _findTextObsValue(encArray, conceptUuid, obsfinder) {
    var value = null;
    var found = null;

    _.find(encArray, function(enc) {
      found = obsfinder(enc.obs, conceptUuid);
      return found !== null && !_.isEmpty(found);
    });

    if (found) {
      value = found.value;
    }
    return value;
  }

  /**
   * Algorithm:
   * -> Check for existence of tb prophylaxis plan, if found and plan is
   *    continue or start then report and fetch start date.
   * -> if plan is stop then see calculate the duration the patient was on
   *    prophylaxis and fetch reason if available.
   * -> if it is to change the fetch the reasone.
   */
  function _constructTBProphylaxisPlan(encArray, hivSummaryModel, obsfinder) {
    // Find plan.
    var tbProphy = {
      plan: 'Not available',
      estimatedEndDate: 'Unknown',
    };
    var planConceptUuid = CONCEPT_UUIDS.TB_PROPHY_PLAN;
    var found = null;

    _.find(encArray, function(enc) {
      found = obsfinder(enc.obs, planConceptUuid);
      return found !== null && !_.isEmpty(found);
    });

    if (found) {
      tbProphy.plan = found.value.display;
    }

    // Calculate estimated end date of plan (6 months after starting)
    var tempDate = moment(hivSummaryModel.tb_prophylaxis_start_date);
    if (tempDate.isValid()) {
      tbProphy.startDate = hivSummaryModel.tb_prophylaxis_start_date;
      tbProphy.estimatedEndDate =
        moment(hivSummaryModel.tb_prophylaxis_start_date)
        .add(TB_PROPHY_PERIOD, 'months')
        .toDate().toISOString();
    } else {
      tbProphy.startDate = 'Not available';
      tbProphy.estimatedEndDate = 'N/A';
    }
    return tbProphy;
  }

  module.exports = {
    generateNotes: generateNotes
  };
})();
