import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HealthInformationExchangeService } from 'src/app/hie-api/health-information-exchange.service';
import {
  Practitioner,
  PractitionerSearchParams,
  Providers
} from '../../models/practitioner.model';
import { UserDefaultPropertiesService } from '../../user-default-properties';

@Component({
  selector: 'app-practitioner-search',
  templateUrl: './practitioner-search.component.html',
  styleUrls: ['./practitioner-search.component.css']
})
export class PractitionerSearchComponent implements OnInit {
  searchForm: FormGroup;
  providers: Providers[] = [];
  allProviders: Providers[] = [];
  isLoading = false;
  searchPerformed = false;
  selectedPractitioner: Practitioner | null = null;
  showModal = false;
  errorMessage: string | null = null;
  public currentUserLocation: { uuid: string; display: string };

  constructor(
    private fb: FormBuilder,
    private practitionerService: HealthInformationExchangeService,
    private propertyLocationService: UserDefaultPropertiesService,
    private userDefaultPropertiesService: UserDefaultPropertiesService
  ) {
    this.searchForm = this.fb.group({
      searchType: ['NATIONAL_ID'],
      searchValue: ['']
    });
  }

  ngOnInit(): void {
    this.getUserCurrentLocation();
  }

  private getUserCurrentLocation() {
    this.currentUserLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
  }

  getAllProviders(): void {
    this.isLoading = true;
    const currentLocation = this.propertyLocationService.getCurrentUserDefaultLocationObject();
    this.practitionerService.getAllProviders(currentLocation.uuid).subscribe({
      next: (providers) => {
        this.allProviders = providers;
        this.providers = providers;
        this.isLoading = false;
        this.searchPerformed = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const searchTypeControl = this.searchForm.get('searchType');
    const searchValueControl = this.searchForm.get('searchValue');

    const searchType =
      searchTypeControl && searchTypeControl.value
        ? searchTypeControl.value
        : 'NATIONAL_ID';
    const searchValue =
      searchValueControl && searchValueControl.value
        ? searchValueControl.value.trim()
        : '';

    if (!searchValue) {
      this.errorMessage = 'Please enter a search value';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      return;
    }

    this.isLoading = true;

    const searchParams: any = {
      locationUuid: this.currentUserLocation.uuid
    };

    switch (searchType) {
      case 'NATIONAL_ID':
        searchParams.nationalId = searchValue;
        break;
      case 'REGISTRATION_NUMBER':
        searchParams.registrationNumber = searchValue;
        break;
      case 'LICENSE_NO':
        searchParams.licenseNumber = searchValue;
        break;
    }

    this.practitionerService.searchPractitioners(searchParams).subscribe({
      next: (practitioners) => {
        if (practitioners && practitioners.length > 0) {
          this.selectedPractitioner = practitioners[0];
          this.showModal = true;
          if (searchValueControl) {
            searchValueControl.setValue('');
          }
        } else {
          this.errorMessage =
            'No practitioner found with the provided search criteria.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.message ||
          'Failed to search practitioner. Please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }
    });
  }

  onReset(): void {
    this.searchForm.reset();
    this.searchForm.patchValue({
      searchType: 'NATIONAL_ID'
    });
    this.providers = [];
    this.searchPerformed = false;
    this.errorMessage = null;
  }

  viewProviderDetails(provider: any): void {
    this.isLoading = true;
    const searchParams: PractitionerSearchParams = {
      nationalId: provider.national_id,
      locationUuid: this.currentUserLocation.uuid
    };

    this.practitionerService.searchPractitioners(searchParams).subscribe({
      next: (practitioners) => {
        if (practitioners && practitioners.length > 0) {
          this.selectedPractitioner = practitioners[0];
          this.showModal = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.message ||
          'Failed to load provider details. Please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPractitioner = null;
  }
}
