import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie';

import { AppSettingsService } from './app-settings.service';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { LocalStorageService } from '../utils/local-storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css'],
  providers: [AppSettingsService]
})
export class AppSettingsComponent implements OnInit {
  @ViewChild('addUrlModal')
  public urlModal: ModalDirective;
  public newUrl: string;
  public urlPlaceholder: string;
  public urlType: string;
  public serverTemplates: Array<object> = this.getServerTemplates();
  public cookieKey = 'formDebug';
  public cookieVal: string;
  public hideFields: boolean;

  constructor(
    private router: Router,
    private appSettingsService: AppSettingsService,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService,
    private _cookieService: CookieService
  ) {}

  public getServerTemplates(): Array<object> {
    return this.appSettingsService.getServerTemplates();
  }

  public ngOnInit() {
    if (!window.location.host.match(new RegExp('localhost'))) {
      // this.changeServerSettings(templates[0]);
    }
    this.checkDebugMode();
  }

  get openmrsServer(): string {
    return this.appSettingsService.getOpenmrsServer();
  }

  set openmrsServer(value: string) {
    this.appSettingsService.setOpenmrsServer(value);
  }

  get etlServer(): string {
    return this.appSettingsService.getEtlServer();
  }

  set etlServer(value: string) {
    this.appSettingsService.setEtlServer(value);
  }

  get amrsIdGenServer(): string {
    return this.appSettingsService.getAmrsIdGenServer();
  }

  set amrsIdGenServer(value: string) {
    this.appSettingsService.setAmrsIdGenServer(value);
  }

  get openmrsServerUrls(): string[] {
    return this.appSettingsService.openmrsServerUrls;
  }

  get etlServerUrls(): string[] {
    return this.appSettingsService.etlServerUrls;
  }

  get amrsIdGenServerUrls(): string[] {
    return this.appSettingsService.amrsIdGenServerUrls;
  }

  public showNewUrlForm(event) {
    this.newUrl = null;
    if (event && event.srcElement) {
      const srcId = event.srcElement.id;
      switch (srcId) {
        case 'etlUrlBtn':
          this.urlPlaceholder = 'http://localhost:8002/etl';
          this.urlType = 'etl';
          break;
        case 'openmrsUrlBtn':
          this.urlPlaceholder = 'http://localhost:8080/openmrs';
          this.urlType = 'openmrs';
          break;
        case 'amrsIdGenUrlBtn':
          this.urlPlaceholder = 'http://localhost:8002/amrs-id-generator';
          this.urlType = 'amrsIdGen';
          break;
        default:
          this.urlPlaceholder = '';
      }
      this.urlModal.show();
    }
  }

  public saveNewURL(url: string, urlType: string = 'openmrs') {
    this.appSettingsService.addAndSetUrl(url, urlType);
    this.urlModal.hide();
  }

  public changeServerSettings(row: any) {
    // change openmrs url
    this.openmrsServer = row.amrsUrl;
    // change etl-server url
    this.etlServer = row.etlUrl;

    this.amrsIdGenServer = row.amrsIdGenUrl;
  }

  public onDoneClick() {
    this.localStorageService.setItem('appSettingsAction', 'newSettings');
    // clear session cache
    // return back to login page
    this.authenticationService.clearSessionCache();
    this.router.navigate(['/login']);
  }

  // check if debug cookie has been set
  public checkDebugMode() {
    const isCookieSet = this.getDebugMode();

    if (isCookieSet === 'undefined') {
      this.hideFields = false;
    } else {
      // get the value of the debug mode
      if (isCookieSet === 'true') {
        this.hideFields = true;
      } else {
        this.hideFields = false;
      }
    }
  }

  // get the debug cookie value
  public getDebugMode() {
    const debugModeCookie = this._cookieService.get(this.cookieKey);

    if (typeof debugModeCookie === 'undefined') {
      return debugModeCookie;
    } else {
      return debugModeCookie;
    }
  }

  public toggleDebugMode() {
    // check if hidefields cookie has been set
    const isCookieSet = this.getDebugMode();
    if (isCookieSet === 'true') {
      // remove the initial cookie set
      this._cookieService.remove(this.cookieKey);
    } else {
    }

    this.cookieVal = '' + this.hideFields;
    this._cookieService.put(this.cookieKey, this.cookieVal);
  }

  public removeDebugCookie() {
    const isCookieSet = this.getDebugMode();

    if (isCookieSet === 'true') {
      // remove the cookie set
      this._cookieService.remove(this.cookieKey);
    } else {
    }
  }
}
