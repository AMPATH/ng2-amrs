import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { CommonModule, Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';
import { SpyLocation } from '@angular/common/testing';

import { Observable, of } from 'rxjs';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { Router, ActivatedRoute } from '@angular/router';
import { HivMonthlySummaryIndicatorsPatientListComponent } from './patient-list.component';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import {
    HivMonthlySummaryIndicatorsResourceService
} from '../../etl-api/hiv-monthly-summary-indicators-resource.service';
class MockRouter {
    navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
    params = of([{ 'id': 1 }]);
}

class FakeHivSummaryIndicatorsResourceService {

    getHivSummaryMonthlyIndicatorsPatientList(params): Observable<any> {
        return of({ status: 'okay' });
    }

}

describe('Component: HivSummaryIndicatorsPatientListComponent', () => {
    let currentTestComponent: HivMonthlySummaryIndicatorsPatientListComponent;
    let currentTestFixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HivMonthlySummaryIndicatorsPatientListComponent
            ],
            imports: [
                NgamrsSharedModule,
                CommonModule,
                AgGridModule,
                DataListsModule,
                DateTimePickerModule
            ]
        }).overrideComponent(HivMonthlySummaryIndicatorsPatientListComponent, {
            set: {
                providers: [
                    {
                        provide: HivMonthlySummaryIndicatorsResourceService,
                        useClass: FakeHivSummaryIndicatorsResourceService
                    },
                    { provide: Router, useClass: MockRouter },
                    {
                        provide: ActivatedRoute, useClass: MockActivatedRoute
                    },
                    { provide: Location, useClass: SpyLocation }
                ]
            }
        }).compileComponents().then(() => {
            currentTestFixture = TestBed.
                createComponent(HivMonthlySummaryIndicatorsPatientListComponent);
            currentTestComponent = currentTestFixture.componentInstance;
        });

    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should have a defined component', (done) => {
        expect(currentTestComponent).toBeDefined();
        done();
    });

    it('should render component properties correctly', (done) => {
        spyOn(currentTestComponent, 'ngOnInit');
        currentTestComponent.startDate = moment(new Date());
        currentTestComponent.endDate = moment(new Date());
        currentTestComponent.locationUuids = ['08fec056-1352-11df-a1f1-0026b9348838'];
        currentTestComponent.translatedIndicator = 'On Arvs';
        currentTestComponent.startAge = 0;
        currentTestComponent.endAge = 120;
        currentTestComponent.ngOnInit();
        currentTestFixture.detectChanges();
        const h3strong: Array<DebugElement> = currentTestFixture.debugElement
            .queryAll(By.css('h3'));
        const h5strong: Array<DebugElement> = currentTestFixture.debugElement
            .queryAll(By.css('h5'));
        const onArvs = h3strong[0].nativeElement;
        const date = h5strong[0].nativeElement;
        expect(h3strong.length).toBe(1);
        expect(h5strong.length).toBe(1);
        expect(onArvs.textContent).toContain('On Arvs');
        expect(date.textContent).toContain(moment(new Date()).format('DD/MM/YYYY'));
        expect(date.textContent).toContain(moment(new Date()).format('DD/MM/YYYY'));
        done();
    });
});
