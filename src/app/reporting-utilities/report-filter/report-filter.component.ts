
import {take} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ReportFilterModel } from './report-filter.model';
import { IndicatorResourceService } from '../../etl-api/indicator-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { FormsResourceService } from '../../openmrs-api/forms-resource.service';

@Component({
  selector: 'report-filter',
  templateUrl: 'report-filter.component.html',
  styleUrls: ['report-filter.component.css']

})
export class ReportFilterComponent implements OnInit {

  public genders: SelectItem[];
  public indicators: SelectItem[];
  public locations: SelectItem[];
  public forms: SelectItem[];
  public reportIndicators: string[] = [];

  @Input() public enableDiagnostic: boolean;
  @Input() public showButton: boolean;
  @Input() public buttonName: string;
  @Input() public reportFilterTitle: string;
  @Input() public reportName: string;
  @Input() public enabledControls: string[];
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onGenerateReport: EventEmitter<any> = new EventEmitter();
  @Input() public reportFilterModel: ReportFilterModel;
  @Output() public reportFilterModelChange: EventEmitter<any> = new EventEmitter();

  constructor(private indicatorResourceService: IndicatorResourceService,
              private locationResourceService: LocationResourceService,
              private formsResourceService: FormsResourceService) {
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

  public handleClick(event: any): void {
    this.onGenerateReport.emit(event);
  }

  public isEnabled(control: string): boolean {
    return this.enabledControls.indexOf(control) > -1;
  }

  public defineGenderOptions(): void {
    this.genders = [];
    this.genders.push({ label: 'Select Gender', value: '' });
    this.genders.push({ label: 'Male', value: 'M' });
    this.genders.push({ label: 'Female', value: 'F' });
    this.genders.push({ label: 'Male and Female', value: 'M,F' });

    // init selected gender
    this.reportFilterModel.selectedGender = this.genders[3].value;

  }

  public renderFilterControls(): void {
    if (this.isEnabled('indicatorsControl')) {
      this.fetchReportIndicators();
    }
    if (this.isEnabled('locationsControl')) {
      this.fetchLocations();
    }
    if (this.isEnabled('formsControl')) {
      this.fetchForms();
    }
    if (this.isEnabled('genderControl')) {
      this.defineGenderOptions();
    }
  }

  public fetchLocations(): void {
    this.locationResourceService.getLocations().pipe(take(1)).subscribe(
      (locations: any[]) => {
        this.locations = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < locations.length; i++) {
          this.locations.push({ label: locations[i].name, value: locations[i].uuid });
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  public fetchForms(): void {
    this.formsResourceService.getForms().pipe(take(1)).subscribe(
      (forms: any[]) => {
        this.forms = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < forms.length; i++) {
          this.forms.push({ label: forms[i].name, value: forms[i].uuid });
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  public fetchReportIndicators(): void {
    this.indicatorResourceService
      .getReportIndicators({ report: this.reportName }).pipe(
      take(1)).subscribe(
      (indicators: any[]) => {
        this.indicators = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < indicators.length; i++) {
          this.indicators.push({ label: indicators[i].label, value: indicators[i].name });
        }
      },
      (error: any) => {
        console.error(error);
      }
      );
  }

  get diagnostic() {
    return JSON.stringify(this.reportFilterModel);
  }
}
