import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HealthInformationExchangeService } from 'src/app/hie-api/health-information-exchange.service';
import { Practitioner, Providers } from 'src/app/models/practitioner.model';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';

@Component({
  selector: 'app-practitioner-search',
  templateUrl: './practitioner-search.component.html',
  styleUrls: ['./practitioner-search.component.css']
})
export class PractitionerSearchComponent {
  searchForm: FormGroup;
  providers: Providers[] = [];
  allProviders: Providers[] = [];
  isLoading = false;
  searchPerformed = false;
  selectedPractitioner: Practitioner | null = null;
  showModal = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private practitionerService: HealthInformationExchangeService,
    private propertyLocationService: UserDefaultPropertiesService
  ) {
    this.searchForm = this.fb.group({
      nationalId: ['']
    });
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
    const nationalIdControl = this.searchForm.get('nationalId');
    const nationalId =
      nationalIdControl && nationalIdControl.value
        ? nationalIdControl.value.trim().toLowerCase()
        : '';

    if (!nationalId) {
      this.providers = this.allProviders.length > 0 ? this.allProviders : [];
      this.searchPerformed = false;
      return;
    }

    this.isLoading = true;

    if (this.allProviders.length > 0) {
      this.providers = this.allProviders.filter(
        (provider) =>
          provider.national_id && provider.national_id.includes(nationalId)
      );
      this.isLoading = false;
      this.searchPerformed = true;
    } else {
      this.practitionerService.getProviderByNationalId(nationalId).subscribe({
        next: (providers) => {
          this.providers = providers || [];
          this.isLoading = false;
          this.searchPerformed = true;
          if (nationalIdControl) {
            nationalIdControl.setValue('');
          }
        },
        error: () => {
          this.isLoading = false;
          this.providers = [];
          this.searchPerformed = true;
        }
      });
    }
  }

  onReset(): void {
    this.searchForm.reset();
    this.providers = this.allProviders;
    this.providers = [];
    this.searchPerformed = false;
  }

  viewProviderDetails(provider: any): void {
    this.isLoading = true;
    const searchParams = { nationalId: provider.national_id };

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
