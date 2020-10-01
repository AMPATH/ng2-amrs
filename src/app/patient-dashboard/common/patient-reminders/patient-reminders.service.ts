import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';

@Injectable()
export class PatientReminderService {
  constructor(
    private patientReminderResourceService: PatientReminderResourceService
  ) {}

  public getPatientReminders(patientUuid: string): Observable<any> {
    return this.patientReminderResourceService
      .getPatientLevelReminders(patientUuid)
      .pipe(
        map((data) => {
          if (data && data.reminders.length > 0) {
            const remindersObj = {
              personUuid: data.person_uuid,
              generatedReminders: data.reminders
            };
            return remindersObj;
          } else {
            return {};
          }
        }),
        catchError((error) => {
          console.error(error);
          return error;
        })
      );
  }
}
