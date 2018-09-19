import {
  Component, Output, EventEmitter, Input, ViewChildren, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { Messages } from '../utils/messages';
import { Subscription ,  Observable } from 'rxjs';
import {
  UserDefaultPropertiesService
} from
  '../user-default-properties/user-default-properties.service';
import { FormListService } from '../patient-dashboard/common/forms/form-list.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { FormUpdaterService } from '../patient-dashboard/common/formentry/form-updater.service';
import { FormOrderMetaDataService }
from '../patient-dashboard/common/forms/form-order-metadata.service';
import { FormSchemaService } from '../patient-dashboard/common/formentry/form-schema.service';
import { FormSchemaCompiler } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { FormsResourceService } from '../openmrs-api/forms-resource.service';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  @Output() public loginSuccess = new EventEmitter();
  @Output() public loginFailure = new EventEmitter();

  public password: string;

  public error: string;
  public shouldRedirect: boolean = false;
  public busy: Subscription;

  @ViewChildren('password') public passwordField;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private appSettingsService: AppSettingsService,
              private localStorageService: LocalStorageService,
              private userDefaultPropertiesService: UserDefaultPropertiesService,
              private formUpdaterService: FormUpdaterService,
              private formsResourceService: FormsResourceService,
              ) {
  }

  public ngOnInit() {
    let settingsFromAppSettings = this.localStorageService.getItem('appSettingsAction');
    // respect users choice from app settings
    if (!settingsFromAppSettings) {
      let templates = this.appSettingsService.getServerTemplates();

      if (!window.location.host.match(new RegExp('localhost'))) {
        let urlObject = templates[0];
        this.appSettingsService.setEtlServer(urlObject['etlUrl']);
        this.appSettingsService.setOpenmrsServer(urlObject['amrsUrl']);
      }
    }
  }

  public getServerTemplates(): Array<object> {
    return this.appSettingsService.getServerTemplates();
  }

  public login(event, username: string, password: string) {

    event.stopPropagation();
    event.preventDefault();

    let body = JSON.stringify({username, password});
    let currentRoute = window.location.toString();

    this.busy = this.authenticationService.authenticate(username, password)
      .take(1).subscribe(
        (response: Response) => {
          let data = response.json();

          if (data.authenticated) {

                /// update forms in cache ////
            let lastChecked = this.formUpdaterService.getDateLastChecked();
            if (lastChecked !== new Date().toDateString()) {
                    this.formUpdaterService.getUpdatedForms(); }

            if (currentRoute && currentRoute.indexOf('login') !== -1) {

              let previousRoute: string = sessionStorage.getItem('previousRoute');
              let userDefaultLocation = this.userDefaultPropertiesService
                .getCurrentUserDefaultLocation();

              if (previousRoute && previousRoute.length > 1) {
                if (previousRoute && previousRoute.indexOf('login') !== -1) {
                  this.router.navigate(['/']);
                } else {
                  this.router.navigate([previousRoute]);
                }
              } else {
                this.router.navigate(['/']);
              }
              if (userDefaultLocation === null ||
                userDefaultLocation === undefined ||
                this.shouldSetLocation) {
                this.localStorageService.setItem('lastLoginDate', (new Date())
                  .toLocaleDateString());
                if (this.shouldRedirect) {
                  this.router.navigate(['/user-default-properties', {confirm: 1}]);
                } else {
                  this.router.navigate(['/user-default-properties']);
                }

              } else {
                this.router.navigate(['/']);
              }
            }
          } else {
            this.error = Messages.WRONG_USERNAME_PASSWORD;
            this.clearAndFocusPassword();
          }
        },
        (error) => {
          this.loginFailure.emit(false);
          if (error.status === 0) {
            this.error = Messages.INTERNET_CONNECTION_ERROR;
          } else {
            this.error = error.statusText;
          }
        });

    let lastUpdated  = new Date().toDateString();
    this.loginSuccess.emit(true);

  }

  get shouldSetLocation() {
    let lastLoginDate = this.localStorageService.getItem('lastLoginDate');
    let today = (new Date()).toLocaleDateString();
    this.shouldRedirect = true;
    return (!lastLoginDate || lastLoginDate !== today);
  }

  public clearAndFocusPassword( ) {

    this.passwordField.first.nativeElement.focus();
    this.passwordField.first.nativeElement.value = '';
  }

}
