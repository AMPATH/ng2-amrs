import { Component, OnInit } from '@angular/core';
import { catchError, finalize, map, switchMap, take } from 'rxjs/operators';
import { HealthInformationExchangeService } from 'src/app/hie-api/health-information-exchange.service';
import {
  Practitioner,
  PractitionerSearchParams
} from '../../models/practitioner.model';
import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
import { UserService } from '../../openmrs-api/user.service';
import { IdentifierTypesUuids } from 'src/app/constants/identifier-types';
import { EMPTY } from 'rxjs';
import { UserDefaultPropertiesService } from '../../user-default-properties/user-default-properties.service';

@Component({
  selector: 'app-practitioner-details',
  styleUrls: ['./practitioner-details.component.css'],
  templateUrl: './practitioner-details.component.html'
})
export class PractitionerDetailsComponent implements OnInit {
  practitioner: Practitioner;
  showSuccessAlert = false;
  successAlert = '';
  showErrorAlert = false;
  errorAlert = '';
  showLoader = false;
  loadingMessage = null;
  public currentUsertLocation: { uuid: string; display: string };

  constructor(
    private userService: UserService,
    private providerResourceService: ProviderResourceService,
    private hieService: HealthInformationExchangeService,
    private userDefaultPropertiesService: UserDefaultPropertiesService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.getUserCurrentLocation();
  }
  getUserCurrentLocation() {
    this.currentUsertLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
  }
  getCurrentUser() {
    const user = this.userService.getLoggedInUser();
    if (user && user.person.uuid) {
      this.getPractitionerByPersonUuid(user.person.uuid);
    }
  }
  getPractitionerByPersonUuid(personUuid: string) {
    this.resetAlerts();
    this.displayLoader('Fetching practitioner details..pplease wait');
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
          if ('contacts' in data) {
            this.practitioner = data;
            this.displaySuccessAlert('Successfully fetched practitioner data');
            return EMPTY;
          }
        }),
        catchError((error: any) => {
          const errorMsg = this.handleError(error);
          this.displayErrorAlert(errorMsg);
          throw error;
        }),
        finalize(() => {
          this.hideLoader();
        })
      )
      .subscribe();
  }
  handleError(error: any): string {
    let errorMsg = '';
    if (error.error && error.error.error) {
      errorMsg = error.error.error;
    } else if (error.message) {
      errorMsg = error.message;
    } else {
      errorMsg =
        'An error occurred while fetching practitioner details, please refresh or contact admin';
    }
    return errorMsg;
  }
  getPractionerByNationalId(nationalId: string) {
    const searchParams: PractitionerSearchParams = {
      nationalId: nationalId,
      locationUuid: this.currentUsertLocation.uuid
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
  isExpired(licesenseExpireDate: string) {
    return new Date() > new Date(licesenseExpireDate);
  }
  displayErrorAlert(message: string) {
    this.errorAlert = message;
    this.showErrorAlert = true;
  }
  displaySuccessAlert(message: string) {
    this.successAlert = message;
    this.showSuccessAlert = true;
  }
  resetAlerts() {
    this.errorAlert = null;
    this.showErrorAlert = false;
    this.successAlert = null;
    this.showSuccessAlert = false;
  }
  displayLoader(message: string) {
    this.showLoader = true;
    this.loadingMessage = message;
  }
  hideLoader() {
    this.showLoader = false;
    this.loadingMessage = null;
  }
}
