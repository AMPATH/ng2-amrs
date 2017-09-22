import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MOHReportService } from './moh-731-report-pdf-view.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import * as _ from 'lodash';
import { Subscription, BehaviorSubject } from 'rxjs';
import * as Moment from 'moment';
@Component({
    selector: 'moh-731-pdf',
    templateUrl: 'moh-731-report-pdf-view.component.html'
})
export class MOHReportComponent implements OnInit, OnDestroy {

    public pdfSrc: string = null;
    public page: number = 1;
    public securedUrl: SafeResourceUrl;
    public isBusy: boolean = false;
    public pdfProxy: PDFDocumentProxy = null;
    public pdfMakeProxy: any = null;
    public errorFlag: boolean = false;
    public subscription: Subscription;
    public locations = [];
    public sectionDefinitions: any;
    public rowData: any;
    public previousData: any;
    public numberOfPages = 0;
    public _data;
    @Input() public sectionsDef: any;
    @Input() public startDate: any;
    @Input() public endDate: any;
    @Input()
    set data(value: any) {
        if (value) {
            this.rowData = value;
            this._data = value;
            this.endDate = Moment(this.endDate).format('DD-MM-YYYY');
            this.startDate = Moment(this.startDate).format('DD-MM-YYYY');
            this.sectionDefinitions = this.sectionsDef;
            this.resolveLationParams();
        }

    }

    get data() {
        return this._data;
    }

    constructor(private mohReportService: MOHReportService,
                private locationResourceService: LocationResourceService,
                private domSanitizer: DomSanitizer) {

    }

    public ngOnInit() {
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public generatePdf(): void {
        this.resolveLationParams();
    }

    public generateMoh731ByLocation(params: any, rowData, sectionDefinitions) {
        if (params && rowData && sectionDefinitions) {
            this.isBusy = true;
            this.mohReportService.generatePdf(params, rowData, sectionDefinitions).subscribe(
                (pdf) => {
                    this.pdfSrc = pdf.pdfSrc;
                    this.pdfMakeProxy = pdf.pdfProxy;
                    this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
                    this.isBusy = false;

                },
                (err) => {
                    console.error(err);
                    this.errorFlag = true;
                    this.isBusy = false;
                }
            );
        }

    }

    public afterLoadCompletes(pdf: PDFDocumentProxy): void {
        this.numberOfPages = pdf.numPages;
        this.pdfProxy = pdf;
    }

    public printMohReport(): void {
        this.pdfMakeProxy.print();
    }

    public downloadPdf(): void {
        this.pdfMakeProxy
            .download(('moh_731_report') + '.pdf');
    }

    public nextPage(): void {
        this.page++;
    }

    public prevPage(): void {
        this.page--;
    }

    public resolveLationParams(): void {
        this.isBusy = true;
        this.locationResourceService.getLocations().subscribe(
            (locations: any[]) => {
              // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < locations.length; i++) {
                    if (locations[i]) {
                        // add district,facility and county details
                        let stateProvince = locations[i].stateProvince;
                        let district = locations[i].countyDistrict;
                        district = district ? district : 'N/A';
                        stateProvince = stateProvince ? stateProvince : 'N/A';

                        let details = {
                            district: district,
                            county: stateProvince,
                            facility: locations[i].name,
                            facilityName: locations[i].name
                        };
                        this.locations[locations[i].uuid] = details;
                    }

                }

                this.moh731Report(this.rowData, this.sectionDefinitions);

            },
            (error: any) => {
                console.error(error);
            }
        );

    }

    private moh731Report(rowData, sectionDefinitions) {
        if (rowData) {
          // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < rowData.length; i++) {
                let params = this.getParams(rowData[i].location_uuid);
                if (params) {
                    this.generateMoh731ByLocation(params, rowData[i], sectionDefinitions);

                }

            }
            this.previousData = rowData;
        }

    }

    private getParams(locationUid) {

        let locationDetails = this.getLocationResolved(locationUid);
        let params = {
            facilityName: locationDetails.facilityName,
            facility: locationDetails.facility,
            district: locationDetails.district,
            county: locationDetails.county,
            startDate: this.startDate,
            endDate: this.endDate,
            location_uuid: locationDetails.uuid,
            location_name: locationDetails.name

        };

        return params;
    }

    private getLocationResolved(locationUuid) {
        if (locationUuid && this.locations) {
            if (this.locations[locationUuid]) {
                return this.locations[locationUuid];
            }
        }
        return null;
    }

}
