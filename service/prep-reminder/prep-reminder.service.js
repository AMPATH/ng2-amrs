import moment from 'moment';
var programEnrollment = require('../openmrs-rest/program.service');

export class PrepReminderService {
  async isPatientEnrolledInPrep(patient) {
    let enrolledToPrep = false;
    await programEnrollment
      .getProgramEnrollmentByPatientUuid(patient.patientUuid, {
        openmrsBaseUrl: ''
      })
      .then((programs) => {
        _.each(programs.results, (p) => {
          if (
            p != null &&
            p.program.uuid === 'c19aec66-1a40-4588-9b03-b6be55a8dd1d'
          ) {
            enrolledToPrep = true;
          }
        });
      });
    return enrolledToPrep;
  }

  generateReminders = (data) => {
    let reminders = [];

    let rapidTestReminder = this.generateRapidTestReminder(data[0]);
    let initialRapidTestReminder = this.generateInitialRapidTestReminder(
      data[0]
    );

    return reminders.concat(rapidTestReminder, initialRapidTestReminder);
  };

  generateRapidTestReminder = (data) => {
    let reminders = [];

    if (data.due_for_hiv_rapid_test) {
      reminders.push({
        message:
          'Patient is due for repeat HIV test on ' +
          moment(data.rapid_test_date).add(90, 'days').format('DD-MM-YYYY') +
          '. Patient on PrEP requires a HIV test after 3 months. Last HIV test done on ' +
          moment(data.rapid_test_date).format('DD-MM-YYYY') +
          ' was ' +
          data.hiv_rapid_test_value +
          '.',
        title: 'HIV Rapid Test Reminder',
        type: 'warning',
        display: {
          banner: true,
          toast: true
        }
      });
    } else {
      console.info.call('No HIV Rapid Test Reminder For Selected Patient');
    }
    return reminders;
  };

  generateInitialRapidTestReminder = (data) => {
    let reminders = [];

    if (data.hiv_rapid_test_result == null) {
      let days_since_enrolment_date = 0;

      if (data.enrollment_date != '1900-01-01') {
        days_since_enrolment_date = data.days_since_enrolment_date;
      } else {
        days_since_enrolment_date = data.days_since_initial_date;
      }
      reminders.push({
        message:
          'Patient requires HIV test done. Patient on PrEP for the last ' +
          days_since_enrolment_date +
          ' days with no HIV test results.',
        title: 'HIV Rapid Test Reminder',
        type: 'warning',
        display: {
          banner: true,
          toast: true
        }
      });
    } else {
      console.info.call('No HIV Rapid Test Reminder For Selected Patient');
    }
    return reminders;
  };
}
