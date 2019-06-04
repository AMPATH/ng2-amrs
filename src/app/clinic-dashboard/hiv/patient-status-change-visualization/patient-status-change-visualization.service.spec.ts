import { TestBed, async, inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

import {
  PatientStatuChangeVisualizationService
} from './patient-status-change-visualization.service';

describe('PatientStatusChangeVisualizationService', () => {
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockActivatedRoute = {
    params: {
      subscribe: jasmine.createSpy('subscribe')
        .and
        .returnValue(Observable.of({ id: 1 }))
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientStatuChangeVisualizationService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('return column definations when generateColumDefinations() is called',
    inject([PatientStatuChangeVisualizationService],
      (s: PatientStatuChangeVisualizationService) => {
        const definations = s.generateColumnDefinitions('cumulativeAnalysis', 'active_return', []);
        expect(definations).toBeTruthy();
        // expect('1').toEqual(1);
      })
  );

  it('return chart definations  when generateChart() is called',
    inject([PatientStatuChangeVisualizationService],
      (s: PatientStatuChangeVisualizationService) => {
        const data = [{
          'reporting_date': '2016-01-30T21:00:00.000Z',
          'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
          'location_id': 13,
          'reporting_month': '01/2016',
          'total_patients': 10096,
          'active_in_care': 4481,
          'active_in_care_prev_month': 4618,
          'LTFU': 3936,
          'deaths': 1057,
          'transfer_out_patients': 579,
          'HIV_negative_patients': 7,
          'self_disengaged_patients': 36,
          'HIV_negative_patients_this_month': 0,
          'self_disengaged_patients_this_month': -2,
          'new_patients': 16,
          'transfer_in_from_non_Ampath_site': 2,
          'transfer_in_from_Ampath_site': 0,
          'transfer_in': 2,
          'transfer_out_patients_this_month': -22,
          'deaths_this_month': -5,
          'LTFU_this_month': -59,
          'LTFU_to_active_in_care': 40,
          'active_in_care_to_LTFU': -59,
          'active_in_care_to_transfer_out': -10,
          'active_in_care_to_death': -5,
          'patients_lost': -74,
          'patients_gained': 58,
          'patient_change_from_past_month': -16,
          'patients_gained_this_month': 18,
          'patients_lost_this_month': -29,
          'patient_change_this_month': -11,
          'cumulative_deficit': 0
        },
        {
          'reporting_date': '2016-02-28T21:00:00.000Z',
          'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
          'location_id': 13,
          'reporting_month': '02/2016',
          'total_patients': 10207,
          'active_in_care': 4554,
          'active_in_care_prev_month': 4699,
          'LTFU': 3958,
          'deaths': 1065,
          'transfer_out_patients': 587,
          'HIV_negative_patients': 7,
          'self_disengaged_patients': 36,
          'HIV_negative_patients_this_month': 0,
          'self_disengaged_patients_this_month': 0,
          'new_patients': 25,
          'transfer_in_from_non_Ampath_site': 2,
          'transfer_in_from_Ampath_site': 0,
          'transfer_in': 2,
          'transfer_out_patients_this_month': -13,
          'deaths_this_month': -7,
          'LTFU_this_month': -67,
          'LTFU_to_active_in_care': 37,
          'active_in_care_to_LTFU': -66,
          'active_in_care_to_transfer_out': -9,
          'active_in_care_to_death': -7,
          'patients_lost': -82,
          'patients_gained': 64,
          'patient_change_from_past_month': -18,
          'patients_gained_this_month': 27,
          'patients_lost_this_month': -20,
          'patient_change_this_month': 7,
          'cumulative_deficit': 0
        },
        {
          'reporting_date': '2016-03-30T21:00:00.000Z',
          'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
          'location_id': 13,
          'reporting_month': '03/2016',
          'total_patients': 10176,
          'active_in_care': 4499,
          'active_in_care_prev_month': 4626,
          'LTFU': 3962,
          'deaths': 1074,
          'transfer_out_patients': 598,
          'HIV_negative_patients': 7,
          'self_disengaged_patients': 36,
          'HIV_negative_patients_this_month': 0,
          'self_disengaged_patients_this_month': 0,
          'new_patients': 24,
          'transfer_in_from_non_Ampath_site': 4,
          'transfer_in_from_Ampath_site': 0,
          'transfer_in': 4,
          'transfer_out_patients_this_month': -13,
          'deaths_this_month': -8,
          'LTFU_this_month': -50,
          'LTFU_to_active_in_care': 30,
          'active_in_care_to_LTFU': -50,
          'active_in_care_to_transfer_out': -7,
          'active_in_care_to_death': -8,
          'patients_lost': -65,
          'patients_gained': 58,
          'patient_change_from_past_month': -7,
          'patients_gained_this_month': 28,
          'patients_lost_this_month': -21,
          'patient_change_this_month': 7,
          'cumulative_deficit': 0
        },
        {
          'reporting_date': '2017-03-30T21:00:00.000Z',
          'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
          'location_id': 13,
          'reporting_month': '03/2017',
          'total_patients': 10460,
          'active_in_care': 4536,
          'active_in_care_prev_month': 4612,
          'LTFU': 4047,
          'deaths': 1145,
          'transfer_out_patients': 685,
          'HIV_negative_patients': 9,
          'self_disengaged_patients': 38,
          'HIV_negative_patients_this_month': 0,
          'self_disengaged_patients_this_month': 0,
          'new_patients': 29,
          'transfer_in_from_non_Ampath_site': 1,
          'transfer_in_from_Ampath_site': 0,
          'transfer_in': 1,
          'transfer_out_patients_this_month': -9,
          'deaths_this_month': -8,
          'LTFU_this_month': -22,
          'LTFU_to_active_in_care': 21,
          'active_in_care_to_LTFU': -22,
          'active_in_care_to_transfer_out': -5,
          'active_in_care_to_death': -7,
          'patients_lost': -34,
          'patients_gained': 51,
          'patient_change_from_past_month': 17,
          'patients_gained_this_month': 30,
          'patients_lost_this_month': -17,
          'patient_change_this_month': 13,
          'cumulative_deficit': 0
        },
        {
          'reporting_date': '2017-04-29T21:00:00.000Z',
          'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
          'location_id': 13,
          'reporting_month': '04/2017',
          'total_patients': 10462,
          'active_in_care': 4510,
          'active_in_care_prev_month': 4602,
          'LTFU': 4064,
          'deaths': 1153,
          'transfer_out_patients': 688,
          'HIV_negative_patients': 9,
          'self_disengaged_patients': 38,
          'HIV_negative_patients_this_month': 0,
          'self_disengaged_patients_this_month': 0,
          'new_patients': 19,
          'transfer_in_from_non_Ampath_site': 0,
          'transfer_in_from_Ampath_site': 0,
          'transfer_in': 0,
          'transfer_out_patients_this_month': -7,
          'deaths_this_month': -5,
          'LTFU_this_month': -40,
          'LTFU_to_active_in_care': 14,
          'active_in_care_to_LTFU': -40,
          'active_in_care_to_transfer_out': -5,
          'active_in_care_to_death': -5,
          'patients_lost': -50,
          'patients_gained': 33,
          'patient_change_from_past_month': -17,
          'patients_gained_this_month': 19,
          'patients_lost_this_month': -12,
          'patient_change_this_month': 7,
          'cumulative_deficit': 0
        }];
        const definations = s.generateChart({
          renderType: 'cumulativeAnalysis',
          analysisType: 'active_return',
          data: data
        });
        expect(definations).toBeTruthy();
      })
  );
});
