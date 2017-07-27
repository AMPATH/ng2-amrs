import { Injectable } from '@angular/core';
@Injectable()
export class NavigationService {
  constructor() {
  }
  public expandSideBar() {
    setTimeout(() => {
      let body = document.getElementsByTagName('body')[0];
      body.classList.remove('sidebar-collapse');
      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-open');
    }, 200);
  }

  public collapseSideBar() {
    setTimeout(() => {
      let body = document.getElementsByTagName('body')[0];
      body.classList.remove('sidebar-collapse');
      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-collapse');
    }, 200);
  }
}
