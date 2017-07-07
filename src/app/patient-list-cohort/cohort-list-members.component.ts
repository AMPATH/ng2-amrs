
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

  subscription: Subscription;
  cohortMembers: any;
  identifiers: any;
  fetchingResults: boolean = false;
  public selectedCohortName: string;
  public selectedCohortDescription: string;
  public selectedCohortUuid: string;
  userAssignedRole: string;
  filterTerm: string = '';
  display: boolean = false;
  selectedMember: string;
  selectedMemberUuid: string;
  private displayConfirmDialog: boolean = false;
  private showSuccessAlert: boolean = false;
  private showErrorAlert: boolean = false;
  private successAlert: string;
  private errorAlert: string;
  private errorTitle: string;

  constructor(
              private cohortListService: CohortListService,
              private router: Router,
              private cohortMemberResourceService: CohortMemberResourceService,
              private cohortResourceService: CohortResourceService,
              private route: ActivatedRoute) { }
  ngOnInit() {
    this.selectedCohortUuid = this.route.snapshot.params['cohort_uuid'];
    this.viewCohortListMembers();


  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();

    }
  }
  viewCohortListMembers() {
    this.fetchingResults = true;
    this.subscription = this.cohortListService.getData().subscribe(
      data => {
        if (data) {
          this.selectedCohortUuid = data.uuid;
          this.selectedCohortName = data.name;
          this.selectedCohortDescription = data.description;
          this.userAssignedRole = data.role;
        }

      });
    this.fetchMembers();




  }
  fetchMembers() {
    this.cohortMemberResourceService.getAllCohortMembers(this.selectedCohortUuid).subscribe(
      (members) => {
        if (members) {
          this.cohortMembers = members;

        }

        this.fetchingResults = false;
      });

  }

  loadPatientData(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/' + patientUuid + '/general']);
  }
  valueChange(newValue) {
    this.filterTerm = newValue;
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
  public closeConfirmationDialog() {
    this.displayConfirmDialog = false;
  }
  navigateBack() {
    this.router.navigate(['/patient-list-cohort/cohort']);
  }
  voidCohortMember() {
    if (this.selectedCohortUuid) {
      this.cohortMemberResourceService.retireCohortMember(this.selectedCohortUuid,
        this.selectedMemberUuid).subscribe(
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
            'System encountered an error while deleting the cohort. Please retry.');
        });
    }

  }




}
