import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { PatientReminderResourceService } from '../../etl-api/patient-reminder-resource.service';
import * as Moment from 'moment';
import * as _ from 'lodash';


@Injectable()
export class PatientReminderService {
  constructor(private patientReminderResourceService: PatientReminderResourceService) {
  }


  getPatientReminders(patientUuid: string): Observable<any> {
    let reminders: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let clinicalReminders =
      this.patientReminderResourceService.getPatientLevelReminders(patientUuid);
    clinicalReminders.subscribe(
      (data) => {
        if (data && data.length > 0) {
          let result = data;
          let generatedReminders = this.generateReminders(result);
          let remindersObj = {
            personUuid: data[0].person_uuid,
            generatedReminders
          };
          reminders.next(remindersObj);
        }
      },
      (error) => {
        reminders.error(error);
        console.error(error);
      });
    return reminders.asObservable();
  }

  generateReminders(results) {
    let reminders = [];
    // viral load follow ups
    _.each(results, (data) => {
      // New Viral Load Present
      if (data.new_viral_load_present) {
        reminders.push({
          message: 'New viral load result: ' + data.viral_load + ' (collected on ' +
          Moment(data.last_vl_date).format('DD/MM/YYYY') + ').',
          title: 'New Viral Load present',
          type: 'success',
          display: {
            banner: true,
            toast: true
          }
        });
      }
      // Viral Load Error
      if (data.ordered_vl_has_error === 1) {
        reminders.push({
          message: 'Viral load test that was ordered on: (' +
          Moment(data.vl_error_order_date).format('DD/MM/YYYY') + ') ' +
          'resulted to an error. Please re-order.',
          title: 'Lab Error Reminder',
          type: 'danger',
          display: {
            banner: true,
            toast: true
          }
        });
      }
      // Pending Viral Load Order
      if (data.overdue_vl_lab_order > 0) {
        reminders.push({
          message: 'No result reported for patient\'s viral load test drawn on (' +
          Moment(data.vl_order_date).format('DD/MM/YYYY') + ') days ago' +
          ' Please follow up with lab or redraw new specimen.',
          title: 'Overdue Viral Load Order',
          type: 'danger',
          display: {
            banner: true,
            toast: true
          }
        });
      }
      // INH Treatment Reminder - first 5 months
      if (data.is_on_inh_treatment && data.inh_treatment_days_remaining > 30 &&
        data.inh_treatment_days_remaining < 150) {
        reminders.push({
          message: 'Patient started INH treatment on (' +
          Moment(data.tb_prophylaxis_start_date).format('DD/MM/YYYY') + ')' +
          'Expected to end on (' +
          Moment(data.tb_prophylaxis_end_date).format('DD/MM/YYYY') + ')'
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
      // INH Treatment Reminder - last mont
      if (data.is_on_inh_treatment && data.inh_treatment_days_remaining <= 30 &&
        data.inh_treatment_days_remaining > 0) {
        reminders.push({
          message: 'Patient has been on INH treatment for the last 5 months, expected to end on (' +
          Moment(data.tb_prophylaxis_end_date).format('MM/DD/YYYY') + ')',
          title: 'INH Treatment Reminder',
          type: 'danger',
          display: {
            banner: true,
            toast: true
          }
        });
      }

      let labMessage: string = 'Last viral load: none';
      if (data.last_vl_date) {
        labMessage = 'Last viral load: ' + data.viral_load + ' on ' +
          '(' + Moment(data.last_vl_date).format('DD/MM/YYYY') + ')' + ' ' +
          data.months_since_last_vl_date + ' months ago.';
      }

      switch (data.needs_vl_coded) {
        case 1:
          reminders.push({
            message: 'Patient requires viral load. Viral loads > 1000 ' +
            'must be repeated in three months. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
              banner: true,
              toast: true
            }
          });
          break;
        case 2:
          reminders.push({
            message: 'Patient requires viral load. Patients newly on ART require ' +
            'a viral load test every 6 months. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
              banner: true,
              toast: true
            }
          });
          break;
        case 3:
          reminders.push({
            message: 'Patient requires viral load. Patients on ART > 1 year require ' +
            'a viral load test every year. ' + labMessage,
            title: 'Viral Load Reminder',
            type: 'danger',
            display: {
              banner: true,
              toast: true
            }
          });
          break;
        default:
          console.info.call('No Clinical Reminder For Selected Patient' + data.needs_vl_coded);
      }
    });
    return reminders;
  }
}
