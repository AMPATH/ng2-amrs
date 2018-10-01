import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import * as _ from 'lodash';
import {CommunityGroupService} from '../../../openmrs-api/community-group-resource.service';
import {Group} from '../../group-model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'group-search-input',
  templateUrl: './group-search-input.component.html',
  styleUrls: ['./group-search-input.component.css']
})
export class GroupSearchInputComponent implements OnInit, OnDestroy {
  public searchString = '';
  public isLoading = false;
  public lastSearchString = '';
  public searchByLandmark = false;
  public totalGroups;
  public errorMessage = '';
  public placeholder = 'Enter the Group Name or Number';
  @Input() isModal: boolean;
  @Output() hideResults: EventEmitter<boolean> = new EventEmitter();
  @Output() searchResults: EventEmitter<Group[]> = new EventEmitter();
  private subscription = new Subscription();
  constructor(private groupService: CommunityGroupService) { }

  ngOnInit() {
  }


  public searchGroup() {
    this.hideResults.emit(false);
    this.isLoading = true;
    this.errorMessage = '';
    this.lastSearchString = this.searchString;
    if (!_.isEmpty(this.errorMessage)) {
      this.errorMessage = '';
    }
    if (this.searchString) {
      this.subscription.add(this.groupService.searchCohort(this.searchString, this.searchByLandmark).subscribe((results) => {
          this.searchResults.emit(results);
          this.totalGroups = results.length;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred please retry';
        }));
    }
  }

  public resetSearchList() {
    this.hideResults.emit(true);
    this.searchString = '';
    this.totalGroups = 0;
    this.isLoading = false;
  }

  public toggleSearchByLandmark(event) {
    this.searchByLandmark = !!event.checked;
    const searchByLandmarkPlaceholder = 'Enter Landmark';
    const searchByNameOrNumberPlaceholder = 'Enter the Group Name or Number';
    this.searchByLandmark ? this.placeholder = searchByLandmarkPlaceholder :
                            this.placeholder = searchByNameOrNumberPlaceholder;
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
