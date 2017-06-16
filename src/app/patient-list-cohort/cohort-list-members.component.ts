
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortListService } from './cohort-list.service';
import { Router } from '@angular/router';
import { CohortMemberResourceService } from '../openmrs-api/cohort-member-resource.service';

@Component({
  selector: 'cohort-list-members',
  templateUrl: 'cohort-list-members.component.html',
  styleUrls: [],
})
export class ViewCohortListMembersComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  cohortMembers: any;
  identifiers: any;
  fetchingResults: boolean = false;
  public selectedCohortName: string;
  public selectedCohortDescription: string;
  public selectedCohortUuid: string;

  constructor(
              private cohortListService: CohortListService,
              private router: Router,
              private cohortMemberResourceService: CohortMemberResourceService) { }
  ngOnInit() {
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
        }

      });

    this.cohortMemberResourceService.getAllCohortMembers(this.selectedCohortUuid).subscribe(
      (members) => {
        if (members) {
          this.cohortMembers = members;

        }

        this.fetchingResults = false;
      });


  }



}
