import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import * as rison from 'rison';

@Component({
  selector: 'kibana-viz-host',
  templateUrl: './kibana-viz-host.component.html',
  styleUrls: ['./kibana-viz-host.component.css']
})
export class KibanaVizHostComponent {
  @ViewChild('frame')
  public frame: any;

  @Output()
  public vizUrlChanged = new EventEmitter<string>();

  @Output()
  public patientNavigationRequested = new EventEmitter<string>();

  public source: SafeResourceUrl;

  public lastUrl: string;

  private _url: string;
  public get url(): string {
    return this._url;
  }
  @Input()
  public set url(v: string) {
    const newUrl = this.addEmbedToUrl(v);
    this._url = newUrl;
    this.source = this.sanitizer.bypassSecurityTrustResourceUrl(newUrl);
  }

  private _height = '600';
  public get height(): string {
    return this._height;
  }
  @Input()
  public set height(v: string) {
    this._height = v;
  }

  private _width = '99%';
  public get width(): string {
    return this._width;
  }
  @Input()
  public set width(v: string) {
    this._width = v;
  }

  constructor(public sanitizer: DomSanitizer) {
    window.addEventListener('message', (data) => {
      // console.log('message received', data);
      // if (typeof data.data === 'string' && data.data.startsWith('patient-uuid:')) {
      //     this.navigateToPatientDashboard(data.data.replace('patient-uuid:', ''));
      // }

      if (
        typeof data.data === 'string' &&
        data.data.startsWith('kibanaUpdateNotification###')
      ) {
        this.onVisualizationUpdated(data.data);
        return;
      }
      if (typeof data.data === 'string') {
        this.navigateToPatientDashboard(data.data);
      }
    });
  }

  public navigateToPatientDashboard(patientUuid: string) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }

    this.patientNavigationRequested.emit(patientUuid);
  }

  public addEmbedToUrl(url) {
    let embeddedUrl = '';
    if (typeof url !== 'undefined') {
      const split = url.split('embed=true');
      if (split.length === 1) {
        embeddedUrl = url.replace('_g=', 'embed=true&_g=');
      } else {
        embeddedUrl = url;
      }
    } else {
      embeddedUrl = url;
    }

    return embeddedUrl;
  }

  public onVisualizationUpdated(newUrl: string) {
    this.lastUrl = newUrl;
    const vizUrl: string = newUrl.replace('kibanaUpdateNotification###', '');
    const split = this.url.split('#');
    const updatedUrl = split[0] + '#' + vizUrl;
    this.vizUrlChanged.emit(updatedUrl);
  }

  // public onNavigationBegan() {
  //     let newUrl = this.lastUrl;
  //     let vizUrl: string = newUrl.replace('kibanaUpdateNotification###', '');
  //     console.log('vizUrl', vizUrl);
  //     let split = this.url.split('#');

  //     // vizUrl = vizUrl.replace('%20', '');

  //     let aPart = vizUrl.substring(vizUrl.indexOf('&_a=') + 4);
  //     // console.log('apart', aPart);
  //     let decoded = rison.decode(aPart);
  //     // console.log('decoede', decoded);
  //     // console.log('stringy', JSON.stringify(decoded));
  //     decoded = JSON.parse(JSON.stringify(decoded).replace(/%20/g, ' '));
  //     console.log('decoded', decoded);
  //     decoded.filters.push(this.getLocationFilter());
  //     // console.log('with filter', decoded);

  //     let vizWithfilter =
  //         vizUrl.replace(vizUrl.substring(vizUrl.indexOf('&_a=')),
  //             ('&_a=' + rison.encode(decoded)));

  //     console.log('vizWithfilter', vizWithfilter);

  //     let updatedUrl = split[0] + '#' + vizWithfilter;
  //     console.log(updatedUrl);
  //     this.url = updatedUrl;

  //     // console.log(this.frame);

  // tslint:disable-next-line:max-line-length
  //     // this.frame.nativeElement.contentWindow.postMessage('routeRequest###' + updatedUrl, '*');

  //     // console.log('frame', this.frame);
  //     // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length
  //     // this.url = "http://localhost:5601/umf/app/kibana#/dashboard/c9abc660-3e4a-11e8-a24d-0965e331515b?embed=true&_g=()&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:bf46e7f0-3e49-11e8-a24d-0965e331515b,key:gender.keyword,negate:!f,params:(query:M,type:phrase),type:phrase,value:M),query:(match:(gender.keyword:(query:M,type:phrase))))),fullScreenMode:!f,options:(darkTheme:!f,hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(),gridData:(h:15,i:'1',w:24,x:0,y:0),id:a5691730-3e4a-11e8-a24d-0965e331515b,panelIndex:'1',type:visualization,version:'7.0.0-alpha1'),(embeddableConfig:(),gridData:(h:15,i:'2',w:24,x:24,y:0),id:'5ce78960-3e4a-11e8-a24d-0965e331515b',panelIndex:'2',type:search,version:'7.0.0-alpha1')),query:(language:lucene,query:''),timeRestore:!f,title:'average%20balance%20by%20gender',viewMode:view)";
  // }
  // public getLocationFilter(locationUuid: string) {
  //     locationUuid = '08fec150-1352-11df-a1f1-0026b9348838';
  //     let filter: any = {
  //         '$state': {
  //             store: 'appState'
  //         },
  //         meta: {
  //             alias: null,
  //             disabled: false,
  //             index: 'bf46e7f0-3e49-11e8-a24d-0965e331515b',
  //             key: 'location_uuid.keyword',
  //             negate: false,
  //             params: {
  //                 query: locationUuid,
  //                 type: 'phrase'
  //             },
  //             type: 'phrase',
  //             value: locationUuid
  //         },
  //         query: {
  //             match: {
  //                 'location_uuid.keyword': {
  //                     query: locationUuid,
  //                     type: 'phrase'
  //                 }
  //             }
  //         }
  //     };

  //     return filter;
  // }
}
