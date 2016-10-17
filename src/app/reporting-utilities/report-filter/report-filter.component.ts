import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ReportFilterModel } from './report-filter.model';
import { EtlDataService } from './etl-data.service';
import { AmrsDataService } from './amrs-data.service';

@Component({
    moduleId: module.id,
    selector: 'report-filter',
    templateUrl: 'report-filter.component.html',
    styleUrls: ['report-filter.component.css']

})
export class ReportFilterComponent implements OnInit {

    protected genders: SelectItem[];
    protected indicators: SelectItem[];
    protected locations: SelectItem[];
    protected forms: SelectItem[];
    protected reportIndicators: string[] = [];

    @Input() enableDiagnostic: boolean;
    @Input() showButton: boolean;
    @Input() buttonName: string;
    @Input() reportFilterTitle: string;
    @Input() reportName: string;
    @Input() enabledControls: string[];
    @Output() onGenerateReport: EventEmitter<any> = new EventEmitter();
    @Input() reportFilterModel: ReportFilterModel;
    @Output() reportFilterModelChange: EventEmitter<any> = new EventEmitter();

    constructor(private etlDataService: EtlDataService, private amrsDataService: AmrsDataService) {
        this.reportFilterModel = new ReportFilterModel();
        this.reportFilterModel.ageRange = [1, 50];
        this.showButton = true;
        this.buttonName = 'Generate Report';
        this.reportFilterTitle = 'Report Filter';
        this.enableDiagnostic = true;
    }

    public ngOnInit() {

        this.renderFilterControls();

    }

    protected handleClick(event: any): void {
        this.onGenerateReport.emit(event);
    }

    protected isEnabled(control: string): boolean {
        return this.enabledControls.indexOf(control) > -1;
    }

    protected defineGenderOptions(): void {
        this.genders = [];
        this.genders.push({ label: 'Select Gender', value: '' });
        this.genders.push({ label: 'Male', value: 'M' });
        this.genders.push({ label: 'Female', value: 'F' });
        this.genders.push({ label: 'Male and Female', value: 'M,F' });

        //init selected gender
        this.reportFilterModel.selectedGender = this.genders[3].value;

    }

    protected renderFilterControls(): void {
        if (this.isEnabled('indicatorsControl')) this.fetchReportIndicators();
        if (this.isEnabled('locationsControl')) this.fetchLocations();
        if (this.isEnabled('formsControl')) this.fetchForms();
        if (this.isEnabled('genderControl')) this.defineGenderOptions();
    }

    protected fetchLocations(): void {
        this.amrsDataService.getLocations().subscribe(
            result => {
                let locations: any[] = <any[]>result;
                this.locations = [];
                for (let i = 0; i < locations.length; i++) {
                    this.locations.push({ label: locations[i].name, value: locations[i].uuid });
                }
            },
            error => {
                console.log(error);
            }
        );
    }

     protected fetchForms(): void {
        this.amrsDataService.getForms().subscribe(
            result => {
                let forms: any[] = <any[]>result;
                this.forms = [];
                for (let i = 0; i < forms.length; i++) {
                    this.forms.push({ label: forms[i].name, value: forms[i].uuid });
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    protected fetchReportIndicators(): void {
        this.etlDataService
            .getReportIndicators({ report: this.reportName })
            .subscribe(
            result => {
                let indicators: any[] = <any[]>result;
                this.indicators = [];
                for (let i = 0; i < indicators.length; i++) {
                    this.indicators.push({ label: indicators[i].label, value: indicators[i].name });
                }
            },
            error => {
                console.log(error);
            }
            );
    }

    get diagnostic() { return JSON.stringify(this.reportFilterModel); }
}
