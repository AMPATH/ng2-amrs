import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HealthInformationExchangeService } from 'src/app/hie-api/health-information-exchange.service';
import { Practitioner } from 'src/app/models/practitioner.model';

@Component({
  selector: 'app-practitioner-search',
  templateUrl: './practitioner-search.component.html',
  styleUrls: ['./practitioner-search.component.css']
})
export class PractitionerSearchComponent implements OnInit {
  searchForm: FormGroup;
  practitioners: Practitioner[] = [];
  isLoading = false;
  searchPerformed = false;
  selectedPractitioner: Practitioner | null = null;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private practitionerService: HealthInformationExchangeService
  ) {
    this.searchForm = this.fb.group({
      nationalId: [''],
      name: [''],
      licenseNumber: ['']
    });
  }

  ngOnInit(): void {
    // this.loadAllPractitioners();
  }

  // loadAllPractitioners(): void {
  //   this.isLoading = true;
  //   this.practitionerService.getAllPractitioners().subscribe({
  //     next: (practitioners) => {
  //       this.practitioners = practitioners;
  //       this.isLoading = false;
  //       this.searchPerformed = false;
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      const searchParams = this.searchForm.value;

      this.practitionerService.searchPractitioners(searchParams).subscribe({
        next: (practitioners) => {
          this.practitioners = practitioners;
          this.isLoading = false;
          this.searchPerformed = true;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onReset(): void {
    this.searchForm.reset();
    // this.loadAllPractitioners();
  }

  viewPractitionerDetails(practitioner: Practitioner): void {
    this.selectedPractitioner = practitioner;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPractitioner = null;
  }
}
