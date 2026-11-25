import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input
} from '@angular/core';
import * as _ from 'lodash';
import { CommunityGroupService } from '../../../openmrs-api/community-group-resource.service';
import { Group } from '../../group-model';
import { Subscription } from 'rxjs';

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
  /** Characters needed before the page's Search and Reset can be used. */
  public readonly minSearchLength = 3;
  @Input() isModal: boolean;
  @Output() hideResults: EventEmitter<boolean> = new EventEmitter();
  @Output() searchResults: EventEmitter<Group[]> = new EventEmitter();
  private subscription = new Subscription();
  constructor(private groupService: CommunityGroupService) {}

  ngOnInit() {}

  /** Whether enough has been typed (ignoring spaces) to search. */
  public get hasMinimumSearch(): boolean {
    return (this.searchString || '').trim().length >= this.minSearchLength;
  }

  public searchGroup() {
    if (!this.isModal && !this.hasMinimumSearch) {
      return;
    }
    this.hideResults.emit(false);
    this.isLoading = true;
    this.errorMessage = '';
    this.lastSearchString = this.searchString;
    if (!_.isEmpty(this.errorMessage)) {
      this.errorMessage = '';
    }
    if (this.searchString) {
      this.subscription.add(
        this.groupService
          .searchCohort(this.searchString, this.searchByLandmark)
          .subscribe(
            (results) => {
              this.searchResults.emit(results);
              this.groupService.saveSearchResults(results);
              this.totalGroups = results.length;
              this.isLoading = false;
            },
            (error) => {
              this.isLoading = false;
              this.errorMessage = 'An error occurred please retry';
            }
          )
      );
    }
  }

  /**
   * Clears the search's results and messages and stops a search still
   * running, keeping what was typed - for when a facility list is opened.
   */
  public clearSearchState() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.isLoading = false;
    this.totalGroups = undefined;
    this.lastSearchString = '';
    this.errorMessage = '';
  }

  public resetSearchList($event) {
    this.hideResults.emit(true);
    this.searchString = '';
    this.totalGroups = 0;
    this.isLoading = false;
    this.lastSearchString = '';
    this.errorMessage = '';
  }

  public toggleSearchByLandmark(event) {
    this.searchByLandmark = !!event.checked;
    const searchByLandmarkPlaceholder = 'Enter Landmark';
    const searchByNameOrNumberPlaceholder = 'Enter the Group Name or Number';
    this.errorMessage = '';
    this.isLoading = false;
    this.lastSearchString = '';
    this.searchByLandmark
      ? (this.placeholder = searchByLandmarkPlaceholder)
      : (this.placeholder = searchByNameOrNumberPlaceholder);
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
