import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { ChartModule } from 'angular2-highcharts';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { PatientStatusChangeVisualizationComponent } from './patient-status-change-visualization.component';
import { PatientStatuChangeVisualizationService } from './patient-status-change-visualization.service';
import { DashboardFiltersComponent } from '../../dashboard-filters/dashboard-filters.component';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { IndicatorSelectComponent } from '../../dashboard-filters/indicator-selector/indicator-selector.component';
import { GenderSelectComponent } from '../../dashboard-filters/gender-selector/gender-selector.component';
import { DateRangeComponent } from '../../dashboard-filters/date-range/date-range.component';
import { RangeSliderComponent } from '../../dashboard-filters/range-slider/range-slider.component';
import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { RouterTestingModule } from '@angular/router/testing';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { highchartsFactory } from '../../clinic-dashboard.module';
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

describe('MonthlyScheduleComponent', () => {
    let fixture: ComponentFixture<PatientStatusChangeVisualizationComponent>;
    let comp: PatientStatusChangeVisualizationComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ChartModule, AgGridModule, MatSlideToggleModule, FormsModule,
                NgamrsSharedModule, DateTimePickerModule, RouterTestingModule
            ],
            declarations: [PatientStatusChangeVisualizationComponent,
            DashboardFiltersComponent, IndicatorSelectComponent, GenderSelectComponent,
            DateRangeComponent, RangeSliderComponent
        ],
            providers: [
                PatientStatusChangeVisualizationComponent,
                PatientStatuChangeVisualizationService,
                {
                    provide: HighchartsStatic,
                    useFactory: highchartsFactory
                }
            ],
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PatientStatusChangeVisualizationComponent);
                comp = fixture.componentInstance;
            });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined', async() => {
        expect(comp).toBeTruthy();
    });

    it('should have required properties', (done) => {
        expect(comp.showAnalysisTypeSelector).toBeDefined();
        expect(comp.showAnalysisTypeSelector).toBe(false);
        expect(comp.data).toBeDefined();
        expect(comp.indicatorDefinitions).toBeDefined();
        expect(comp.dataTable).toBeDefined();
        expect(comp.columns).toBeDefined();
        expect(comp.selectedAnalysisType).toBeDefined();
        expect(comp.error).toBe(false);
        expect(comp.showTable).toBe(true);
        expect(comp.options).toBeDefined();
        done();
    });

    it('should have all the required functions defined and callable', (done) => {
        spyOn(comp, 'ngOnInit').and.callThrough();
        comp.ngOnInit();
        expect(comp.ngOnInit).toHaveBeenCalled();
        done();
    });
});
