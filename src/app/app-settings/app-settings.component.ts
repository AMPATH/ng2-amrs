import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AppSettingsService } from './app-settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  providers: [ AppSettingsService ]
})
export class AppSettingsComponent {
  @ViewChild('addUrlModal')
  urlModal: ModalComponent;
  newUrl: string;
  urlPlaceholder: string;
  urlType: string;
  
  constructor(private appSettingsService: AppSettingsService ) {}

  get openmrsServer():string {
    return this.appSettingsService.getOpenmrsServer();
  }

  set openmrsServer(value: string) {
    this.appSettingsService.setOpenmrsServer(value);
  }

  get etlServer():string {
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

  showNewUrlForm(event) {
    this.newUrl = null;
    if(event && event.srcElement) {
      let srcId = event.srcElement.id;
      if(srcId == 'etlUrlBtn') {
        this.urlPlaceholder = 'http://localhost:8002/etl';
        this.urlType = 'etl';
      }
      else {  // openmrsUrlBtn
        this.urlPlaceholder = 'http://localhost:8080/openmrs';
        this.urlType = 'openmrs';
      }
    }
    else {
      this.urlPlaceholder = '';
    }

    this.urlModal.open();
  }

  saveNewURL(url: string, urlType:string = 'openmrs') {
    this.appSettingsService.addAndSetUrl(url, urlType);
    this.urlModal.close();
  }
}
