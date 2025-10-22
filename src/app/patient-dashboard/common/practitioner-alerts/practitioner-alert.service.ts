import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { UserService } from '../../../openmrs-api/user.service';
import { HealthInformationExchangeService } from 'src/app/hie-api/health-information-exchange.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import {
  catchError,
  finalize,
  map,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {
  License,
  Practitioner,
  PractitionerAlert,
  PractitionerSearchParams
} from '../../../models/practitioner.model';
import { IdentifierTypesUuids } from '../../../constants/identifier-types';
import * as moment from 'moment';
import { ToastrFunctionService } from '../../../shared/services/toastr-function.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';

@Injectable({
  providedIn: 'root'
})
export class PractitionerAlertService {
  private alertsSubj = new BehaviorSubject<PractitionerAlert[]>([]);
  public alerts$ = this.alertsSubj.asObservable();
  private loadingSub = new Subject<{ loading: boolean; message: string }>();
  public loading$ = this.loadingSub.asObservable();
  private currentUserLocation: { uuid: string; display: string };

  constructor(
    private userService: UserService,
    private hieService: HealthInformationExchangeService,
    private providerResourceService: ProviderResourceService,
    private toasterService: ToastrFunctionService,
    private userDefaultPropertiesService: UserDefaultPropertiesService
  ) {}

  public getUserAlerts(refresh?: boolean) {
    const user = this.getCurrentUser();
    this.currentUserLocation = this.getUserCurrentLocation();
    if (user && user.person.uuid && this.currentUserLocation) {
      this.getPractitionerAlertsByPersonUuid(user.person.uuid, refresh);
    }
  }

  private getUserCurrentLocation() {
    return this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
  }

  private getCurrentUser() {
    const user = this.userService.getLoggedInUser();
    return user;
  }
  private getPractitionerAlertsByPersonUuid(
    personUuid: string,
    refresh?: boolean
  ) {
    this.loadingSub.next({
      loading: true,
      message: 'Fetching practitioner details from HIE....'
    });
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
            return this.getPractionerByNationalId(
              res,
              this.currentUserLocation.uuid,
              refresh
            );
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
        finalize(() => {
          if (refresh) {
            this.toasterService.showToastr(
              'success',
              `Practitioner data successfully updated`,
              'Synced!'
            );
          }
          this.loadingSub.next({
            loading: false,
            message: null
          });
        }),
        catchError((error: Error) => {
          throw error;
        })
      )
      .subscribe();
  }
  private getPractionerByNationalId(
    nationalId: string,
    locationUuid: string,
    refresh?: boolean
  ) {
    const searchParams: PractitionerSearchParams = {
      nationalId: nationalId,
      locationUuid: locationUuid
    };
    if (refresh) {
      searchParams['refresh'] = refresh;
    }
    return this.hieService.searchPractitioners(searchParams);
  }
  private getNationalIdFromIdentifiers(identifiers: any[]): string | null {
    const identifier = identifiers.filter((id) => {
      return (
        id.attributeType.uuid === IdentifierTypesUuids.PROVIDER_NATIONAL_ID_UUID
      );
    });
    return identifier.length > 0 ? identifier[0].value : null;
  }
  private generatePractionerReminders(
    licenses: License[]
  ): PractitionerAlert[] {
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
  private emitAlert(alerts: PractitionerAlert[]) {
    this.alertsSubj.next(alerts);
  }
  public refreshAlerts() {
    this.getUserAlerts(true);
  }
}
