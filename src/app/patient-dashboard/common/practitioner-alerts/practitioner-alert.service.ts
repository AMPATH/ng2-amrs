import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { UserService } from '../../../openmrs-api/user.service';
import { HealthInformationExchangeService } from 'src/app/hie-api/health-information-exchange.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import {
  License,
  Practitioner,
  PractitionerAlert,
  PractitionerSearchParams
} from '../../../models/practitioner.model';
import { IdentifierTypesUuids } from 'src/app/constants/identifier-types';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PractitionerAlertService {
  private alertsSubj = new BehaviorSubject<PractitionerAlert[]>([]);
  public alerts$ = this.alertsSubj.asObservable();

  constructor(
    private userService: UserService,
    private hieService: HealthInformationExchangeService,
    private providerResourceService: ProviderResourceService
  ) {}

  getUserAlerts() {
    const user = this.getCurrentUser();
    if (user && user.person.uuid) {
      this.getPractitionerAlertsByPersonUuid(user.person.uuid);
    }
  }

  getCurrentUser() {
    const user = this.userService.getLoggedInUser();
    return user;
  }
  getPractitionerAlertsByPersonUuid(personUuid: string) {
    this.providerResourceService
      .getProviderByPersonUuid(personUuid)
      .pipe(
        take(1),
        map((res) => {
          if (res && res.attributes) {
            return this.getNationalIdFromIdentifiers(res.attributes);
          } else {
            throw new Error('Practitioner National ID not set');
          }
        }),
        switchMap((res) => {
          if (!res) {
            throw new Error('Practitioner data could not be found');
          } else {
            return this.getPractionerByNationalId(res);
          }
        }),
        map((res) => {
          const data = res[0];
          if ('error' in data) {
            throw new Error('Practitioner data could not be found');
          }
          return data;
        }),
        tap((res: Practitioner) => {
          if (res.licenses) {
            const reminders = this.generatePractionerReminders(res.licenses);
            this.emitAlert(reminders);
          }
        }),
        catchError((error: Error) => {
          throw error;
        })
      )
      .subscribe();
  }
  getPractionerByNationalId(nationalId: string) {
    const searchParams: PractitionerSearchParams = {
      nationalId: nationalId
    };
    return this.hieService.searchPractitioners(searchParams);
  }
  getNationalIdFromIdentifiers(identifiers: any[]): string | null {
    const identifier = identifiers.filter((id) => {
      return (
        id.attributeType.uuid === IdentifierTypesUuids.PROVIDER_NATIONAL_ID_UUID
      );
    });
    return identifier.length > 0 ? identifier[0].value : null;
  }
  generatePractionerReminders(licenses: License[]): PractitionerAlert[] {
    const alerts: PractitionerAlert[] = [];
    for (const license of licenses) {
      if (moment() > moment(license.license_end)) {
        alerts.push({
          type: 'danger',
          title: `Your ${license.license_type} (${license.id}) License expired on ${license.license_end}`,
          message:
            'Please renew the license or sync data to fetch latest details',
          action: 'sync'
        });
      }
      if (
        moment(license.license_end) > moment() &&
        moment(license.license_end).diff(moment(), 'days') < 30
      ) {
        alerts.push({
          type: 'warning',
          title: `Your ${license.license_type} (${license.id}) License expires on ${license.license_end}`,
          message:
            'Please renew the license or sync data to fetch latest details',
          action: 'sync'
        });
      }
    }
    return alerts;
  }
  emitAlert(alerts: PractitionerAlert[]) {
    this.alertsSubj.next(alerts);
  }
}
