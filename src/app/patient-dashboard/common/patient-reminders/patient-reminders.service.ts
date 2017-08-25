import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';

@Injectable()
export class PatientReminderService {
  constructor(private patientReminderResourceService: PatientReminderResourceService) {
  }

  public getPatientReminders(patientUuid: string): Observable<any> {
    let reminders: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let clinicalReminders =
      this.patientReminderResourceService.getPatientLevelReminders(patientUuid);
    clinicalReminders.subscribe(
      (data) => {
        console.log('Clinical Reminders', data);
        if (data && data.reminders.length > 0) {
          let remindersObj = {
            personUuid: data.person_uuid,
            generatedReminders : data.reminders
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
}
