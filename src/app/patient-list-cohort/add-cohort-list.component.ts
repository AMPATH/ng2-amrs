import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'add-cohort-list',
  templateUrl: 'add-cohort-list.component.html',
  styleUrls: [],
})
export class AddCohortListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  private name: string;
  private description: string;
  private errors: any = [];
  private showSuccessAlert: boolean = false;
  private showErrorAlert: boolean = false;
  private successAlert: string;
  private errorAlert: string;
  private errorTitle: string;


  constructor(private cohortResourceService: CohortResourceService, private router: Router) { }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  public addCohortList() {
    this.errors = [];
    this.successAlert = '';

    if (this.name === '' || this.name === undefined || this.name === 'undefined') {
      this.displayErrorAlert('Validation Error!',
        'Please fill cohort name field');
    }
    if (this.description === '' || this.description === undefined
      || this.description === 'undefined') {
      this.displayErrorAlert('Validation Error!',
        'Please give the description of the cohort');
    }

    if ( this.name && this.description) {
      let cohortListPayload = {
            name: this.name,
            description: this.description,
            memberIds: []
      };
      this.cohortResourceService.addCohort( cohortListPayload).subscribe(
        (success) => {
          this.displaySuccessAlert('Successfully added cohort');
          if ( success ) {
           console.log('success', success);

            this.router.navigate(['/patient-list-cohort']);
          }
         //  this.successAlert = 'Successfully added cohort';

        },
        (error) => {
          console.log('error', error);
          this.errors.push({
            message: 'error adding cohort'
          });
        }
      );
    }
  }
  public displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }
  public displayErrorAlert(errorTitle, errorMessage) {
    this.showErrorAlert = true;
    this.errorAlert = errorMessage;
    this.errorTitle = errorTitle;
  }
}
