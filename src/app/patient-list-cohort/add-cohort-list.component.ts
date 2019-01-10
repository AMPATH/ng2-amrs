/* tslint:disable:no-inferrable-types */
import {take} from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { Router } from '@angular/router';
import { CohortListService } from './cohort-list.service';

@Component({
  selector: 'add-cohort-list',
  templateUrl: 'add-cohort-list.component.html',
  styleUrls: [],
})
export class AddCohortListComponent implements OnInit, OnDestroy {

  public subscription: Subscription;
  public name: string;
  public description: string;
  public errors: any = [];
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public successAlert: string;
  public errorAlert: string;
  public errorTitle: string;

  constructor(private cohortResourceService: CohortResourceService, private router: Router,
              private cohortListService: CohortListService) { }
  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
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
      const cohortListPayload = {
            name: this.name,
            description: this.description,
            memberIds: []
      };
      this.cohortResourceService.addCohort( cohortListPayload).pipe(take(1)).subscribe(
        (success) => {
          this.displaySuccessAlert('Successfully added cohort');
          if ( success ) {
            success['role'] = 'admin';
            this.cohortListService.setData(success);
            // this.router.navigate(['/patient-list-cohort/cohort']);
            this.router.navigate(['patient-list-cohort/cohort/' +
            success.uuid + '/member']);
          }

        },
        (error) => {
          console.error('error', error);
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
