import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CohortListService } from './cohort-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../openmrs-api/user.service';
import { CohortUserResourceService } from '../etl-api/cohort-list-user-resource.service';

@Component({
  selector: 'share-cohort-list',
  templateUrl: 'share-cohort-list.component.html',
  styleUrls: ['./share-cohort.css']
})

export class ShareCohortListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  public selectedCohortName: string;
  public selectedCohortDescription: string;
  public selectedCohortUuid: string;
  isCreateNewUser: boolean = true;
  isUseList: boolean = false;
  selectedUser: any;
  selectedUserToBind: any;
  preferredRole: string;
  selectedCohortUserId: string;
  selectedCohortUserName: string;
  userRole: string;
  cohortUsers: any;
  filterTerm: string = '';
  fetchingResults: boolean = true;
  userAssignedRole: string;
  private successAlert: string = '';
  private displayConfirmDialog: boolean = false;
  private showSuccessAlert: boolean = false;
  private showErrorAlert: boolean = false;
  private errorAlert: string;
  private errorTitle: string;

  private roles = [
    { label: 'Edit', value: 'edit' },
    { label: 'View', value: 'view' }];

  constructor(private userService: UserService,
              private cohortListService: CohortListService,
              private router: Router,
              private cohortUserResourceService: CohortUserResourceService,
              private route: ActivatedRoute) { }
  ngOnInit() {
    let cohortUuid = this.route.snapshot.params['cohort_uuid'];
    if (cohortUuid) {
      this.selectedCohortUuid = cohortUuid;
    }
    this.getCohortListToShare();
    this.getCohortUsers();



  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();

    }
  }
  getCohortListToShare() {
    this.subscription = this.cohortListService.getData().subscribe(
      data => {
        if (data) {
          this.selectedCohortDescription = data.desc;
           this.selectedCohortUuid = data.uuid;
          this.selectedCohortName = data.name;
          this.userAssignedRole = data.role;
        }

      });


  }
  public getCohortUsers() {
    this.fetchingResults = true;
    let sub = this.cohortUserResourceService.getCohortUser(this.selectedCohortUuid);
    if (sub) {
      sub.subscribe(

        (cohorts) => {
          if (cohorts) {
            this.cohortUsers = cohorts;
            this.fetchingResults = false;
          }

        },
        (error) => {
          console.log('error', error);
          this.displayErrorAlert('Error!',
            'System encountered an error while fetching cohort user role. Please retry.');
          this.fetchingResults = false;

        }
      );
    }

  }
  public setPreferredRole(preferredRole) {
    this.preferredRole = preferredRole;
  }
  getSelectedUser($event) {
    if ($event) {
      this.selectedUserToBind = $event.label;
      this.selectedUser = $event;
    }
  }
  isAddButton() {
    this.preferredRole = '';
    this.selectedUserToBind = '';
    this.selectedUser = {};
    this.isCreateNewUser = false;
    this.isUseList = true;

  }
  public ShareCohortWithNewUser() {
    let cohortUserPayload = {
      role: this.preferredRole,
      user: this.selectedUser.value,
      cohort: this.selectedCohortUuid
    };
    this.cohortUserResourceService.createCohortUser(cohortUserPayload).subscribe(
      (success) => {
        if (success) {
          this.displaySuccessAlert('Cohort sharing has been done successfully');
          this.getCohortUsers();
          this.isUseList = false;
          this.isCreateNewUser = true;
        }

      },
      (error) => {
        console.log('error', error);
        this.displayErrorAlert('Error!',
          'System encountered an error while sharing the cohort. Please retry.');
      }
    );

  }
  cancelSharing() {
    this.isUseList = false;
    this.isCreateNewUser = true;

  }
  public openConfirmDialog(user) {
    this.selectedCohortUserId = user.cohort_user_id;
    this.selectedCohortUserName = user.username;
    this.displayConfirmDialog = true;

  }
  public closeConfirmationDialog() {
    this.displayConfirmDialog = false;
  }

  public deleteCohortUser() {
    this.displayConfirmDialog = false;
    if (this.selectedCohortUserId) {
      this.cohortUserResourceService.voidCohortUser(this.selectedCohortUserId).subscribe(
        (success) => {
          if (success) {
            this.displayConfirmDialog = false;
            this.displaySuccessAlert('cohort user deleted successfully');
            this.getCohortUsers();
          }

        },
        (error) => {
          console.error('The request failed because of the following ', error);
          this.displayErrorAlert('Error!',
            'System encountered an error while deleting the cohort. Please retry.');
        });
    }
  }
  canEdit(user) {
    this.selectedCohortUserId = user.cohort_user_id;
    this.userRole = 'edit';
    this.updateCohortUserRole(this.selectedCohortUserId, this.userRole);
  }
  canView(user) {
    this.selectedCohortUserId = user.cohort_user_id;
    this.userRole = 'view';
    this.updateCohortUserRole(this.selectedCohortUserId, this.userRole);

  }
  updateCohortUserRole(userId, role) {
    let cohortUserPayload = {
      role : role
    };

    this.cohortUserResourceService.updateCohortUser(userId, cohortUserPayload).subscribe(
      (success) => {
        if (success) {
          this.displaySuccessAlert('Cohort user role  updated successfully');
          this.getCohortUsers();
          this.isUseList = false;
          this.isCreateNewUser = true;
        }

      },
      (error) => {
        console.log('error', error);
        this.displayErrorAlert('Error!',
          'System encountered an error while updating cohort user role. Please retry.');
      }
    );
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
  valueChange(newValue) {
    this.filterTerm = newValue;
  }
}
