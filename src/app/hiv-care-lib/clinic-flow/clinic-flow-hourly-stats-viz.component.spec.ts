/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChartModule } from 'angular2-highcharts';

import { ClinicFlowHourlyStatsVizComponent } from './clinic-flow-hourly-stats-viz.component';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';

describe('ClinicFlowHourlyStatsVizComponent:', () => {
    let fixture: ComponentFixture<ClinicFlowHourlyStatsVizComponent>;
    let comp: ClinicFlowHourlyStatsVizComponent;

    const testData: Array<any> = [
        {
            'time': '8',
            'triaged': 9,
            'registered': 15,
            'seen': 3
        },
        {
            'time': '9',
            'triaged': 21,
            'registered': 21,
            'seen': 10
        },
        {
            'time': '10',
            'triaged': 17,
            'registered': 21,
            'seen': 19
        },
        {
            'time': '11',
            'triaged': 19,
            'registered': 19,
            'seen': 14
        },
        {
            'time': '12',
            'triaged': 16,
            'registered': 15,
            'seen': 20
        },
        {
            'time': '13',
            'triaged': null,
            'registered': 2,
            'seen': 13
        },
        {
            'time': '14',
            'triaged': 6,
            'registered': 8,
            'seen': 3
        },
        {
            'time': '15',
            'triaged': 10,
            'registered': 5,
            'seen': 11
        },
        {
            'time': '16',
            'triaged': 1,
            'registered': 1,
            'seen': 3
        },
        {
            'time': '18',
            'triaged': 1,
            'registered': 1,
            'seen': 1
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ClinicFlowHourlyStatsVizComponent],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                ChartModule.forRoot(require('highcharts')),
                NgamrsSharedModule
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ClinicFlowHourlyStatsVizComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be injected', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeDefined();

        // other examples
        // expect(el.nativeElement.textContent).toContain('Test Title');
        // fixture.whenStable().then(() => {
        //     fixture.detectChanges();
        //     expect((fixture.debugElement.classes as any).className).toBe(true);
        // });
    });

    it('should generate the HighChart x-axis categories for the bar chart',
        () => {
            fixture.detectChanges();
            comp = fixture.componentInstance;

            const generatedAxis: any = comp.generateXaxisHighChartObject(testData);

            expect(generatedAxis).toEqual(
                {
                    categories: [
                        '08:00',
                        '09:00',
                        '10:00',
                        '11:00',
                        '12:00',
                        '13:00',
                        '14:00',
                        '15:00',
                        '16:00',
                        '17:00',
                        '18:00'
                    ]
                }
            );
        });

    it('should generate the HighChart series array for a bar chart', () => {
        fixture.detectChanges();
        comp = fixture.componentInstance;

        const generatedAxis: any = comp.generateXaxisHighChartObject(testData);

        const generatedSeries: Array<any> =
            comp.generateHighChartBarChartSeries(generatedAxis.categories, testData);

        expect(generatedSeries).toEqual(
            [
                {
                    name: 'Registered',
                    data: [15, 21, 21, 19, 15, 2, 8, 5, 1, 0, 1]
                },
                {
                    name: 'Triaged',
                    data: [9, 21, 17, 19, 16, 0, 6, 10, 1, 0, 1]
                },
                {
                    name: 'Seen by Clinician',
                    data: [3, 10, 19, 14, 20, 13, 3, 11, 3, 0, 1]
                }
            ]
        );
    });

});
