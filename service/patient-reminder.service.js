'use strict';
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
var rp = require('../request-config');
var config = require('../conf/config.json');
var encounter_service = require('./openmrs-rest/encounter');
var program_service = require('./openmrs-rest/program.service');
const cervicalCancerScreeningService = require('./cervical-cancer-screening-service');

var serviceDef = {
  generateReminders: generateReminders,
  viralLoadReminders: viralLoadReminders,
  newViralLoadPresent: newViralLoadPresent,
  viralLoadErrors: viralLoadErrors,
  pendingViralOrder: pendingViralOrder,
  inhReminders: inhReminders
};

module.exports = serviceDef;

function viralLoadReminders(data) {
  let reminders = [];

  let labMessage = 'Last viral load: none';
  if (data.last_vl_date) {
    labMessage =
      'Last viral load: ' +
      transformZeroVl(data.viral_load) +
      ' on ' +
      '(' +
      Moment(data.last_vl_date).format('DD-MM-YYYY') +
      ')' +
      ' ' +
      data.months_since_last_vl_date +
      ' months ago.';
  }

  let isAdult = checkAge(new Date(data.birth_date));

  if (!isAdult && data.months_since_last_vl_date >= 6) {
    reminders.push({
      message:
        'Patient requires a viral load test. Patients who are between 0-24 years old ' +
        'require a viral load test every 6 months. ' +
        labMessage,
      title: 'Viral Load Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  } else if (
    isAdult &&
    data.needs_vl_coded === 2 &&
    data.months_since_last_vl_date >= 6
  ) {
    reminders.push({
      message:
        'Patient requires a viral load test. Patients older than 25 years and newly on ART require ' +
        'a viral load test every 6 months. ' +
        labMessage,
      title: 'Viral Load Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  } else if (
    isAdult &&
    data.needs_vl_coded === 3 &&
    data.months_since_last_vl_date >= 12
  ) {
    reminders.push({
      message:
        'Patient requires viral load. Patients older than 25 years and on ART > 1 year require ' +
        'a viral load test every year. ' +
        labMessage,
      title: 'Viral Load Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  } else if (data.needs_vl_coded === 4 && data.gender === 'F') {
    reminders.push({
      message:
        'Patient requires viral load. A pregnant or breastfeeding patient with vl > 400 requires ' +
        'a viral load test every 3 months. ' +
        labMessage,
      title: 'Viral Load Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  } else if (data.needs_vl_coded === 5 && data.gender === 'F') {
    reminders.push({
      message:
        'Patient requires viral load. A pregnant or breastfeeding patient with vl <= 400 requires ' +
        'a viral load test every 6 months. ' +
        labMessage,
      title: 'Viral Load Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  }

  return reminders;
}

function checkAge(dateString) {
  isInfant(dateString);
  if (calculateAge(dateString) <= 24) {
    return false;
  } else {
    return true;
  }
}

function calculateAge(dateString) {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function isInfant(dateString) {
  let months = Moment().diff(dateString, 'months');
}

function qualifiesDifferenciatedReminders(data) {
  let reminders = [];
  let diffMessage = '';
  if (data.qualifies_differenciated_care) {
    diffMessage =
      'Last viral load: ' +
      transformZeroVl(data.viral_load) +
      ' on ' +
      '(' +
      Moment(data.last_vl_date).format('DD-MM-YYYY') +
      ')' +
      ' ' +
      data.months_since_last_vl_date +
      ' months ago.';
  }

  if (
    data.qualifies_differenciated_care &&
    data.is_postnatal === 0 &&
    data.is_pregnant === 0 &&
    data.qualifies_enhanced === 0
  ) {
    reminders.push({
      message:
        'Patient qualifies for Differentiated Care. Viral load is <= 400 and age >= 20. ' +
        diffMessage,
      title: 'Differentiated Care Reminder',
      type: 'warning',
      display: {
        banner: true,
        toast: true
      },
      action: true,
      auto_register: '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
    });
  } else {
    console.info.call(
      'No Differentiated Care reminder For Selected Patient' +
        data.qualifies_differenciated_care
    );
  }

  return reminders;
}

function inhReminders(data) {
  let reminders = [];
  try {
    if (
      data.is_on_inh_treatment &&
      data.inh_treatment_days_remaining > 30 &&
      data.inh_treatment_days_remaining < 150
    ) {
      reminders.push({
        message:
          'Patient started INH treatment on (' +
          Moment(data.ipt_start_date).format('DD-MM-YYYY') +
          '). ' +
          'Expected to end on (' +
          Moment(data.ipt_completion_date).format('DD-MM-YYYY') +
          '). ' +
          data.inh_treatment_days_remaining +
          ' days remaining.',
        title: 'INH Treatment Reminder',
        type: 'danger',
        display: {
          banner: true,
          toast: true
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
  // INH Treatment Reminder - last mont
  if (
    data.is_on_inh_treatment &&
    data.inh_treatment_days_remaining <= 30 &&
    data.inh_treatment_days_remaining > 0
  ) {
    reminders.push({
      message:
        'Patient has been on INH treatment for the last 5 months. Expected to end on (' +
        Moment(data.ipt_completion_date).format('DD-MM-YYYY') +
        ') ',
      title: 'INH Treatment Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function viralLoadErrors(data) {
  let reminders = [];
  if (data.ordered_vl_has_error === 1) {
    reminders.push({
      message:
        'Viral load test that was ordered on: (' +
        Moment(data.vl_error_order_date).format('DD-MM-YYYY') +
        ') ' +
        'resulted in an error. Please re-order.',
      title: 'Lab Error Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function pendingViralOrder(data) {
  let reminders = [];
  if (data.overdue_vl_lab_order > 0) {
    reminders.push({
      message:
        "No result reported for patient's viral load test drawn on (" +
        Moment(data.vl_order_date).format('DD-MM-YYYY') +
        ') days ago' +
        ' Please follow up with lab or redraw new specimen.',
      title: 'Overdue Viral Load Order',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function newViralLoadPresent(data) {
  let reminders = [];
  if (data.new_viral_load_present) {
    reminders.push({
      message:
        'New viral load result: ' +
        transformZeroVl(data.viral_load) +
        ' (collected on ' +
        Moment(data.last_vl_date).format('DD-MM-YYYY') +
        ').',
      title: 'New Viral Load present',
      type: 'success',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function pendingViralLoadLabResult(eidResults) {
  // console.log('EID Results', eidResults);
  let incompleteResult = eidResults.find((result) => {
    if (result) {
      if (result.sample_status) {
        return result.sample_status === 'Incomplete';
      }
    } else {
      console.error('EID Result undefined error', result);
    }
  });
  let reminders = [];
  //let data = _.last(eidResults.viralLoad);
  if (incompleteResult) {
    let dateSplit = incompleteResult.date_collected.split('-');
    let dateCollected = Moment(incompleteResult.date_collected);
    reminders.push({
      message:
        `The patient's Lab Order No.` +
        incompleteResult.order_number +
        ' is currently being processed. Sample' +
        ' collected on ' +
        dateCollected.format('DD-MM-YYYY') +
        ').',
      title: 'Pending Lab Order Result',
      type: 'info',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function qualifiesEnhancedReminders(data) {
  let reminders = [];

  switch (data.qualifies_enhanced) {
    case 1:
      reminders.push({
        message:
          'The Patient’s viral load is greater than 400. Patients with viral load greater than 400 should be enrolled in the Viremia program.',
        title: 'Viremia Program',
        type: 'warning',
        display: {
          banner: true,
          toast: true
        },
        action: true,
        auto_register: 'c4246ff0-b081-460c-bcc5-b0678012659e'
      });
      break;
    case 2:
      reminders.push({
        message:
          'The patient is eligible to return to the Standard HIV program.',
        title: 'Viremia Program',
        type: 'warning',
        display: {
          banner: true,
          toast: true
        }
      });
      break;
    case 3:
      reminders.push({
        message: 'Patient requires 3 months repeat VL',
        title: 'Viremia Program',
        type: 'warning',
        display: {
          banner: true,
          toast: true
        }
      });
      break;
    default:
      console.info.call(
        'No Viremia Program Reminder For Selected Patient' +
          data.qualifies_enhanced
      );
  }

  return reminders;
}

function dnaReminder(data) {
  let reminders = [];

  if (data.is_infant === 1) {
    switch (data.dna_pcr_reminder) {
      case 1:
        reminders.push({
          message:
            'HIV Exposed Infants require a DNA/PCR test at the age of 0-6 weeks.',
          title: 'DNA/PCR Reminder',
          type: 'warning',
          display: {
            banner: true,
            toast: true
          }
        });
        break;
      case 2:
        reminders.push({
          message:
            'HIV Exposed Infants require a DNA/PCR test at the age of 6 months.',
          title: 'DNA/PCR Reminder',
          type: 'warning',
          display: {
            banner: true,
            toast: true
          }
        });
        break;
      case 3:
        reminders.push({
          message:
            'HIV Exposed Infants require a DNA/PCR test at the age of 12 months.',
          title: 'DNA/PCR Reminder',
          type: 'warning',
          display: {
            banner: true,
            toast: true
          }
        });
        break;
      case 4:
        reminders.push({
          message:
            'HIV Exposed Infants require an Antibody test at the age of 18-24 months.',
          title: 'DNA/PCR Reminder',
          type: 'warning',
          display: {
            banner: true,
            toast: true
          }
        });
        break;
      default:
        console.info.call(
          'No DNA/PCR Reminder For Selected Patient' + data.dna_pcr_reminder
        );
    }
  }

  return reminders;
}

function dstReminders(data) {
  // console.log('dstRemindersdata', data);

  let reminders = [];
  if (data.has_dst_result === 1) {
    reminders.push({
      message:
        'New DRT/DST Image result: (collected on ' +
        Moment(data.test_date).format('DD-MM-YYYY') +
        ').',
      title: 'DRT/DST Reminders',
      type: 'success',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function geneXpertReminders(data) {
  let reminders = [];
  if (data.has_gene_xpert_result === 1) {
    reminders.push({
      message:
        'New GeneXpert Image result: (collected on ' +
        Moment(data.test_date).format('DD-MM-YYYY') +
        ').',
      title: 'GeneXpert Reminders',
      type: 'success',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function getIptCompletionReminder(data) {
  let reminders = [];

  if (data.not_completed_ipt) {
    reminders.push({
      message:
        'Patient started IPT on ' +
        Moment(data.ipt_start_date).format('DD-MM-YYYY') +
        ' and was supposed to be completed on ' +
        Moment(data.ipt_start_date).add(6, 'months').format('DD-MM-YYYY'),
      title: 'IPT Completion Reminder',
      type: 'warning',
      display: {
        banner: true,
        toast: true
      }
    });
  } else {
    console.info.call('No IPT Completion Reminder For Selected Patient');
  }

  return reminders;
}

function getFamilyTestingReminder(data) {
  let reminders = [];
  return getEncountersByEncounterType(data[0].person_uuid).then((res) => {
    if (res.results.length === 0) {
      reminders.push({
        message:
          'No contact tracing has been done for this index, please fill the contact tracing form',
        title: 'Contact Tracing Reminder',
        type: 'warning',
        display: {
          banner: true,
          toast: true
        },
        action: true,
        addContacts: true
      });
      return reminders;
    } else if (res.results.length > 0) {
      let months = 0;
      if (res.results[0].auditInfo.dateChanged != null) {
        months = Moment().diff(res.results[0].auditInfo.dateChanged, 'months');
      } else {
        months = Moment().diff(res.results[0].encounterDatetime, 'months');
      }
      if (months > 6) {
        reminders.push({
          message:
            "It's been six months since the patient's contacts were last updated, click update to add more contacts",
          title: 'Contact Tracing Reminder',
          type: 'info',
          display: {
            banner: true,
            toast: true
          },
          action: true,
          updateContacts: true
        });
      }
      return reminders;
    }
  });
}

function ovcUnenrollmentReminder(data) {
  let reminders = [];
  return getPatientPrograms(data.person_uuid, {
    openmrsBaseUrl: ''
  }).then((programs) => {
    if (programs.results.length > 0) {
      _.each(programs.results, function (result) {
        if (
          result.program.uuid === '781d8768-1359-11df-a1f1-0026b9348838' &&
          result.dateCompleted == null &&
          calculateAge(data.birth_date) > 19
        ) {
          reminders.push({
            message:
              'Patient is 20 years or older, qualifies to be transitioned out of OVC',
            title: 'OVC Transition Reminder',
            type: 'info',
            display: {
              banner: true,
              toast: true
            }
          });
        }
      });
    }
    return reminders;
  });
}

function generateContraceptionRefillReminder(data) {
  let reminders = [];
  const years = Moment(data.last_encounter_date, 'DD-MM-YYYY').diff(
    Moment(data.modern_contraceptive_method_start_date, 'DD-MM-YYYY'),
    'years'
  );
  if (data.due_for_contraception_refill) {
    if (data.contraceptive_method == 9510 && years > 3) {
      return reminders;
    }
    if (data.contraceptive_method == 9511 && years > 5) {
      return reminders;
    }
    if (
      (data.contraceptive_method == 9734 ||
        data.contraceptive_method == 9735) &&
      years > 10
    ) {
      return reminders;
    }
    reminders.push({
      message:
        'Patient was last screened on ' +
        Moment(data.modern_contraceptive_reporting_date).format('DD-MM-YYYY') +
        ' and is due for a followup screening',
      title: 'Modern Contraception screening reminder',
      type: 'warning',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function generateStartContraceptionReminder(data) {
  let reminders = [];

  if (data.not_on_modern_contraception) {
    reminders.push({
      message:
        'Female client within the reproductive age but not started on any contraception',
      title: 'Contraception start reminder',
      type: 'info',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function generateDiscontinueContraceptionReminder(data) {
  let reminders = [];

  if (data.has_contraception_expired) {
    reminders.push({
      message:
        'Patient started ' +
        data.contraception_method_name +
        ' on ' +
        data.modern_contraceptive_method_start_date +
        ' and needs discontinuation since it expired on ' +
        getFPExpiryDate(data) +
        '',
      title: 'Contraception discontinuation reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}

function getFPExpiryDate(data) {
  if (data.contraceptive_method == 9510) {
    return Moment(data.modern_contraceptive_method_start_date, 'DD-MM-YYYY')
      .add(3, 'years')
      .format('DD-MM-YYYY');
  }
  if (data.contraceptive_method == 9511) {
    return Moment(data.modern_contraceptive_method_start_date, 'DD-MM-YYYY')
      .add(5, 'years')
      .format('DD-MM-YYYY');
  }
  if (data.contraceptive_method == 9734 || data.contraception_method == 9735) {
    return Moment(data.modern_contraceptive_method_start_date, 'DD-MM-YYYY')
      .add(10, 'years')
      .format('DD-MM-YYYY');
  }
}

async function generateReminders(etlResults, eidResults) {
  console.log('REMINDERS generateReminders');
  let reminders = [];
  let patientReminder;
  if (etlResults && etlResults.length > 0) {
    patientReminder = {
      person_id: etlResults[0].person_id,
      person_uuid: etlResults[0].person_uuid
    };
  }

  let data = etlResults[0];

  const person_id = etlResults[0].person_id;
  let new_vl = newViralLoadPresent(data);
  let vl_Errors = viralLoadErrors(data);
  let pending_vl_orders = pendingViralOrder(data);
  let pending_vl_lab_result = pendingViralLoadLabResult(eidResults);
  let qualifies_differenciated_care_reminders = qualifiesDifferenciatedReminders(
    data
  );
  let inh_reminders = inhReminders(data);
  let vl_reminders = viralLoadReminders(data);
  let qualifies_enhanced = qualifiesEnhancedReminders(data);
  let dna_pcr_reminder = dnaReminder(data);
  let dst_result = dstReminders(data);
  let gene_xpert_result = geneXpertReminders(data);
  let not_completed_ipt = getIptCompletionReminder(data);
  let unenrol_ovc_reminder = await ovcUnenrollmentReminder(data);
  let contact_tracing_reminder = await getFamilyTestingReminder(etlResults);

  let cervical_screening_reminder = await getCerivalScreeningReminder(
    person_id
  );
  let due_for_contraception_refill = generateContraceptionRefillReminder(data);
  let not_on_modern_contraception = generateStartContraceptionReminder(data);
  let fp_discontinuation_reminder = generateDiscontinueContraceptionReminder(
    data
  );

  let currentReminder = [];
  if (pending_vl_lab_result.length > 0) {
    currentReminder = pending_vl_lab_result.concat(inh_reminders);
  } else {
    currentReminder = new_vl.concat(
      vl_Errors,
      pending_vl_orders,
      inh_reminders,
      qualifies_differenciated_care_reminders,
      vl_reminders,
      qualifies_enhanced,
      dna_pcr_reminder,
      dst_result,
      gene_xpert_result,
      not_completed_ipt,
      contact_tracing_reminder,
      unenrol_ovc_reminder,
      cervical_screening_reminder,
      due_for_contraception_refill,
      not_on_modern_contraception,
      fp_discontinuation_reminder
    );
  }

  reminders = reminders.concat(currentReminder);

  patientReminder.reminders = reminders;
  return patientReminder;
}

function transformZeroVl(vl) {
  // VL OF Zero to be shown as LDL

  if (vl === 0 || vl === '0') {
    return 'LDL';
  } else {
    return vl;
  }
}

function getEncountersByEncounterType(patient_uuid) {
  const family_testing_encounter = '975ae894-7660-4224-b777-468c2e710a2a';
  return new Promise(function (resolve, reject) {
    encounter_service
      .getEncountersByEncounterType(patient_uuid, family_testing_encounter)
      .then((encounters) => {
        resolve(encounters);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getPatientPrograms(uuid, params) {
  return new Promise((resolve, reject) => {
    program_service
      .getProgramEnrollmentByPatientUuid(uuid, params)
      .then((programs) => {
        resolve(programs);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getCerivalScreeningReminder(personId) {
  return new Promise((resolve, reject) => {
    cervicalCancerScreeningService
      .getPatientLatestCericalScreeningResult(personId)
      .then((result) => {
        console.log(result);
        let reminder = [];
        if (result.size > 0) {
          reminder = generateCervicalScreeningReminder(result.result[0]);
        }
        resolve(reminder);
      })
      .catch((error) => {
        resolve([]);
        console.log('Error', error);
      });
  });
}

function generateCervicalScreeningReminder(data) {
  let reminders = [];
  if (data.qualifies_for_via_or_via_vili_retest === 1) {
    reminders.push({
      message:
        'Patient is due for a repeat cervical cancer screening test. Last test result was Normal on ' +
        Moment(data.test_datetime).format('DD-MM-YYYY') +
        '.',
      title: 'Cervical Cancer Screening Reminder',
      type: 'danger',
      display: {
        banner: true,
        toast: true
      }
    });
  }
  return reminders;
}
