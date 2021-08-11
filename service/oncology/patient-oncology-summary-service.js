var db = require('../../etl-db');

function getOncMeds(request, medsFormat, encounterId) {
  let queryParts = {};
  var patientUuid = request.uuid;
  var programUuid = request.programUuid;
  if (medsFormat === 'summary') {
    queryParts = {
      columns: 't1.value_coded',
      table: 'amrs.obs',
      where: [
        't2.uuid = ? and t1.concept_id in ? and t1.encounter_id = ? and t1.voided = ?',
        patientUuid,
        [9918],
        encounterId,
        0
      ],
      order: [
        {
          column: 't1.obs_group_id',
          asc: false
        }
      ],
      joins: [['amrs.person', 't2', 't2.person_id=t1.person_id']],
      offset: request.startIndex,
      limit: request.limit
    };
  } else {
    queryParts = {
      columns:
        't1.concept_id, t1.value_coded, t1.value_numeric, t1.obs_group_id, t1.encounter_id, t1.obs_datetime',
      table: 'amrs.obs',
      where: [
        't2.uuid = ? and t5.programuuid = ? and t1.concept_id in ? and t1.voided = ?',
        patientUuid,
        programUuid,
        [9918, 8723, 1896, 7463, 1899, 9869],
        0
      ],
      order: [
        {
          column: 't1.obs_group_id',
          asc: false
        }
      ],
      joins: [
        ['amrs.person', 't2', 't2.person_id = t1.person_id'],
        ['amrs.patient_program', 't3', 't3.patient_id ``= t2.person_id']
      ],
      leftOuterJoins: [
        [
          '(SELECT program_id, uuid as `programuuid` FROM amrs.program ) `t5` ON (t3.program_id = t5.program_id)'
        ]
      ],
      offset: request.startIndex,
      limit: request.limit
    };
  }
  return db.queryDb(queryParts);
}

function generateMedsDataSet(data) {
  let meds = [];
  const groupBy = (key) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
  // Group medical history obs by the group
  if (data) {
    const groupByEncounter = groupBy('encounter_id');
    const encounterData = groupByEncounter(data);
    _.each(encounterData, function (concepts) {
      let oncMeds = {};
      const i = groupBy('obs_group_id');
      oncMeds.treatment_plan = _.filter(concepts, function (o) {
        return o.concept_id === 9869;
      });
      _.remove(concepts, function (e) {
        return e.obs_group_id == null;
      });
      let drug;
      drug = i(concepts);
      if (!_.isEmpty(drug)) {
        oncMeds.drugs = drug;
        meds.push(oncMeds);
      }
    });
  }
  return meds;
}

function getPatientOncologyDiagnosis(request) {
  let patientUuid = request.uuid;
  let queryParts = {
    columns: 'cancer_type, cancer_subtype, diagnosis_date',
    order: [
      {
        column: 'encounter_id',
        asc: false
      }
    ],
    joins: [['amrs.person', 't2', 't2.person_id = t1.person_id']],
    table: 'etl.flat_onc_patient_history',
    where: ['t2.uuid = ?', patientUuid],
    offset: request.startIndex,
    limit: request.limit
  };

  return db.queryDb(queryParts);
}

function getOncologyIntegratedProgramSnapshot(request) {
  let patientUuid = request.uuid;
  let queryParts = {
    columns:
      "t1.encounter_id, t1.encounter_datetime, t6.name AS `encounter_type_name`, REPLACE(t3.name, 'Oncology ', '') AS `visit_name`, t5.name AS `location`, t7.breast_exam_findings_this_visit, t7.past_clinical_breast_exam_results, CASE WHEN t8.via_or_via_vili_test_result = 1 THEN 'Negative' WHEN t8.via_or_via_vili_test_result = 2 THEN 'Positive' WHEN t8.via_or_via_vili_test_result = 3 THEN 'Suspicious of cancer' ELSE NULL END, t8.hiv_status, CASE WHEN t8.prior_via_result = 1 THEN 'Positive' WHEN t8.prior_via_result = 1 THEN 'Negative' ELSE NULL END, t8.prior_via_result_date",
    order: [
      {
        column: 'encounter_datetime',
        asc: false
      }
    ],
    group: ['t1.visit_id'],
    joins: [
      ['amrs.visit', 't2', 't2.visit_id = t1.visit_id'],
      ['amrs.visit_type', 't3', 't3.visit_type_id = t2.visit_type_id'],
      ['amrs.person', 't4', 't4.person_id = t1.patient_id'],
      ['amrs.location', 't5', 't5.location_id = t1.location_id'],
      ['amrs.encounter_type', 't6', 't6.encounter_type_id = t1.encounter_type'],
      [
        'etl.flat_breast_cancer_screening',
        't7',
        't7.encounter_id = t1.encounter_id'
      ],
      [
        'etl.flat_cervical_cancer_screening',
        't8',
        't8.encounter_id = t1.encounter_id'
      ]
    ],
    table: 'amrs.encounter',
    where: [
      't4.uuid = ? and t2.visit_type_id in ? and t1.voided = ?',
      patientUuid,
      // Visit types: Breast screening, Cervical screening, Lung screening, Sickle cell screening
      [5, 6, 70, 71],
      0
    ],
    offset: request.startIndex,
    limit: request.limit
  };

  return db.queryDb(queryParts);
}

export {
  generateMedsDataSet,
  getOncMeds,
  getPatientOncologyDiagnosis,
  getOncologyIntegratedProgramSnapshot
};
