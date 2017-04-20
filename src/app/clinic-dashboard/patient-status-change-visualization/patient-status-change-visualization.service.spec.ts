/*
 * Testing a Service
 * More info: https://angular.io/docs/ts/latest/guide/testing.html
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { PatientStatuChangeVisualizationService }
    from './patient-status-change-visualization.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('PatientStatuChangeVisualizationService', () => {
    let service;
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    let mockActivatedRoute = { params: {
    subscribe: jasmine.createSpy('subscribe')
     .and
     .returnValue(Observable.of({id: 1}))
    }};
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientStatuChangeVisualizationService,
                 { provide: Router, useValue: mockRouter },
                 { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ]
        });
    });

    it('return column definations when generateColumDefinations() is called',
        inject([PatientStatuChangeVisualizationService],
            (s: PatientStatuChangeVisualizationService) => {
                let definations = s.generateColumDefinations();
                expect(definations).toBeTruthy();
                // expect('1').toEqual(1);
            })
    );

    it('return chart definations  when generateChart() is called',
        inject([PatientStatuChangeVisualizationService],
            (s: PatientStatuChangeVisualizationService) => {
                let data = [{
                    'reporting_date': '2016-01-29T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '01/2016',
                    'total_patients': 107,
                    'active_patients': 94,
                    'new_patients': 5,
                    'transfer_in': 2,
                    'ltfu_to_active': 0,
                    'transfer_out': -1,
                    'death': -2,
                    'active_to_ltfu': -10,
                    'gained': 7,
                    'lost': 13,
                    'change': -6
                },
                {
                    'reporting_date': '2016-02-30T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '02/2016',
                    'total_patients': 110,
                    'active_patients': 89,
                    'new_patients': 2,
                    'transfer_in': 1,
                    'ltfu_to_active': 3,
                    'transfer_out': -1,
                    'death': -1,
                    'active_to_ltfu': -9,
                    'gained': 6,
                    'lost': 11,
                    'change': -5
                },
                {
                    'reporting_date': '2016-06-29T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '03/2016',
                    'total_patients': 113,
                    'active_patients': 89,
                    'new_patients': 0,
                    'transfer_in': 3,
                    'ltfu_to_active': 9,
                    'transfer_out': -3,
                    'death': -3,
                    'active_to_ltfu': -6,
                    'gained': 12,
                    'lost': 12,
                    'change': 0
                },
                {
                    'reporting_date': '2016-07-30T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '04/2016',
                    'total_patients': 119,
                    'active_patients': 83,
                    'new_patients': 2,
                    'transfer_in': 4,
                    'ltfu_to_active': 8,
                    'transfer_out': -10,
                    'death': -2,
                    'active_to_ltfu': -8,
                    'gained': 14,
                    'lost': 20,
                    'change': -6
                },
                {
                    'reporting_date': '2016-05-30T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '05/2016',
                    'total_patients': 130,
                    'active_patients': 86,
                    'new_patients': 2,
                    'transfer_in': 9,
                    'ltfu_to_active': 5,
                    'transfer_out': -7,
                    'death': -1,
                    'active_to_ltfu': -5,
                    'gained': 16,
                    'lost': 13,
                    'change': 3
                },
                {
                    'reporting_date': '2016-06-29T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '06/2016',
                    'total_patients': 139,
                    'active_patients': 89,
                    'new_patients': 1,
                    'transfer_in': 8,
                    'ltfu_to_active': 4,
                    'transfer_out': -6,
                    'death': 0,
                    'active_to_ltfu': -4,
                    'gained': 13,
                    'lost': 10,
                    'change': 3
                },
                {
                    'reporting_date': '2016-07-30T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '07/2016',
                    'total_patients': 159,
                    'active_patients': 144,
                    'new_patients': 10,
                    'transfer_in': 10,
                    'ltfu_to_active': 8,
                    'transfer_out': -2,
                    'death': 0,
                    'active_to_ltfu': -1,
                    'gained': 28,
                    'lost': 3,
                    'change': 25
                },
                {
                    'reporting_date': '2016-08-29T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'total_patients': 175,
                    'reporting_month': '08/2016',
                    'active_patients': 127,
                    'new_patients': 8,
                    'transfer_in': 8,
                    'ltfu_to_active': 2,
                    'transfer_out': -5,
                    'death': 0,
                    'active_to_ltfu': 0,
                    'gained': 18,
                    'lost': 5,
                    'change': 13
                },
                {
                    'reporting_date': '2016-09-30T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '09/2016',
                    'total_patients': 185,
                    'active_patients': 132,
                    'new_patients': 8,
                    'transfer_in': 2,
                    'ltfu_to_active': 6,
                    'transfer_out': -6,
                    'death': -2,
                    'active_to_ltfu': -3,
                    'gained': 16,
                    'lost': 11,
                    'change': 5
                },
                {
                    'reporting_date': '2016-10-30T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '10/2016',
                    'total_patients': 196,
                    'active_patients': 128,
                    'new_patients': 7,
                    'transfer_in': 4,
                    'ltfu_to_active': 0,
                    'transfer_out': -7,
                    'death': -2,
                    'active_to_ltfu': -6,
                    'gained': 11,
                    'lost': 15,
                    'change': -4
                },
                {
                    'reporting_date': '2016-11-27T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '11/2016',
                    'total_patients': 206,
                    'active_patients': 125,
                    'new_patients': 7,
                    'transfer_in': 3,
                    'ltfu_to_active': 2,
                    'transfer_out': -3,
                    'death': -3,
                    'active_to_ltfu': -9,
                    'gained': 12,
                    'lost': 15,
                    'change': -3
                },
                {
                    'reporting_date': '2016-12-30T21:00:00.000Z',
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'location_id': 13,
                    'reporting_month': '12/2016',
                    'total_patients': 210,
                    'active_patients': 117,
                    'new_patients': 3,
                    'transfer_in': 1,
                    'ltfu_to_active': 7,
                    'transfer_out': -10,
                    'death': -2,
                    'active_to_ltfu': -7,
                    'gained': 11,
                    'lost': 19,
                    'change': -8
                }];
                let barIndicators = ['active_patients', 'new_patients',
                    'transfer_in', 'ltfu_to_active', 'transfer_out',
                    'death', 'active_to_ltfu', 'gained', 'lost', 'change'];
                let lineIndicators = ['total_patients'];
                let definations = s.generateChart({
                    lineIndicators: lineIndicators,
                    barIndicators: barIndicators, data: data
                });
                expect(definations).toBeTruthy();
                // expect('1').toEqual(1);
            })
    );
});
