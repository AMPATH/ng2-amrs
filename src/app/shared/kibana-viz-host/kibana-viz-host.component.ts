import { Component, ViewChild, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'kibana-viz-host',
    templateUrl: './kibana-viz-host.component.html',
    styleUrls: ['./kibana-viz-host.component.css']
})
export class KibanaVizHostComponent {
    // @ViewChild('frame')
    // public frame: any;

    public source: SafeResourceUrl;

    private _url: string;
    public get url(): string {
        return this._url;
    }
    @Input()
    public set url(v: string) {
        this._url = v;
        this.source = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }

    constructor(public sanitizer: DomSanitizer,
                private router: Router) {
        window.addEventListener('message', (data) => {
            this.navigateToPatientDashboard(data.data);
        });
    }

    public navigateToPatientDashboard(patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }

        this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
            '/general/general/landing-page']);
    }
}
