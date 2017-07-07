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
  searchString: string;
  users: any = [];
  isResetButton: boolean = true;
  totalUsers: number;
  isLoading: boolean = false;
  page: number = 1;
  @Output() onSelectedUserFromSearch = new EventEmitter();
  subscription: Subscription;
  searchPanelVisible: boolean = false;
  public errorMessage: string;
  adjustInputMargin: string = '240px';

  constructor(private userService: UserService, private router: Router,
              ) {
  }


  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.adjustInputMargin = '0';
    }

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  loadUsers(): void {
    this.searchPanelVisible = true;
    this.totalUsers = 0;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.searchString && this.searchString.length > 2) {
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
              for (let i = 0; i < data.length; i++) {
                this.users.push({label: data[i].person.display, value: data[i].uuid,
                  username: data[i].username});
              }
              this.totalUsers = this.users.length;
              this.resetInputMargin();
              this.isLoading = false;
            }
            this.isLoading = false;

          },
          (error) => {
            this.isLoading = false;
            console.log('error', error);
            this.errorMessage = error;
          }
        );

      this.isResetButton = true;

    }
  }

  updateUsersCount(search) {
    if (this.totalUsers > 0 && search.length > 0) {
      this.totalUsers = 0;
    }
  }

  selectUser(user) {
    this.onSelectedUserFromSearch.emit(user);
    this.searchPanelVisible = false;
  };



  resetSearchList() {
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

