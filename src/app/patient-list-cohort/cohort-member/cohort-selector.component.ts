import { take } from 'rxjs/operators/take';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { UserService } from '../../openmrs-api/user.service';
import { User } from '../../models/user.model';
import { UserCohortResourceService } from '../../etl-api/user-cohort-resource.service';
@Component({
  selector: 'cohort-selector',
  templateUrl: 'cohort-selector.component.html',
  styles: [
    `
      .ui-select-choices-row.active li a {
        color: black !important;
      }
      .ui-select-choices-row a:hover {
        color: white !important;
      }
      .ui-select-choices li a {
        color: #337ab7 !important;
      }
      .ui-select-choices li .ui-select-choices-row.active a {
        color: #fff !important;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class CohortSelectorComponent implements OnInit {
  @Output()
  public cohortSelected: EventEmitter<any> = new EventEmitter();
  public user: User;
  public cohortList = [];
  public loadingList = false;
  public loadingListError = false;

  constructor(
    private userService: UserService,
    private userCohortResourceService: UserCohortResourceService
  ) {
    this.user = this.userService.getLoggedInUser();
  }

  public ngOnInit() {
    this.getUserCohorts();
  }

  public selectCohort(selectedItem) {
    const selctedCohort = {
      uuid: selectedItem.id,
      display: selectedItem.text
    };
    this.cohortSelected.next(selctedCohort);
  }

  public getUserCohorts() {
    const obs = this.userCohortResourceService.getUserCohorts(this.user.uuid);
    if (obs) {
      this.loadingList = true;
      const sub = obs.pipe(take(1)).subscribe(
        (cohorts) => {
          if (cohorts) {
            this.cohortList = this.filterOutViewOnlyCohorts(cohorts.result);
            this.loadingList = false;
          }
        },
        (error) => {
          this.loadingList = false;
          this.loadingListError = true;
        },
        () => {
          sub.unsubscribe();
        }
      );
    }
  }

  public filterOutViewOnlyCohorts(cohortsArray: Array<any>) {
    const cohorts = [];
    if (cohortsArray) {
      cohortsArray.forEach((item) => {
        if (item.role !== 'view') {
          item.id = item.uuid;
          item.text = item.name;
          cohorts.push(item);
        }
      });
    }

    return cohorts;
  }
}
