import {
  Component, Output, EventEmitter, Input, ViewChildren, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { UpdateAvailableEvent, UpdateActivatedEvent } from '@angular/service-worker/src/low_level';



import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import { FormSchemaCompiler } from 'ngx-openmrs-formentry';


import { AuthenticationService } from '../openmrs-api/authentication.service';
import { Messages } from '../utils/messages';
import {
  UserDefaultPropertiesService
} from '../user-default-properties/user-default-properties.service';
import { FormListService } from '../patient-dashboard/common/forms/form-list.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { FormUpdaterService } from '../patient-dashboard/common/formentry/form-updater.service';
import { FormOrderMetaDataService } from '../patient-dashboard/common/forms/form-order-metadata.service';
import { FormSchemaService } from '../patient-dashboard/common/formentry/form-schema.service';
import { FormsResourceService } from '../openmrs-api/forms-resource.service';
@Component({
  // tslint:disable-next-line:component-selector
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
  public shouldRedirect = false;
  public busy: Subscription;

  @ViewChildren('password') public passwordField;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private appSettingsService: AppSettingsService,
              private localStorageService: LocalStorageService,
              private userDefaultPropertiesService: UserDefaultPropertiesService,
              private formUpdaterService: FormUpdaterService,
              private formsResourceService: FormsResourceService,
              private updates: SwUpdate
              ) {
  }

  public ngOnInit() {
    const settingsFromAppSettings = this.localStorageService.getItem('appSettingsAction');
    // respect users choice from app settings
    if (!settingsFromAppSettings) {
      const templates = this.appSettingsService.getServerTemplates();

      if (!window.location.host.match(new RegExp('localhost'))) {
        const urlObject = templates[0];
        this.appSettingsService.setEtlServer(urlObject['etlUrl']);
        this.appSettingsService.setOpenmrsServer(urlObject['amrsUrl']);
      }
    }

    // service worker hard reload user if new version is available
    this.isUpdateAvailable().subscribe(() => {
        window.location.reload();
    });
  }

  public getServerTemplates(): Array<object> {
    return this.appSettingsService.getServerTemplates();
  }

  public login(event, username: string, password: string) {

    event.stopPropagation();
    event.preventDefault();

    const body = JSON.stringify({ username, password });
    const currentRoute = window.location.toString();

    this.busy = this.authenticationService.authenticate(username, password)
      .subscribe(
        (response: any) => {
          const data = response;

          if (data.authenticated) {

            /// update forms in cache ////
            const lastChecked = this.formUpdaterService.getDateLastChecked();
            if (lastChecked !== new Date().toDateString()) {
              this.formUpdaterService.getUpdatedForms();
            }

            if (currentRoute && currentRoute.indexOf('login') !== -1) {

              const previousRoute: string = sessionStorage.getItem('previousRoute');
              const userDefaultLocation = this.userDefaultPropertiesService
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
                  this.router.navigate(['/user-default-properties', { confirm: 1 }]);
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

    this.loginSuccess.emit(true);

  }

  get shouldSetLocation() {
    const lastLoginDate = this.localStorageService.getItem('lastLoginDate');
    const today = (new Date()).toLocaleDateString();
    this.shouldRedirect = true;
    return (!lastLoginDate || lastLoginDate !== today);
  }

  public clearAndFocusPassword() {

    this.passwordField.first.nativeElement.focus();
    this.passwordField.first.nativeElement.value = '';
  }

  public isUpdateAvailable(): Observable<UpdateAvailableEvent> {
    return this.updates.available;
}

public isUpdateActivated(): Observable<UpdateActivatedEvent> {
    return this.updates.activated;
}

}
