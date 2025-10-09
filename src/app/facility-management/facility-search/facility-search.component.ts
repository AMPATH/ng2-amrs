import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, of, Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { Location } from '../../models/location.model';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { LocationAttributeTypeUuids } from '../../constants/location-attribute-types.constants';
import { HealthInformationExchangeService } from '../../hie-api/health-information-exchange.service';
import {
  FacilitySearchFilter,
  FacilitySearchFilterType,
  HieFacility
} from '../../models/hie-registry.model';

enum AlertType {
  Success = 'Success',
  Danger = 'Danger'
}

@Component({
  selector: 'app-facility-search',
  templateUrl: './facility-search.component.html',
  styleUrls: ['./facility-search.component.scss']
})
export class FacilitySearchComponent implements OnInit, OnDestroy {
  filterTypeOptions = [
    {
      label: 'Location',
      value: FacilitySearchFilterType.location
    },
    {
      label: 'Facility/MFL Code',
      value: FacilitySearchFilterType.facilityCode
    },
    {
      label: 'Registration Number',
      value: FacilitySearchFilterType.registrationNumber
    }
  ];
  filterTypes = FacilitySearchFilterType;
  selectedFilter: FacilitySearchFilterType = null;
  facilitySearchFormGroup = new FormGroup({
    filterType: new FormControl(null),
    facility: new FormControl(null),
    value: new FormControl(null)
  });
  private destroy$ = new Subject<boolean>();
  public locations: Location[] = [];
  public locationOptions: { value: string; label: string }[] = [];
  private locationMflMap = new Map<string, string>();
  public facilityResult: HieFacility;
  public alertObj: { message: string; type: string } = {
    message: '',
    type: ''
  };
  public alertType: AlertType;
  public showLoader = false;
  public loadingMessage = '';

  constructor(
    private locationResourceService: LocationResourceService,
    private hieService: HealthInformationExchangeService
  ) {}
  ngOnInit(): void {
    this.getAmrsLocations();
    this.listenToFilterChanges();
    this.listenToLocationChanges();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  getAmrsLocations() {
    this.locationResourceService
      .getLocations()
      .pipe(
        takeUntil(this.destroy$),
        tap((res: Location[]) => {
          console.log({ res });
          this.locations = res;
          this.generateLocationOptions(this.locations);
          this.generateLocationMflMapping(this.locations);
        })
      )
      .subscribe();
  }
  generateLocationOptions(locations: Location[]) {
    this.locationOptions = locations.map((l) => {
      return {
        label: l.name,
        value: l.uuid
      };
    });
  }
  listenToFilterChanges() {
    this.facilitySearchFormGroup
      .get('filterType')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        tap((filterChange) => {
          if (filterChange) {
            this.selectedFilter = filterChange.value;
          }
          this.setFormValue('');
          this.resetFacilityValue();
        })
      )
      .subscribe();
  }
  listenToLocationChanges() {
    this.facilitySearchFormGroup
      .get('facility')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        tap((locationChange) => {
          console.log({ locationChange });
          if (locationChange && locationChange.value) {
            if (this.locationMflMap.has(locationChange.value)) {
              const mflCode = this.locationMflMap.get(locationChange.value);
              this.setFormValue(mflCode);
            } else {
              this.setFormValue('');
            }
          } else {
            this.setFormValue('');
          }
        })
      )
      .subscribe();
  }
  setFormValue(value: string) {
    this.facilitySearchFormGroup.patchValue({
      value: value
    });
  }
  resetFacilityValue() {
    this.facilitySearchFormGroup.patchValue({
      facility: null
    });
  }
  generateLocationMflMapping(locations: any) {
    locations.forEach((location) => {
      const attributes = location.attributes || [];
      if (attributes && attributes.length > 0) {
        attributes.forEach((att) => {
          if (
            att.attributeType.uuid === LocationAttributeTypeUuids.MFL_CODE_UUID
          ) {
            this.locationMflMap.set(location.uuid, att.value);
          }
        });
      }
    });
  }
  searchForFacility() {
    this.resetAlert();
    const data = this.facilitySearchFormGroup.value;
    const payload = this.generatePayload(data);
    const isValidPayload = this.isPayloadValid(payload);
    if (isValidPayload) {
      this.getFacility(payload);
    }
  }
  generatePayload(data: {
    filterType: string;
    value: string;
  }): FacilitySearchFilter {
    const payload = {
      filterType: '',
      filterValue: ''
    };
    if (
      [this.filterTypes.location, this.filterTypes.facilityCode].includes(
        this.selectedFilter
      )
    ) {
      payload.filterType = this.filterTypes.facilityCode;
    }
    if (this.selectedFilter === this.filterTypes.registrationNumber) {
      payload.filterType = this.filterTypes.registrationNumber;
    }
    payload.filterValue = data.value;
    return payload;
  }
  isPayloadValid(payload: FacilitySearchFilter) {
    if (!payload) {
      this.setAlert(
        'Please make sure to enter the MFL Code or pick a facility with an MFL Code',
        AlertType.Danger
      );
      return false;
    }
    if (!payload.filterType) {
      this.setAlert(
        'Please make sure to select the filter type',
        AlertType.Danger
      );
      return false;
    }
    if (!payload.filterValue) {
      this.setAlert('Value is missing', AlertType.Danger);
      return false;
    }
    return true;
  }
  getFacility(facilitySearchDto: FacilitySearchFilter) {
    this.resetAlert();
    this.facilityResult = null;
    this.displayLoader(
      'Fetching facility from Facility Registry ,please wait...'
    );
    this.hieService
      .searchFacility(facilitySearchDto)
      .pipe(
        takeUntil(this.destroy$),
        map((res: any) => {
          if ('error' in res) {
            throw new Error(
              res.error ||
                'An error ocurred while fetching the facility,please try again'
            );
          }
          if (res.message) {
            return res.message;
          } else {
            return null;
          }
        }),
        tap((facility) => {
          if (facility) {
            this.facilityResult = facility;
            this.handleSuccess(
              `${facility.facility_code} has been fetched successfully`
            );
          }
        }),
        finalize(() => {
          this.hideLoader();
        }),
        catchError((err: Error) => {
          this.handleError(err);
          return of(null);
        })
      )
      .subscribe();
  }
  handleSuccess(message: string) {
    this.setAlert(message, AlertType.Success);
  }
  handleError(error: any) {
    const errorMessage = this.getErrorResponseMessage(error);
    this.setAlert(errorMessage, AlertType.Danger);
  }
  private getErrorResponseMessage(error) {
    let msg = 'An error ocurred, please try again or contact support';
    if (error.error) {
      if (error.error.details) {
        msg = error.error.details;
      } else if (error.error.error) {
        msg = error.error.error;
      } else {
        msg = error.error;
      }
    } else if (error.details) {
      msg = error.details;
    } else if (error.message) {
      msg = error.message;
    }
    return msg;
  }
  setAlert(message: string, alertType: AlertType) {
    this.alertObj = {
      message: message,
      type: alertType
    };
  }
  resetAlert() {
    this.alertObj = {
      message: '',
      type: ''
    };
  }
  displayLoader(message: string) {
    this.showLoader = true;
    this.loadingMessage = message;
  }
  hideLoader() {
    this.showLoader = false;
    this.loadingMessage = '';
  }
}
