var mocks = {
  getPatientFlowSample: getPatientFlowSample
};

module.exports = mocks;

function getPatientFlowSample() {
  return {
    startIndex: 0,
    size: 130,
    result: [
      {
        visit_id: 26727,
        visit_start: '2016-06-15T04:47:21.000Z',
        triaged: '2016-06-15T05:16:34.000Z',
        time_to_be_triaged: 29,
        seen_by_clinician: null,
        visit_end: null,
        encounter_type: 110,
        encounter_start: '2016-06-15T05:16:34.000Z',
        encounter_end: '2016-06-15T05:18:39.000Z',
        patient_id: 783782,
        given_name: 'Test 1',
        middle_name: 'Test 1',
        family_name: 'Test 1',
        identifiers: '15204-33717,435990441-6'
      },
      {
        visit_id: 26727,
        visit_start: '2016-06-15T04:47:21.000Z',
        triaged: null,
        time_to_be_triaged: null,
        seen_by_clinician: '2016-06-15T05:35:44.000Z',
        visit_end: '2016-06-15T05:45:25.000Z',
        encounter_type: 2,
        encounter_start: '2016-06-15T05:35:44.000Z',
        encounter_end: '2016-06-15T05:44:25.000Z',
        patient_id: 783782,
        given_name: 'Test 1',
        middle_name: 'Test 1',
        family_name: 'Test 1',
        identifiers: '435990441-6,15204-33717'
      },
      {
        visit_id: 26729,
        visit_start: '2016-06-15T04:48:28.000Z',
        triaged: '2016-06-15T05:19:58.000Z',
        time_to_be_triaged: 31,
        seen_by_clinician: null,
        visit_end: null,
        encounter_type: 110,
        encounter_start: '2016-06-15T05:19:58.000Z',
        encounter_end: '2016-06-15T05:22:10.000Z',
        patient_id: 57329,
        given_name: 'Test 2',
        middle_name: 'Test 2',
        family_name: 'Test 2',
        identifiers: '299471344-0,16093MT-9,15204-14095'
      },
      {
        visit_id: 26729,
        visit_start: '2016-06-15T04:48:28.000Z',
        triaged: null,
        time_to_be_triaged: null,
        seen_by_clinician: '2016-06-15T05:40:51.000Z',
        visit_end: null,
        encounter_type: 2,
        encounter_start: '2016-06-15T05:40:51.000Z',
        encounter_end: '2016-06-15T05:43:43.000Z',
        patient_id: 57329,
        given_name: 'Test 2',
        middle_name: 'Test 2',
        family_name: 'Test 2',
        identifiers: '299471344-0,16093MT-9,15204-14095'
      },
      {
        visit_id: 26729,
        visit_start: '2016-06-15T04:48:28.000Z',
        triaged: null,
        time_to_be_triaged: null,
        seen_by_clinician: '2016-06-15T05:46:52.000Z',
        visit_end: null,
        encounter_type: 3,
        encounter_start: '2016-06-15T05:46:52.000Z',
        encounter_end: '2016-06-15T05:56:59.000Z',
        patient_id: 94168,
        given_name: 'Test 2',
        middle_name: 'Test 2',
        family_name: 'Test 2',
        identifiers: '23223MT-3,15204-20061,973642608-2'
      },
      {
        visit_id: 26731,
        visit_start: '2016-06-15T04:49:26.000Z',
        triaged: '2016-06-15T05:16:34.000Z',
        time_to_be_triaged: 30,
        seen_by_clinician: null,
        visit_end: '2016-06-15T05:49:34.000Z',
        encounter_type: 110,
        encounter_start: '2016-06-15T05:16:34.000Z',
        encounter_end: '2016-06-15T05:48:14.000Z',
        patient_id: 94169,
        given_name: 'Test 3',
        middle_name: 'Test 3',
        family_name: 'Test 3',
        identifiers: '23223MT-3,15204-20061,973642608-2'
      }
    ]
  };
}
