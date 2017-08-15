import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
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
  public urlModal: ModalComponent;
  public newUrl: string;
  public urlPlaceholder: string;
  public  urlType: string;
  public serverTemplates: Array<object> = this.getServerTemplates();

  constructor(private router: Router,
              private appSettingsService: AppSettingsService,
              private localStorageService: LocalStorageService,
              private authenticationService: AuthenticationService) { }

  public getServerTemplates(): Array<object> {
    return this.appSettingsService.getServerTemplates();
  }

  public ngOnInit() {
    let templates = this.appSettingsService.getServerTemplates();

    if (!window.location.host.match(new RegExp('localhost'))) {
      this.changeServerSettings(templates[0]);
    }

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

  get openmrsServerUrls(): string[] {
    return this.appSettingsService.openmrsServerUrls;
  }

  get etlServerUrls(): string[] {
    return this.appSettingsService.etlServerUrls;
  }

  public showNewUrlForm(event) {
    this.newUrl = null;
    if (event && event.srcElement) {
      let srcId = event.srcElement.id;
      if (srcId === 'etlUrlBtn') {
        this.urlPlaceholder = 'http://localhost:8002/etl';
        this.urlType = 'etl';
      } else {
        // openmrsUrlBtn
        this.urlPlaceholder = 'http://localhost:8080/openmrs';
        this.urlType = 'openmrs';
      }
    } else {
      this.urlPlaceholder = '';
    }

    this.urlModal.open();
  }

  public saveNewURL(url: string, urlType: string = 'openmrs') {
    this.appSettingsService.addAndSetUrl(url, urlType);
    this.urlModal.close();
  }

  public changeServerSettings(row: any) {
    // change openmrs url
    this.openmrsServer = row.amrsUrl;
    // change etl-server url
    this.etlServer = row.etlUrl;

  }

  public onDoneClick() {
    this.localStorageService.setItem('appSettingsAction', 'newSettings');
    // clear session cache
    // return back to login page
    this.authenticationService.clearSessionCache();
    this.router.navigate(['/login']);
  }
}
