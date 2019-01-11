import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { ArtOverviewComponent } from './art-overview.component';
import { ChartModule } from 'angular2-highcharts';
import {
    TabViewModule, FieldsetModule, ButtonModule, GrowlModule,
    AccordionModule
} from 'primeng/primeng';
import { ArtOverviewIndicatorDefComponent } from './indicator-definitions.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { ClinicalSummaryVisualizationService } from '../../../../hiv-care-lib/services/clinical-summary-visualization.service';

describe('Art-overview component Tests', () => {
    let comp: ArtOverviewComponent;
    let fixture: ComponentFixture<ArtOverviewComponent>;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [DateTimePickerModule,
                NgxMyDatePickerModule.forRoot(),
                ChartModule,
                TabViewModule,
                AccordionModule,
                FieldsetModule,
                ButtonModule,
                GrowlModule,
                RouterTestingModule
            ],
            providers: [ ClinicalSummaryVisualizationService, HighchartsStatic ],
            declarations: [ArtOverviewComponent, ArtOverviewIndicatorDefComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ArtOverviewComponent);
        comp = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(comp).toBeTruthy();
    });

    it('should have required methods and callable', () => {
        spyOn(comp, 'ngOnInit').and.callThrough();
        comp.ngOnInit();
        expect(comp.ngOnInit).toHaveBeenCalled();

        spyOn(comp, 'resetDataSets').and.callThrough();
        comp.resetDataSets();
        expect(comp.resetDataSets).toHaveBeenCalled();
    });
});
