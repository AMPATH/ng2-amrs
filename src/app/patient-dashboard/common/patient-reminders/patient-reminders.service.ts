import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';

@Injectable()
export class PatientReminderService {
  constructor(private patientReminderResourceService: PatientReminderResourceService) {
  }

  public getPatientReminders(patientUuid: string): Observable<any> {
    const reminders: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    const sub =
      this.patientReminderResourceService.getPatientLevelReminders(patientUuid)
      .take(1).subscribe(
      (data) => {
        sub.unsubscribe();
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
        sub.unsubscribe();
      });
    return reminders.asObservable();
  }
}
