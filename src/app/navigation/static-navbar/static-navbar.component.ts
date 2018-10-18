import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../openmrs-api/user.service';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { AuthenticationService } from '../../openmrs-api/authentication.service';
import { User } from '../../models/user.model';
import { LocalStorageService } from '../../utils/local-storage.service';
import { FormUpdaterService } from '../../patient-dashboard/common/formentry/form-updater.service';
@Component({
  selector: 'static-navbar',
  templateUrl: './static-navbar.component.html',
  styles: []
})
export class StaticNavBarComponent implements OnInit {
  public user: User;
  public userLocation: string = '';
  public department: any;
  constructor(private router: Router,
              private localStore: LocalStorageService,
              private authenticationService: AuthenticationService,
              private userDefaultSettingsService: UserDefaultPropertiesService,
              private userService: UserService,
              private formUpdaterService: FormUpdaterService) {
  }

  public ngOnInit() {
    this.setUserLocation();
    let department = this.localStore.getItem('userDefaultDepartment');
    if (department) {
      this.department = JSON.parse(department)[0].itemName;
    }
  }
  public logout() {
    this.router.navigateByUrl('/login').then((result) => {
      if (result) {
        this.authenticationService.logOut();
      }
    });
  }
  private setUserLocation() {
    this.user = this.userService.getLoggedInUser();
    this.userDefaultSettingsService.locationSubject.subscribe((location) => {
      if (location) {
        this.userLocation = JSON.parse(location) ? JSON.parse(location).display : '';
      } else {
        let defaultLocation =
          this.localStore.getItem('userDefaultLocation' + this.user.display);
        this.userLocation =
          JSON.parse(defaultLocation) ? JSON.parse(defaultLocation).display :
            undefined;
      }
    });
  }

  private updateForms() {
    this.formUpdaterService.getUpdatedForms();
  }
}
