(function () {
  'use strict';

  module.exports = {
    getVitalsMock: getVitalsMock,
    getHivSummaryMock: getHivSummaryMock
  };

  function getVitalsMock() {
    return {
      person_id: 1000,
      uuid: 'patient-uuid',
      encounter_id: 6025923,
      encounter_datetime: '2016-04-11T07:11:44.000Z',
      location_id: 4,
      weight: 70,
      height: 172,
      temp: 36,
      oxygen_sat: 95,
      systolic_bp: 105,
      diastolic_bp: 69,
      pulse: 87
    };
  }

  function getHivSummaryMock() {
    return {
      person_id: 1000,
      uuid: 'patient-uuid',
      encounter_id: 5979801,
      encounter_datetime: '2016-04-11T21:00:00.000Z',
      encounter_type: 2,
      is_clinical_encounter: 1,
      location_id: 4,
      location_uuid: '08feb444-1352-11df-a1f1-0026b9348838',
      visit_num: 25,
      enrollment_date: '2013-09-15T21:00:00.000Z',
      hiv_start_date: '2013-09-15T21:00:00.000Z',
      death_date: null,
      scheduled_visit: null,
      transfer_out: null,
      transfer_in: null,
      patient_care_status: 6101,
      out_of_care: null,
      prev_rtc_date: '2016-02-17T21:00:00.000Z',
      rtc_date: '2016-04-17T21:00:00.000Z',
      arv_start_date: '2013-12-09T21:00:00.000Z',
      arv_first_regimen: 'TDF AND 3TC AND EFV',
      cur_arv_meds: 'TDF AND 3TC AND EFV',
      cur_arv_line: 1,
      first_evidence_patient_pregnant: null,
      edd: null,
      screened_for_tb: 1,
      tb_prophylaxis_start_date: '2016-02-17T21:00:00.000Z',
      tb_tx_start_date: null,
      pcp_prophylaxis_start_date: '2013-09-15T21:00:00.000Z',
      cd4_resulted: null,
      cd4_resulted_date: null,
      cd4_1: 149,
      cd4_1_date: '2013-09-29T21:00:00.000Z',
      cd4_2: null,
      cd4_2_date: null,
      cd4_percent_1: 8,
      cd4_percent_1_date: '2013-09-29T21:00:00.000Z',
      cd4_percent_2: null,
      cd4_percent_2_date: null,
      vl_resulted: null,
      vl_resulted_date: null,
      vl_1: 0,
      vl_1_date: '2015-06-14T21:00:00.000Z',
      vl_2: 0,
      vl_2_date: null,
      vl_order_date: null,
      cd4_order_date: '2013-09-29T21:00:00.000Z',
      hiv_dna_pcr_order_date: null,
      hiv_dna_pcr_resulted: null,
      hiv_dna_pcr_resulted_date: null,
      hiv_dna_pcr_1: null,
      hiv_dna_pcr_1_date: null,
      hiv_dna_pcr_2: null,
      hiv_dna_pcr_2_date: null,
      condoms_provided: null,
      using_modern_contraceptive_method: null,
      cur_who_stage: 3,
      prev_encounter_datetime_hiv: '2015-11-26T21:00:00.000Z',
      next_encounter_datetime_hiv: '2016-03-07T07:11:44.000Z',
      prev_encounter_type_hiv: 2,
      next_encounter_type_hiv: 110,
      prev_clinical_datetime_hiv: '2015-11-26T21:00:00.000Z',
      next_clinical_datetime_hiv: '2016-03-07T07:24:05.000Z',
      encounter_type_name: 'ADULTRETURN',
      prev_encounter_type_name: 'ADULTRETURN'
    };
  }
})();
