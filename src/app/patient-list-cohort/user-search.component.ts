import {
  Component, OnInit, ViewEncapsulation,
  ViewChild, EventEmitter, Output, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../openmrs-api/user.service';

@Component({
  selector: 'user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})

export class UserSearchComponent implements OnInit, OnDestroy {
  public searchString: string;
  public users: any = [];
  public isResetButton: boolean = true;
  public totalUsers: number;
  public isLoading: boolean = false;
  public page: number = 1;
  @Output() public onSelectedUserFromSearch = new EventEmitter();
  public subscription: Subscription;
  public searchPanelVisible: boolean = false;
  public errorMessage: string;
  public adjustInputMargin: string = '240px';

  constructor(private userService: UserService, private router: Router,
              ) {
  }

  public ngOnInit() {
    if (window.innerWidth <= 768) {
      this.adjustInputMargin = '0';
    }

  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadUsers(): void {
    this.searchPanelVisible = true;
    this.totalUsers = 0;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.searchString) {
      if (window.innerWidth > 768) {
        this.adjustInputMargin = '267px';
      }
      this.isLoading = true;
      this.users = [];
      this.subscription = this.userService
        .searchUsers(this.searchString)
        .subscribe(
          (data) => {
            if (data.length > 0) {
              this.users = [];
              for (let user of data ) {
                this.users.push({label: user.person.display, value: user.uuid,
                  username: user.username});
              }
              this.totalUsers = this.users.length;
              this.resetInputMargin();
              this.isLoading = false;
            }
            this.isLoading = false;

          },
          (error) => {
            this.isLoading = false;
            console.error('error', error);
            this.errorMessage = error;
          }
        );

      this.isResetButton = true;

    }
  }

  public updateUsersCount(search) {
    // if (this.totalUsers > 0 && search.length > 0) {
    //   this.totalUsers = 0;
    // }
  }

  public selectUser(user) {
    this.onSelectedUserFromSearch.emit(user);
    this.searchPanelVisible = false;
  }

  public resetSearchList() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchString = '';
    this.totalUsers = 0;
    this.isResetButton = false;
    this.searchPanelVisible = false;
    this.isLoading = false;
    this.users = [];
    this.resetInputMargin();
  }
  public resetInputMargin() {
    if (window.innerWidth > 768) {
      this.adjustInputMargin = '240px';
    }
  }

}
