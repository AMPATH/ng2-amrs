import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortListService } from './cohort-list.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'edit-cohort-list',
  templateUrl: 'edit-cohort-list.component.html',
  styleUrls: [],
})
export class EditCohortListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  public selectedCohortName: string;
  public selectedCohortDescription: string;
  public selectedCohortUuid: string;
  display: boolean = false;
  private errors: any = [];
  private successAlert: string = '';

  constructor(private cohortResourceService: CohortResourceService,
              private cohortListService: CohortListService,
              private router: Router,
              private route: ActivatedRoute) { }
  ngOnInit() {
    this.selectedCohortUuid = this.route.snapshot.params['cohort_uuid'];
    this.getCohortListToEdit();


  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();

    }
  }
  getCohortListToEdit() {
    this.subscription = this.cohortListService.getData().subscribe(
      data => {
        if (data) {
          this.selectedCohortDescription = data.description;
          this.selectedCohortUuid = data.uuid;
          this.selectedCohortName = data.name;
        }

      });


  }
  public editCohortList() {
    this.errors = [];
    this.successAlert = '';

    if (this.errors.length === 0) {
      let cohortListPayload = {
        name: this.selectedCohortName,
        description: this.selectedCohortDescription,
        // memberIds: []
      };
      this.cohortResourceService.editCohort(this.selectedCohortUuid,
        cohortListPayload).subscribe(
        (success) => {
          if ( success ) {
            this.successAlert = 'Successfully edited cohort';
            this.cohortResourceService.getCohort(this.selectedCohortUuid).subscribe(
              (edited) => {
                this.cohortListService.setData(edited);
              }
            );
            this.display = false;

          }

        },
        (error) => {
          console.log('error', error);
          this.errors.push({
            message: 'error editing cohort'
          });
        }
      );
    }
  }
  showDialog() {
    this.display = true;
  }
  public dismissDialog() {
    this.display = false;
  }

}
