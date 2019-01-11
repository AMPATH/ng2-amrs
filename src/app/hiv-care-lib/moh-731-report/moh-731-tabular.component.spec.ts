/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular/main';

import { Moh731TabularComponent } from './moh-731-tabular.component';

describe('Moh731TabularComponent: ', () => {
    let fixture: ComponentFixture<Moh731TabularComponent>;
    let comp: Moh731TabularComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                Moh731TabularComponent
            ],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                AgGridModule.withComponents([])
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(Moh731TabularComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be injectable', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();

        // other examples
        // expect(el.nativeElement.textContent).toContain('Test Title');
        // fixture.whenStable().then(() => {
        //     fixture.detectChanges();
        //     expect((fixture.debugElement.classes as any).className).toBe(true);
        // });
    });

    it('should convert moh section definition object to ag-grid column definition object',
        () => {
            const sectionsDef = [
                {
                    'sectionTitle': '3.2 Enrolled in Care',
                    'indicators': [
                        {
                            'label': 'Enrolled in care Below 1yr(M)',
                            'ref': 'HV03-08',
                            'indicator': 'enrolled_in_care_males_lt_one'
                        },
                        {
                            'label': 'Enrolled in care Below 1yr(F)',
                            'ref': 'HV03-08',
                            'indicator': 'enrolled_in_care_females_lt_one'
                        },
                        {
                            'label': 'Enrolled in care Below 15yrs(M)',
                            'ref': 'HV03-09',
                            'indicator': 'enrolled_in_care_males_below_15'
                        }]
                },
                {
                    'sectionTitle': '3.3 Currently in Care' +
                        ' -(from the total sheet-this month only and from last 2 months)',
                    'indicators': [
                        {
                            'label': 'Currently in care Below 1yr(M)',
                            'ref': 'HV03-14',
                            'indicator': 'currently_in_care_males_lt_one'
                        },
                        {
                            'label': 'Currently in care Below 1yr(F)',
                            'ref': 'HV03-14',
                            'indicator': 'currently_in_care_females_lt_one'
                        }]
                }
            ];

            fixture.detectChanges();
            const component = fixture.componentInstance;
            component.setColumns(sectionsDef);

            const expected = [
                {
                    headerName: 'Location',
                    field: 'location',
                    pinned: 'left'
                },
                {
                    headerName: '3.2 Enrolled in Care',
                    children: [
                        {
                            headerName: 'Enrolled in care Below 1yr(M)',
                            onCellClicked: (c) => { },
                            field: 'enrolled_in_care_males_lt_one'
                        },
                        {
                            headerName: 'Enrolled in care Below 1yr(F)',
                            onCellClicked: (c) => { },
                            field: 'enrolled_in_care_females_lt_one'
                        },
                        {
                            headerName: 'Enrolled in care Below 15yrs(M)',
                            onCellClicked: (c) => { },
                            field: 'enrolled_in_care_males_below_15'
                        }
                    ]
                },
                {
                    headerName: '3.3 Currently in Care' +
                        ' -(from the total sheet-this month only and from last 2 months)',
                    children: [
                        {
                            headerName: 'Currently in care Below 1yr(M)',
                            onCellClicked: (c) => { },
                            field: 'currently_in_care_males_lt_one'
                        },
                        {
                            headerName: 'Currently in care Below 1yr(F)',
                            onCellClicked: (c) => { },
                            field: 'currently_in_care_females_lt_one'
                        }
                    ]
                },
            ];

            expect(JSON.stringify(component.gridOptions.columnDefs))
                .toEqual(JSON.stringify(expected));

            // should also create columns when setter is set
            component.gridOptions = { columnDefs: [] };
            fixture.detectChanges();

            component.sectionDefs = sectionsDef;
            fixture.detectChanges();
            expect(JSON.stringify(component.gridOptions.columnDefs))
                .toEqual(JSON.stringify(expected));

        });
});
