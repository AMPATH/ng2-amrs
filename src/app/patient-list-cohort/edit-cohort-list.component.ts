import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortListService } from './cohort-list.service';
import { Router } from '@angular/router';

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
  private errors: any = [];
  private successAlert: any = '';

  constructor(private cohortResourceService: CohortResourceService,
              private cohortListService: CohortListService,
              private router: Router) { }
  ngOnInit() {
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
          this.selectedCohortDescription = data.desc;
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
      this.cohortResourceService.editCohort(this.selectedCohortDescription,
        cohortListPayload).subscribe(
        (success) => {
          if ( success ) {
            this.successAlert = 'Successfully edited cohort';

            this.router.navigate(['/patient-list-cohort']);
          }

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
}
