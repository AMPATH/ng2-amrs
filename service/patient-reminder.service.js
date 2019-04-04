'use strict';
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
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
        labMessage = 'Last viral load: ' + transformZeroVl(data.viral_load) + ' on ' +
            '(' + Moment(data.last_vl_date).format('DD-MM-YYYY') + ')' + ' ' +
            data.months_since_last_vl_date + ' months ago.';
    }

    let isAdult = checkAge(new Date(data.birth_date));
    
    if (!isAdult && data.months_since_last_vl_date >= 6) {
        reminders.push({
            message: 'Patient requires viral load. Patients who are between 0-24 years old ' +
            'require a viral load test every 6 months. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
                banner: true,
                toast: true
            }
        });
    } else if (isAdult && data.needs_vl_coded === 2 && data.months_since_last_vl_date >= 6 ) {
        reminders.push({
            message: 'Patient requires viral load. Patients older than 25 years and newly on ART require ' +
            'a viral load test every 6 months. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
                banner: true,
                toast: true
            }
        }); 
    } else if (isAdult && data.needs_vl_coded === 3 && data.months_since_last_vl_date >= 12) {
        reminders.push({
            message: 'Patient requires viral load. Patients older than 25 years and on ART > 1 year require ' +
            'a viral load test every year. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
                banner: true,
                toast: true
            }
        });
    } else if (data.is_pregnant === 1 && data.needs_vl_coded === 4 && data.viral_load < 1000 && data.viral_load === null) {
        reminders.push({
            message: 'Patient requires viral load. A pregnant woman newly on ART requires ' +
            'a viral load test at 3 months. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
                banner: true,
                toast: true
            }
        });
    } else if (data.is_pregnant === 1 && data.needs_vl_coded === 4 && data.viral_load >= 1000 && data.last_vl_date >= 3) {
        reminders.push({
            message: 'Patient requires viral load. A pregnant woman newly on ART and VL > 1000 year requires ' +
            'a viral load test every 3 months. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
                banner: true,
                toast: true
            }
        });
    } else if (data.is_pregnant === 1 && data.is_postnatal === 1 && data.needs_vl_coded === 4 && data.last_vl_date >= 3) {
        reminders.push({
            message: 'Patient requires viral load. A postnatal woman newly on ART requires ' +
            'a viral load test every 3 months. ' + labMessage,
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
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    isInfant(dateString);
    if (age <= 24) {
        return false;
    } else {
        return true;
    }
}

function isInfant(dateString) {
    let months = Moment().diff(dateString, 'months');
}

function qualifiesDifferenciatedReminders(data){

    let reminders = [];
    let diffMessage = '';
    if (data.qualifies_differenciated_care) {
        diffMessage = 'Last viral load: ' + transformZeroVl(data.viral_load) + ' on ' +
            '(' + Moment(data.last_vl_date).format('DD-MM-YYYY') + ')' + ' ' +
            data.months_since_last_vl_date + ' months ago.';
    }

    if (data.qualifies_differenciated_care && data.is_postnatal === 0  && data.is_pregnant === 0) {
        reminders.push({
            message: 'Patient qualifies for differentiated care. Viral load is <= 400 and age >= 20. ' + diffMessage,
            title: 'Differentiated Care Reminder',
            type: 'warning',
            display: {
                banner: true,
                toast: true
            },
            auto_register: '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
        });
            
    } else {
        console.info.call('No Differenciated Care Reminder For Selected Patient' + data.qualifies_differenciated_care);
    }
    
    return reminders;

}


function inhReminders(data) {
    let reminders = [];
    try{
        if (data.is_on_inh_treatment && data.inh_treatment_days_remaining > 30 &&
            data.inh_treatment_days_remaining < 150) {
                
            reminders.push({
                message: 'Patient started INH treatment on (' +

                Moment(data.ipt_start_date).format('DD-MM-YYYY') + '). ' +
                'Expected to end on (' +
                Moment(data.ipt_completion_date).format('DD-MM-YYYY') + '). '
                + data.inh_treatment_days_remaining +
                ' days remaining.',
                title: 'INH Treatment Reminder',
                type: 'danger',
                display: {
                    banner: true,
                    toast: true
                }
            });
        }
     } catch(e){
        console.log(e);
    }
    // INH Treatment Reminder - last mont
    if (data.is_on_inh_treatment && data.inh_treatment_days_remaining <= 30 &&
        data.inh_treatment_days_remaining > 0) {
        reminders.push({
            message: 'Patient has been on INH treatment for the last 5 months, expected to end on (' +
            Moment(data.ipt_completion_date).format('MM-DD-YYYY') + ') ',
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
            message: 'Viral load test that was ordered on: (' +
            Moment(data.vl_error_order_date).format('DD-MM-YYYY') + ') ' +
            'resulted to an error. Please re-order.',
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
            message: 'No result reported for patient\'s viral load test drawn on (' +
            Moment(data.vl_order_date).format('DD-MM-YYYY') + ') days ago' +
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
            message: 'New viral load result: ' + transformZeroVl(data.viral_load) + ' (collected on ' +
            Moment(data.last_vl_date).format('DD-MM-YYYY') + ').',
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
    let incompleteResult = eidResults.find((result)=>{
        return result.sample_status === 'Incomplete';
            });
  let reminders = [];
  //let data = _.last(eidResults.viralLoad);
  if (incompleteResult) {
    let dateSplit = incompleteResult.date_collected.split('-');
    let dateCollected = Moment(incompleteResult.date_collected);
    reminders.push({
      message: 'Patient lab Order No.' + incompleteResult.order_number + ' is currently being processed. Sample' +
      ' collected on ' + dateCollected.format('DD-MM-YYYY') + ').',
      title  : 'Pending Lab Order Result',
      type   : 'info',
      display: {
        banner: true,
        toast : true
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
                message: 'The Patient’s viral load is greater than 400. Patients with viral load greater than 400 should be enrolled in the Viremia Program.',
                title: 'Viremia Program',
                type: 'warning',
                display: {
                    banner: true,
                    toast: true
                },
                auto_register: 'c4246ff0-b081-460c-bcc5-b0678012659e'
            });
            break;
        case 2:
            reminders.push({
                message: 'The patient is eligible to return to the Standard HIV Program.',
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
            console.info.call('No Viremia Program Reminder For Selected Patient' + data.qualifies_enhanced);
        
    }

    return reminders;

}

function dnaReminder(data) {
    let reminders = [];

    if (data.is_infant === 1) {
        switch (data.dna_pcr_reminder) {
            case 1:
                reminders.push({
                    message: 'HIV Exposed Infants require a DNA/PCR test at the age of 0-6 weeks.',
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
                    message: 'HIV Exposed Infants require a DNA/PCR test at the age of 6 months.',
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
                    message: 'HIV Exposed Infants require a DNA/PCR test at the age of 12 months.',
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
                    message: 'HIV Exposed Infants require an Antibody test at the age of 18-24 months.',
                    title: 'DNA/PCR Reminder',
                    type: 'warning',
                    display: {
                      banner: true,
                      toast: true
                    }
                });
                break;
            default:
                console.info.call('No DNA/PCR Reminder For Selected Patient' + data.qna_pcr_reminder);
        }
        
    }

    return reminders;

}

function generateReminders(etlResults, eidResults) {
  let reminders = [];
  let patientReminder;
    if (etlResults && etlResults.length > 0 ) {
      patientReminder = {
          person_id: etlResults[0].person_id,
          person_uuid: etlResults[0].person_uuid
      };
  }

  let data = etlResults[0];
  let new_vl = newViralLoadPresent(data);
  let vl_Errors = viralLoadErrors(data);
  let pending_vl_orders = pendingViralOrder(data);
  let pending_vl_lab_result = pendingViralLoadLabResult(eidResults);
  let qualifies_differenciated_care_reminders = qualifiesDifferenciatedReminders(data);
  let inh_reminders = inhReminders(data);
  let vl_reminders = viralLoadReminders(data);
  let qualifies_enhanced = qualifiesEnhancedReminders(data);
  let dna_pcr_reminder = dnaReminder(data);
  let currentReminder = [];
  if(pending_vl_lab_result.length> 0) {
    currentReminder = pending_vl_lab_result.concat(inh_reminders);
  } else {
    currentReminder = new_vl.concat(
      vl_Errors,
      pending_vl_orders,
      inh_reminders,
      qualifies_differenciated_care_reminders,
      vl_reminders,
      qualifies_enhanced,
      dna_pcr_reminder);
  }
  
  reminders = reminders.concat(currentReminder);
  
  patientReminder.reminders = reminders;
  return patientReminder;
}

function transformZeroVl(vl){

    // VL OF Zero to be shown as LDL

    if(vl === 0 || vl === '0'){
        return 'LDL';
    }else{
       return vl;
    } 

}
