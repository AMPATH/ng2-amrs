/* tslint:disable:no-inferrable-types */
import {take} from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortListService } from './cohort-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CohortMemberResourceService } from '../openmrs-api/cohort-member-resource.service';

@Component({
  selector: 'cohort-list-members',
  templateUrl: 'cohort-list-members.component.html',
  styleUrls: ['./cohort-members.css'],
})
export class ViewCohortListMembersComponent implements OnInit, OnDestroy {

  public subscription: Subscription;
  public showingAddToCohort = false;
  public cohortMembers: any;
  public identifiers: any;
  public fetchingResults = false;
  public cohort: any;
  public selectedCohortName: string;
  public selectedCohortDescription: string;
  public selectedCohortUuid: string;
  public displayConfirmDeleteCohortDialog: any;
  public userAssignedRole: string;
  public filterTerm = '';
  public display = false;
  public selectedMember: string;
  public selectedMemberUuid: string;
  public displayConfirmDialog = false;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public successAlert: string;
  public errorAlert: string;
  public errorTitle: string;

  constructor(
    private cohortListService: CohortListService,
    private router: Router,
    private cohortMemberResourceService: CohortMemberResourceService,
    private cohortResourceService: CohortResourceService,
    private route: ActivatedRoute) { }
  public ngOnInit() {
    this.selectedCohortUuid = this.route.snapshot.params['cohort_uuid'];
    this.viewCohortListMembers();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public addToCohort() {
    this.showingAddToCohort = true;
  }

  public onAddingToCohortClosed() {
    this.showingAddToCohort = false;
    this.viewCohortListMembers();
  }

  public viewCohortListMembers() {
    this.fetchingResults = true;
    this.cohortListService.getData().pipe(take(1)).subscribe(
      (data) => {
        if (data) {
          this.selectedCohortUuid = data.uuid;
          this.selectedCohortName = data.name;
          this.selectedCohortDescription = data.description;
          this.userAssignedRole = data.role;
          this.cohort = data;
        }

      });
    this.fetchMembers();

  }
  public fetchMembers() {
    this.cohortMemberResourceService.getAllCohortMembers(this.selectedCohortUuid).pipe(take(1)).subscribe(
      (members) => {
        if (members) {
          this.cohortMembers = members;

        }

        this.fetchingResults = false;
      });

  }
  public loadPatientData(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/general/general/landing-page']);
  }
  public valueChange(newValue) {
    this.filterTerm = newValue;
  }

  public voidCohortList() {
    if (this.selectedCohortUuid) {
      this.cohortResourceService.retireCohort(this.selectedCohortUuid).pipe(take(1)).subscribe(
        (success) => {
          this.displayConfirmDialog = false;
          this.displayConfirmDeleteCohortDialog = false;
          this.displaySuccessAlert('Patient list deleted successfully');
          setTimeout(() => {
            this.router.navigate(['/patient-list-cohort/cohort']);
          }, 2000);
        },
        (error) => {
          console.error('The request failed because of the following ', error);
          this.displayErrorAlert('Error!',
            'System encountered an error while deleting the patient list. Please retry.');
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
  public openConfirmDialog(member) {
    this.selectedMember = member.patient.person.display;
    this.selectedMemberUuid = member.patient.uuid;
    this.displayConfirmDialog = true;

  }

  public openConfirmDeleteCohortDialog(cohortUuid) {
    this.displayConfirmDeleteCohortDialog = true;
  }

  public closeConfirmDeleteCohortDialog() {
    this.displayConfirmDeleteCohortDialog = false;
  }
  public closeConfirmationDialog() {
    this.displayConfirmDialog = false;
  }
  public navigateBack() {
    this.router.navigate(['/patient-list-cohort/cohort']);
  }
  public voidCohortMember() {
    if (this.selectedCohortUuid) {
      this.cohortMemberResourceService.retireCohortMember(this.selectedCohortUuid,
        this.selectedMemberUuid).pipe(take(1)).subscribe(
        (success) => {
          // if (success) {

          this.displaySuccessAlert('patient list member deleted successfully');
          this.fetchMembers();
          this.displayConfirmDialog = false;
          // }

        },
        (error) => {
          console.error('The request failed because of the following ', error);
          this.displayErrorAlert('Error!',
            'System encountered an error while deleting the patient list. Please retry.');
        });
    }

  }

}
