import { Injectable } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class MockHivSummaryIndicatorsResourceService {
    dummyHivSummaryIndicatorsData = {
        startIndex: '0',
        size: 1,
        result: [
            {
                location: 'MTRH Module 2',
                location_uuid: '08fec056-1352-11df-a1f1-0026b9348838',
                location_id: 13,
                encounter_datetime: '2017-03-06T09:17:48.000Z',
                month: '2017-03-06T09:17:48.000Z',
                patients: 2672,
                on_arvs: 2650,
                on_arvs_first_line: 2293,
                on_arvs_second_line: 354,
                on_arvs_third_line: 3,
                on_arvs_lte_52_weeks_and_have_vl: 351,
                on_arvs_lte_52_weeks_and_have_vl_lte_1000: 224,
                pregnant: 0,
                pregnant_and_on_arvs: 0,
                viral_load_resulted_in_past_year: 2412,
                perc_on_arvs: 0.9918
            }
        ],
        indicatorDefinitions: [
            {
                name: 'patients',
                label: 'patients',
                description: 'Total number of patients',
                expression: 'true'
            },
            {
                name: 'on_arvs',
                label: 'on arvs',
                description: 'Total # of patients who are on ARVs',
                expression: 'cur_arv_line is not null'
            },
            {
                name: 'on_arvs_first_line',
                label: 'on arvs first line',
                description: '# of patient on ARVs first line',
                expression: 'cur_arv_line=1'
            },
            {
                name: 'on_arvs_second_line',
                label: 'on arvs second line',
                description: '# of patient on ARVs second line',
                expression: 'cur_arv_line=2 and coalesce(transfer_out, out_of_care) is null'
            },
            {
                name: 'newly_on_second_line',
                label: 'newly on second line',
                description: 'patient newly on second line within a given period',
                expression: 'cur_arv_line =2 and (arv_start_date between @startDate and @endDate)'
            },
            {
                name: 'on_arvs_third_line',
                label: 'on arvs third line',
                description: '# of patient on ARVs third line',
                expression: 'cur_arv_line>2'
            },
            {
                name: 'vl_done_past_year',
                label: 'vl done past year',
                description: '# of patient(s) whose Viral Load have been taken in the past 1 year',
                expression: 'timestampdiff(week,vl_1_date,encounter_datetime) <= 52'
            },
            {
                name: 'vl_done_past_year_relative_to_end_date',
                label: 'vl done past year relative to end date',
                description: '# of patient(s) whose Viral Load have been taken in the past 1 year',
                expression: 'timestampdiff(week,vl_1_date,@endDate) <= 52'
            },
            {
                name: 'on_second_line_not_suppressed',
                label: 'on second line not suppressed',
                description: 'patient on second line not suppressed',
                expression: 'vl_1 > 1000 and cur_arv_line =2'
            },
            {
                name: 'not_on_arvs_cd4_lte_500',
                label: 'patient not_on_arvs_cd4_lte_500',
                description: 'patients who qualify for ART but are not on therapy',
                expression: 'arv_start_date is null and cd4_1 < 500'
            },
            {
                name: 'vl_done_past_year_gt_1000',
                label: 'vl done past year gt 1000',
                description: '# of patient(s) whose Viral Load is Greater Than 1000',
                expression: 'timestampdiff(week,vl_1_date,encounter_datetime) <= 52 and vl_1 > 1000'
            },
            {
                name: 'vl_done_this_encounter',
                label: 'vl done this encounter',
                description: '# of patient(s) whose Viral Load has been taken in this encounter',
                expression: 'vl_resulted >= 0 and vl_resulted_date=date(encounter_datetime)'
            },
            {
                name: 'vl_done_this_encounter_lte_1000',
                label: 'vl done this encounter lte 1000',
                description: '# of patient(s) whose Viral Load in this encounter is Less Than 1000',
                expression: 'vl_resulted <= 1000 and vl_resulted_date = date(encounter_datetime)'
            },
            {
                name: 'vl_ordered',
                label: 'vl ordered',
                description: '# of patient(s) whose Viral Load has been ordered',
                expression: 'vl_order_date=encounter_datetime'
            },
            {
                name: 'on_arvs_lte_26_weeks',
                label: 'on arvs lte 26 weeks',
                description: '# of patient(s) who have been on ARVs for the last 26 weeks or less',
                expression: 'timestampdiff(week,arv_start_date,encounter_datetime) <= 26'
            },
            {
                name: 'on_arvs_lte_52_weeks',
                label: 'on arvs lte 52 weeks',
                description: '# of patient(s) who have been on ARVs for the last 52 weeks or less',
                expression: 'timestampdiff(week,arv_start_date,encounter_datetime) <= 52'
            },
            {
                name: 'pregnant',
                label: 'pregnant',
                description: '# of pregnant patients in a given time period',
                expression: 'edd > encounter_datetime'
            },
            {
                name: 'pregnant_and_on_arvs',
                label: 'pregnant and on arvs',
                description: '# of pregnant patients and are on ARVs in a given time period',
                expression: 'edd > encounter_datetime and cur_arv_line is not null'
            },
            {
                name: 'virally_suppressed_in_past_year',
                label: 'virally suppressed in past year',
                description: '# of patient(s) who are virally suppressed in the past one year',
                expression: 'vl_1 < 1000 and timestampdiff(week,vl_1_date,encounter_datetime) <= 52'
            },
            {
                name: 'not_virally_suppressed_in_past_year',
                label: 'not virally suppressed in past year',
                description: '# of patient(s) who are not virally suppressed in the past one year',
                expression: 'vl_1> 1000 and timestampdiff(week,vl_1_date,encounter_datetime) <= 52'
            },
            {
                name: 'perc_virally_suppressed_in_past_year',
                label: 'perc virally suppressed in past year',
                description: '% of patient(s) who are virally suppressed in the past one year',
                expression: ''
            },
            {
                name: 'perc_not_virally_suppressed_in_past_year',
                label: 'perc not virally suppressed in past year',
                description: '% of patient(s) who are not virally suppressed in the past one year',
                expression: ''
            },
            {
                name: 'perc_on_arvs',
                label: 'perc on arvs',
                description: '% of patients who are on ARVs',
                expression: ''
            },
            {
                name: 'perc_on_arv_first_line',
                label: 'perc on arv first line',
                description: '% of patients on ARVs first line',
                expression: ''
            },
            {
                name: 'perc_on_arv_second_line',
                label: 'perc on arv second line',
                description: '% of patients on ARVs second line',
                expression: ''
            },
            {
                name: 'perc_with_pending_viral_load',
                label: 'perc with pending viral load',
                description: '% of patients with pending viral load',
                expression: ''
            },
            {
                name: 'perc_on_arvs_lte_6_months',
                label: 'perc on arvs lte 6 months',
                description: '% of patients who have been on ARVs for less than 6 months',
                expression: ''
            },
            {
                name: 'on_arvs_gt_26_weeks',
                label: 'on arvs gt 26 weeks',
                description: '# of patient(s) who have been on ARVs 26 weeks or more',
                expression: 'timestampdiff(week,arv_start_date,encounter_datetime) > 26'
            },
            {
                name: 'perc_on_arvs_gt_6_months',
                label: 'perc on arvs gt 6 months',
                description: '% of patients who have been on ARVs for more than 6 months',
                expression: ''
            }
        ]
    };

    constructor() { }


    getHivSummaryIndicators(locations, startDate, endDate, gender, indicators,
        limit, startIndex): Observable<any> {
        return Observable.of(this.dummyHivSummaryIndicatorsData);
    }

    getHivSummaryIndicatorsDummyData() {
        return this.dummyHivSummaryIndicatorsData;
    }

}

