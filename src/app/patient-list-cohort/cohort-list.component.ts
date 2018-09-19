import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../openmrs-api/user.service';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortListService } from './cohort-list.service';
import { User } from '../models/user.model';
import { UserCohortResourceService } from '../etl-api/user-cohort-resource.service';

@Component({
  selector: 'patient-list-cohort',
  templateUrl: './cohort-list.component.html',
  styleUrls: ['./cohort-list.component.css']
})
export class CohortListComponent implements OnInit {

  public isBusy: boolean = false;
  public selectedCohortListUuid: any;
  public selectedCohortListName: any;
  public fetchingResults: boolean = false;
  public isLoading: boolean = false;
  public filterTerm: string = '';
  public cohortList: any;
  public user: User;
  public fetchError: boolean = false;
  public isSelectedCohort: any;
  public displayConfirmDialog: boolean = false;
  public showSuccessAlert: boolean = false;
  public showErrorAlert: boolean = false;
  public successAlert: string;
  public errorAlert: string;
  public errorTitle: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private cohortResourceService: CohortResourceService,
              private cohortListService: CohortListService,
              private userService: UserService,
              private userCohortResourceService: UserCohortResourceService) {
    this.user = this.userService.getLoggedInUser();

  }

  public ngOnInit() {
    this.getCohortList();
  }
  public getCohortList() {
    this.fetchingResults = true;
    let sub = this.userCohortResourceService.getUserCohorts(this.user.uuid);
    if ( sub ) {
       sub.take(1).subscribe(
         (cohorts) => {
            if (cohorts) {
           this.cohortList = cohorts.result;
           this.fetchingResults = false;
            }

         },
         (error) => {
           this.fetchError = true;

         }
       );
     }

  }
  public valueChange(newValue) {
    this.filterTerm = newValue;
  }
  public openConfirmDialog(cohort) {
    this.selectedCohortListUuid = cohort.uuid;
    this.selectedCohortListName = cohort.name;
    this.displayConfirmDialog = true;

  }
  public closeConfirmationDialog() {
    this.displayConfirmDialog = false;
  }
  public voidCohortList() {
    if (this.selectedCohortListUuid) {
      this.cohortResourceService.retireCohort(this.selectedCohortListUuid).take(1).subscribe(
        (success) => {
          this.displayConfirmDialog = false;
          this.displaySuccessAlert('Cohort list deleted successfully');
          this.getCohortList();
        },
        (error) => {
          console.error('The request failed because of the following ', error);
          this.displayErrorAlert('Error!',
            'System encountered an error while deleting the cohort. Please retry.');
        });
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
    setTimeout(() => {
      this.showErrorAlert = false;
    }, 3000);
  }
  public getCohortListToEdit(uuid, description, name) {
    this.isSelectedCohort = {
      uuid: uuid,
      description: description,
      name: name
    };
    this.cohortListService.setData(this.isSelectedCohort);
    this.router.navigate(['patient-list-cohort/cohort/' +
    this.isSelectedCohort.uuid + '/edit-cohort']);
  }
  public addNewCohort() {
    this.router.navigate(['patient-list-cohort/cohort/add-cohort']);
  }
  public viewCohortListMembers(list) {
    this.isSelectedCohort = {
      uuid: list.uuid,
      description: list.description,
      name: list.name,
      role: list.role
    };
    this.cohortListService.setData(this.isSelectedCohort);
    this.router.navigate(['patient-list-cohort/cohort/' +
    this.isSelectedCohort.uuid + '/member']);

  }
  public shareCohortList(uuid, description, name) {
    this.isSelectedCohort = {
      uuid: uuid,
      description: description,
      name: name
    };
    this.cohortListService.setData(this.isSelectedCohort);
    this.router.navigate(['patient-list-cohort/cohort/' +
    this.isSelectedCohort.uuid  + '/share-cohort']);
  }

}
