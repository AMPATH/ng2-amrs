
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, Params }    from '@angular/router';

import { UserService } from '../openmrs-api/user.service';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortListService } from './cohort-list.service';
import { CohortMemberResourceService } from '../openmrs-api/cohort-member-resource.service';


@Component({
  selector: 'patient-list-cohort',
  templateUrl: './cohort-list.component.html',
  styleUrls: ['./cohort-list.component.css']
})
export class CohortListComponent implements OnInit {

  public isBusy: boolean = false;
  public selectedCohortListUuid: any;
  fetchingResults: boolean = false;
  public isLoading: boolean = false;
  filterTerm: string = '';
  cohortList: any;
  fetchError: boolean = false;
  isSelectedCohort: any;
  private displayConfirmDialog: boolean = false;
  private showSuccessAlert: boolean = false;
  private showErrorAlert: boolean = false;
  private successAlert: string;
  private errorAlert: string;
  private errorTitle: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private cohortResourceService: CohortResourceService,
              private cohortListService: CohortListService) {

  }

  ngOnInit() {
    this.getCohortList();
  }
  getCohortList() {
    this.fetchingResults = true;
   let sub = this.cohortResourceService.getAllCohorts();
   if (sub) {
     sub.subscribe(
       (cohorts) => {
         // if (cohorts) {
         console.log('cohorts', cohorts);
         this.cohortList = cohorts.results;

         this.fetchingResults = false;
         //  }

       },
       (error) => {
         this.fetchError = true;

       }
     );
   }

  }
  valueChange(newValue) {
    this.filterTerm = newValue;
  }
  public openConfirmDialog(uuid) {
    this.selectedCohortListUuid = uuid;
    this.displayConfirmDialog = true;

  }
  public closeConfirmationDialog() {
    this.displayConfirmDialog = false;
  }
  public voidCohortList() {
    if (this.selectedCohortListUuid) {
      this.cohortResourceService.retireCohort(this.selectedCohortListUuid).subscribe(
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
  getCohortListToEdit(uuid, desc, name) {
    this.isSelectedCohort = {
      uuid: uuid,
      desc: desc,
      name: name
    };
    this.cohortListService.setData(this.isSelectedCohort);
    this.router.navigate(['patient-list-cohort/patient-list/edit-cohort-list']);
  }
  addNewCohort() {
    this.router.navigate(['patient-list-cohort/patient-list/add-cohort-list']);
  }
  viewCohortListMembers(uuid, desc, name) {
    this.isSelectedCohort = {
      uuid: uuid,
      desc: desc,
      name: name
    };
    this.cohortListService.setData(this.isSelectedCohort);
    this.router.navigate(['patient-list-cohort/patient-list/cohort-list-members']);


  }



}
