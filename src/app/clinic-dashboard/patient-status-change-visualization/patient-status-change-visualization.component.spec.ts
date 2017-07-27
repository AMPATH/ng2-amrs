import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { ChartModule } from 'angular2-highcharts';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { GenericListComponent } from '../../shared/data-lists/generic-list/generic-list.component';

import { PatientStatusChangeVisualizationComponent }
    from './patient-status-change-visualization.component';
import { PatientStatuChangeVisualizationService }
    from './patient-status-change-visualization.service';

describe('MonthlyScheduleComponent', () => {
    let fixture: ComponentFixture<PatientStatusChangeVisualizationComponent>;
    let comp: PatientStatusChangeVisualizationComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ChartModule, AgGridModule],
            declarations: [PatientStatusChangeVisualizationComponent, GenericListComponent],
            providers: [
                PatientStatusChangeVisualizationComponent,
                PatientStatuChangeVisualizationService
            ]
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PatientStatusChangeVisualizationComponent);
                comp = fixture.componentInstance;
            });
    }));

});

