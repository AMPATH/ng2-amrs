/* tslint:disable:no-inferrable-types */
import {take} from 'rxjs/operators/take';
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

  public subscription: Subscription;
  public selectedCohortName: string;
  public selectedCohortDescription: string;
  public selectedCohortUuid: string;
  public isCreateNewUser = true;
  public isUseList = false;
  public selectedUser: any;
  public selectedUserToBind: any;
  public preferredRole: string;
  public selectedCohortUserId: string;
  public selectedCohortUserName: string;
  public userRole: string;
  public cohortUsers: any;
  public filterTerm = '';
  public fetchingResults = true;
  public userAssignedRole: string;
  public successAlert = '';
  public displayConfirmDialog = false;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;

  public roles = [
    { label: 'Edit', value: 'edit' },
    { label: 'View', value: 'view' }];

  constructor(private userService: UserService,
              private cohortListService: CohortListService,
              private router: Router,
              private cohortUserResourceService: CohortUserResourceService,
              private route: ActivatedRoute) { }
  public ngOnInit() {
    const cohortUuid = this.route.snapshot.params['cohort_uuid'];
    if (cohortUuid) {
      this.selectedCohortUuid = cohortUuid;
    }
    this.getCohortListToShare();
    this.getCohortUsers();

  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();

    }
  }
  public getCohortListToShare() {
    this.cohortListService.getData().pipe(take(1)).subscribe(
      (data) => {
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
    const sub = this.cohortUserResourceService.getCohortUser(this.selectedCohortUuid);
    if (sub) {
      sub.pipe(take(1)).subscribe(

        (cohorts) => {
          if (cohorts) {
            this.cohortUsers = cohorts;
            this.fetchingResults = false;
          }

        },
        (error) => {
          console.error('error', error);
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
  public getSelectedUser($event) {
    if ($event) {
      this.selectedUserToBind = $event.label;
      this.selectedUser = $event;
    }
  }
  public isAddButton() {
    this.preferredRole = '';
    this.selectedUserToBind = '';
    this.selectedUser = {};
    this.isCreateNewUser = false;
    this.isUseList = true;

  }
  public ShareCohortWithNewUser() {
    const cohortUserPayload = {
      role: this.preferredRole,
      user: this.selectedUser.value,
      cohort: this.selectedCohortUuid
    };
    this.cohortUserResourceService.createCohortUser(cohortUserPayload).pipe(take(1)).subscribe(
      (success) => {
        if (success) {
          this.displaySuccessAlert('Cohort sharing has been done successfully');
          this.getCohortUsers();
          this.isUseList = false;
          this.isCreateNewUser = true;
        }

      },
      (error) => {
        console.error('error', error);
        this.displayErrorAlert('Error!',
          'System encountered an error while sharing the cohort. Please retry.');
      }
    );

  }
  public cancelSharing() {
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
      this.cohortUserResourceService.voidCohortUser(this.selectedCohortUserId).pipe(take(1)).subscribe(
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
  public canEdit(user) {
    this.selectedCohortUserId = user.cohort_user_id;
    this.userRole = 'edit';
    this.updateCohortUserRole(this.selectedCohortUserId, this.userRole);
  }
  public canView(user) {
    this.selectedCohortUserId = user.cohort_user_id;
    this.userRole = 'view';
    this.updateCohortUserRole(this.selectedCohortUserId, this.userRole);

  }
  public updateCohortUserRole(userId, role) {
    const cohortUserPayload = {
      role : role
    };

    this.cohortUserResourceService.updateCohortUser(userId, cohortUserPayload).pipe(take(1)).subscribe(
      (success) => {
        if (success) {
          this.displaySuccessAlert('Cohort user role  updated successfully');
          this.getCohortUsers();
          this.isUseList = false;
          this.isCreateNewUser = true;
        }

      },
      (error) => {
        console.error('error', error);
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
  public valueChange(newValue) {
    this.filterTerm = newValue;
  }
}
