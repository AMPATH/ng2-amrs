import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionStorageService } from 'src/app/utils/session-storage.service';
import { Constants } from 'src/app/utils/constants';
import { Subscription } from 'rxjs';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

@Component({
  selector: 'micro-frontend-reports',
  templateUrl: './hiv-lists-microfrontend.component.html',
  styleUrls: ['./hiv-lists-microfrontend.component.css']
})
export class HIVListsMicroFrontendComponent implements OnDestroy, OnInit {
  public url: SafeResourceUrl;
  private baseUrl = 'https://ngx.ampath.or.ke';
  private subscription: Array<Subscription> = [];
  private locationUuid: any;
  private returnToUrl: string;

  messageHandler(messageEvent: MessageEvent) {
    if (this.validateMessageEvent(messageEvent)) {
      this.handleMessageFunction(messageEvent.data.action, messageEvent);
    }
  }

  sendMessageToReportIframe(message: any) {
    const microFrontendFrame = document.getElementsByTagName('iframe')[0];
    microFrontendFrame.contentWindow.postMessage(message, this.baseUrl);
  }

  constructor(
    private sanitizer: DomSanitizer,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private appSettingService: AppSettingsService,
    private localStorageService: LocalStorageService
  ) {
    this.route.params.subscribe((params) => {
      this.locationUuid = params.location_uuid;
    });
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.baseUrl}/amrs/spa/home`
    );
    window.addEventListener('message', this.messageHandler.bind(this), false);
  }

  public redirectTopatientInfo(patientUuid, returnToUrl) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/landing-page'
    ]);
  }

  public ngOnInit() {
    this.getLocationUuid();
    this.loadParamsFromURL();
  }

  public storeParamsInUrl(param) {
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...param }
    });
  }

  public loadParamsFromURL() {
    const loadParamsSub = this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.returnToUrl = params.returnToUrl;
          this.sendMessageToReportIframe(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
    this.subscription.push(loadParamsSub);
  }

  public getLocationUuid() {
    this.route.params.subscribe((params) => {
      this.locationUuid = params;
      this.returnToUrl = params.returnToUrl;
      this.sendMessageToReportIframe(this.locationUuid);
      this.localStorageService.setItem('location_uuid', params.location_uuid);
    });
    this.localStorageService.setItem(
      'location_uuid',
      this.locationUuid.location_uuid
    );
  }

  public validateMessageEvent(message: MessageEvent) {
    if (message.origin === this.baseUrl) {
      if (message.data.action === 'authenticate') {
        this.sendMessageToReportIframe({
          loginToken: this.sessionStorageService.getItem(
            Constants.CREDENTIALS_KEY
          ),
          baseEtlUrl: this.appSettingService.getEtlServer(),
          locationUuid: this.locationUuid,
          returnToUrl: this.returnToUrl
        });
      }
      return true;
    }
    return false;
  }

  private handleMessageFunction(action: string, message: MessageEvent) {
    switch (action) {
      case 'navigate':
        this.redirectTopatientInfo(
          message.data.navigate.patientUuid,
          message.data.navigate.returnToUrl
        );
        break;
      case 'storeParamsInUrl':
        this.storeParamsInUrl(message.data.storeParamsInUrl);
        break;
      case 'loadParamsFromURL':
        this.loadParamsFromURL();
        break;
      case 'getLocationUuid':
        this.getLocationUuid();
        break;
    }
  }

  public ngOnDestroy() {
    if (this.subscription.length > 0) {
      this.subscription.forEach((sub) => {
        sub.unsubscribe();
      });
    }
    this.returnToUrl = null;
  }
}
