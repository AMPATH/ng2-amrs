/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Observable, Subject, of } from 'rxjs';

import { Moh731ReportBaseComponent } from './moh-731-report-base.component';
import { Moh731ReportFiltersComponent } from './moh-731-report-filters.component';
import { Moh731ResourceService } from '../../etl-api/moh-731-resource.service';
import { Moh731ResourceServiceMock } from '../../etl-api/moh-731-resource.service.mock';
import { Router, ActivatedRoute, Params } from '@angular/router';

const mockParams = {
    startDate: '2018-05-01',
    endDate: '2018-05-31',
    locations: 'uuid1',
    indicators: 'test_indicator',
    isLegacy: true
};

class MockRouter {
    public navigate = jasmine.createSpy('navigate');
   }

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe')
      .and
      .returnValue(of(mockParams))
  }
};

describe('Moh731ReportBaseComponent:', () => {
    let fixture: ComponentFixture<Moh731ReportBaseComponent>;
    let comp: Moh731ReportBaseComponent;
    let route: Router;
    let router: ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                Moh731ReportBaseComponent,
              Moh731ReportFiltersComponent
            ],
            providers: [
                { provide: Moh731ResourceService, useClass: Moh731ResourceServiceMock },
                { provide: Router, useClass: MockRouter },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                FormsModule
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(Moh731ReportBaseComponent);
            comp = fixture.componentInstance;
            route = fixture.debugElement.injector.get(Router);
            router = fixture.debugElement.injector.get(ActivatedRoute);

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be injected', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
        expect(fixture.componentInstance.moh731Resource instanceof Moh731ResourceServiceMock)
            .toBe(true);
    });

    it('should generate moh report using paramaters supplied',
        (done) => {
            const fakeReply: any = {
                result: [{
                    location: 'ampath',
                    indicator1: 10,
                    indicator2: 2,
                    indicator3: 3,
                    indicator4: 4
                }],
                sectionDefinitions: [{
                    sectionTitle: '3.2 Enrolled in Care',
                    indicators: [
                        {
                            label: 'Enrolled in care Below 1yr(M)',
                            ref: 'HV03-08',
                            indicator: 'enrolled_in_care_males_lt_one'
                        },
                        {
                            label: 'Enrolled in care Below 1yr(F)',
                            ref: 'HV03-08',
                            indicator: 'enrolled_in_care_females_lt_one'
                        },
                    ]
                }]
            };

            comp = fixture.componentInstance;
            const service = fixture.componentInstance.moh731Resource;
            const mohSpy = spyOn(service, 'getMoh731Report')
                .and.callFake((locationUuids, startDate, endDate, isLegacyReport, isAggregated) => {
                    const subject = new Subject<any>();

                    // check for params conversion accuracy
                    // expect(locationUuids).toBe('uuid-1,uuid-2');
                    expect(startDate).toEqual('2017-01-01T03:00:00+03:00');
                    expect(endDate).toEqual('2017-02-01T03:00:00+03:00');
                    expect(isLegacyReport).toBe(true);
                    expect(isAggregated).toBe(true);

                    // check for state during fetching
                    expect(comp.isLoadingReport).toBe(true);
                    expect(comp.statusError).toBe(false);
                    expect(comp.errorMessage).toBe('');
                    expect(comp.sectionsDef).toEqual([]);
                    expect(comp.data).toEqual([]);

                    setTimeout(() => {
                        subject.next(fakeReply);

                        // check for state after successful loading
                        expect(comp.isLoadingReport).toBe(false);
                        expect(comp.statusError).toBe(false);
                        expect(comp.errorMessage).toBe('');

                        // results should be set
                        expect(comp.sectionsDef).toBe(fakeReply.sectionDefinitions);
                        expect(comp.data).toBe(fakeReply.result);
                        done();
                    });

                    return subject.asObservable();
                });

            // simulate user input
            comp.startDate = new Date('2017-01-01');
            comp.endDate = new Date('2017-02-01');
            // comp.locationUuids = ['uuid-1', 'uuid-2'];
            comp.isAggregated = true;
            comp.isLegacyReport = true;

            // simulate previous erroneous state
            comp.isLoadingReport = false;
            comp.statusError = true;
            comp.errorMessage = 'some error';
            comp.data = [{ some: 'data' }];
            comp.sectionsDef = [{ some: 'sectionDefinitions' }];

            fixture.detectChanges();
            comp.generateReport();

        });

    it('should report errors when generating moh report fails',
        (done) => {
            comp = fixture.componentInstance;
            const service = fixture.componentInstance.moh731Resource;
            const mohSpy = spyOn(service, 'getMoh731Report')
                .and.callFake((locationUuids, startDate, endDate, isLegacyReport, isAggregated) => {
                    const subject = new Subject<any>();

                    setTimeout(() => {
                        subject.error('some error');

                        // check for state after successful loading
                        expect(comp.isLoadingReport).toBe(false);
                        expect(comp.statusError).toBe(false);
                        expect(comp.errorMessage).toEqual('some error');

                        // results should be set
                        expect(comp.sectionsDef).toEqual([]);
                        expect(comp.data).toEqual([]);
                        done();
                    });

                    return subject.asObservable();
                });
            comp.generateReport();
        });

});
