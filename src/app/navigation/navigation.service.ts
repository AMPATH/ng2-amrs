import { Injectable } from '@angular/core';
import { UserService } from '../openmrs-api/user.service';
import * as _ from 'lodash';

@Injectable()
export class NavigationService {
  private canViewFormsTabPrivileges = ['662f83f3-dfaa-40b5-8364-2772149087a4'];
  constructor(private userService: UserService) {
  }
  public expandSideBar() {
    setTimeout(() => {
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('sidebar-collapse');
      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-open');
    }, 200);
  }

  public collapseSideBar() {
    setTimeout(() => {
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('sidebar-collapse');
      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-collapse');
    }, 200);
  }

  public checkFormsTabViewingRight() {
     const privileges: any[] = this.userService.getLoggedInUser().privileges;
     console.log(privileges);
     let authorized = false;
     if (privileges === null) {
       authorized = true;
     } else {
     _.forEach(privileges, (privilege) => {
        if (_.indexOf(this.canViewFormsTabPrivileges, privilege.uuid) > -1) {
            authorized = true;
        }
    });
  }
     return authorized;
}
}
