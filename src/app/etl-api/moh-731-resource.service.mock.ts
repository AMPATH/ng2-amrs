import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Moh731ResourceService } from './moh-731-resource.service';

@Injectable()
export class Moh731ResourceServiceMock extends Moh731ResourceService {
  constructor() {
    super(null, null, null);
  }

  public getMoh731Report(
    locationUuids: string,
    startDate: string,
    endDate: string,
    isLegacyReport: boolean,
    isAggregated: boolean,
    cacheTtl: number = 0
  ): Observable<any> {
    const subj = new Subject<any>();
    const that = this;
    setTimeout(() => {
      subj.next(that.getTestData());
    }, 100);

    return subj.asObservable();
  }

  public getTestData() {
    return {
      startIndex: 0,
      size: 1,
      result: [
        {
          location: 'MTRH Module 1',
          location_uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
          location_id: null,
          joining_column: null,
          currently_in_care_total: 7927,
          currently_in_care_males_lt_one: 0,
          currently_in_care_females_lt_one: 0,
          currently_in_care_males_below_15: 1,
          currently_in_care_females_below_15: 1,
          currently_in_care_males_15_and_older: 2635,
          currently_in_care_females_15_and_older: 5290,
          revisits_on_art_total: 7909,
          revisits_on_art_males_lt_one: 0,
          revisits_on_art_females_lt_one: 0,
          revisits_on_art_males_below_15: 1,
          revisits_on_art_females_below_15: 1,
          revisits_on_art_males_15_and_older: 1,
          revisits_on_art_females_15_and_older: 5282,
          on_pcp_prophylaxis: 7888,
          on_pcp_prophylaxis_below_15: 2,
          on_pcp_prophylaxis_15_and_above: 7886,
          on_pcp_prophylaxis_males_below_15: 1,
          on_pcp_prophylaxis_females_below_15: 1,
          on_pcp_prophylaxis_males_15_and_above: 2623,
          on_pcp_prophylaxis_females_15_and_above: 5263,
          hiv_exposed_infants_below_2_months: 0,
          hiv_exposed_infants_on_pcp_prophylaxis_2_months_and_below: 0,
          screened_for_tb: 3287,
          screened_for_tb_males_below_15: 0,
          screened_for_tb_females_below_15: 0,
          screened_for_tb_males_15_and_older: 1049,
          screened_for_tb_females_15_and_older: 2238,
          using_modern_contracept_method: 146,
          on_art: 7919,
          on_art_total: 7919,
          on_art_males_lt_one: 0,
          on_art_females_lt_one: 0,
          on_art_males_below_15: 1,
          on_art_females_below_15: 1,
          on_art_males_15_and_older: 2629,
          on_art_females_15_and_older: 5288,
          enrolled_in_care_total: 57,
          enrolled_in_care_males_lt_one: 0,
          enrolled_in_care_females_lt_one: 0,
          enrolled_in_care_males_below_15: 0,
          enrolled_in_care_females_below_15: 0,
          enrolled_in_care_males_15_and_older: 19,
          enrolled_in_care_females_15_and_older: 38,
          condoms_provided: 2245,
          female_gte_18yo_visits: 2401,
          scheduled_visits: 2228,
          unscheduled_visits: 1263,
          total_visits: 3491,
          starting_art_total: 61,
          starting_art_males_lt_one: 0,
          starting_art_females_lt_one: 0,
          starting_art_males_below_15: 0,
          starting_art_females_below_15: 0,
          starting_art_males_15_and_older: 18,
          starting_art_females_15_and_older: 43,
          starting_art_and_has_tb: 3,
          on_alternative_first_line: 0,
          on_original_first_line: 0,
          art_net_cohort_at_12_months: 0,
          total_on_therapy_at_12_months: 0,
          on_second_line_or_higher: 0,
          ever_on_art: null,
          ever_on_art_below_15: null,
          ever_on_art_males_below_15: null,
          ever_on_art_females_below_15: null,
          ever_on_art_15_and_older: null,
          ever_on_art_males_15_and_older: null,
          ever_on_art_females_15_and_older: null
        }
      ],
      indicatorDefinitions: [],
      sectionDefinitions: [
        {
          sectionTitle: '3.1 On Cotrimoxazole Prophylaxis (within 2 months)',
          indicators: [
            {
              label: 'HIV Exposed Infants (within 2 months)',
              ref: 'HV03-01',
              indicator: 'hiv_exposed_infants_below_2_months'
            },
            {
              label: 'HIV Exposed Infant (Eligible for CTX within 2 months)',
              ref: 'HV03-02',
              indicator:
                'hiv_exposed_infants_on_pcp_prophylaxis_2_months_and_below'
            },
            {
              label: 'On CTX Below 15 yrs(M)',
              ref: 'HV03-03',
              indicator: 'on_pcp_prophylaxis_males_below_15'
            },
            {
              label: 'On CTX Below 15 yrs(F)',
              ref: 'HV03-04',
              indicator: 'on_pcp_prophylaxis_females_below_15'
            },
            {
              label: 'On CTX 15 yrs and Older(M)',
              ref: 'HV03-05',
              indicator: 'on_pcp_prophylaxis_males_15_and_above'
            },
            {
              label: 'On CTX 15 yrs and Older(F)',
              ref: 'HV03-06',
              indicator: 'on_pcp_prophylaxis_females_15_and_above'
            },
            {
              label: 'Total on CTX (Sum HV03-03 TO HV03-06)',
              ref: 'HV03-07',
              indicator: 'on_pcp_prophylaxis'
            }
          ]
        },
        {
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
            {
              label: 'Enrolled in care Below 15yrs(M)',
              ref: 'HV03-09',
              indicator: 'enrolled_in_care_males_below_15'
            },
            {
              label: 'Enrolled in care Below 15yrs(F)',
              ref: 'HV03-10',
              indicator: 'enrolled_in_care_females_below_15'
            },
            {
              label: 'Enrolled in care 15yrs & Older(M)',
              ref: 'HV03-11',
              indicator: 'enrolled_in_care_males_15_and_older'
            },
            {
              label: 'Enrolled in care 15yrs & Older(F)',
              ref: 'HV03-12',
              indicator: 'enrolled_in_care_females_15_and_older'
            },
            {
              label: 'Enrolled in care - Total (Sum HV03-09 to HV03-12)',
              ref: 'HV03-13',
              indicator: 'enrolled_in_care_total'
            }
          ]
        },
        {
          sectionTitle:
            '3.3 Currently in Care' +
            ' -(from the total sheet-this month only and from last 2 months)',
          indicators: [
            {
              label: 'Currently in care Below 1yr(M)',
              ref: 'HV03-14',
              indicator: 'currently_in_care_males_lt_one'
            },
            {
              label: 'Currently in care Below 1yr(F)',
              ref: 'HV03-14',
              indicator: 'currently_in_care_females_lt_one'
            },
            {
              label: 'Currently in care Below 15yrs(M)',
              ref: 'HV03-15',
              indicator: 'currently_in_care_males_below_15'
            },
            {
              label: 'Currently in care Below 15yrs(F)',
              ref: 'HV03-16',
              indicator: 'currently_in_care_females_below_15'
            },
            {
              label: 'Currently in care 15yrs and older(M)',
              ref: 'HV03-17',
              indicator: 'currently_in_care_males_15_and_older'
            },
            {
              label: 'Currently in care 15yrs and older(F)',
              ref: 'HV03-18',
              indicator: 'currently_in_care_females_15_and_older'
            },
            {
              label: 'Currently in Care-Total (Sum HV03-15 to HV03-18)',
              ref: 'HV03-19',
              indicator: 'currently_in_care_total'
            }
          ]
        },
        {
          sectionTitle: '3.4 Starting ART',
          indicators: [
            {
              label: 'Starting ART -Below 1yr(M)',
              ref: 'HV03-20',
              indicator: 'starting_art_males_lt_one'
            },
            {
              label: 'Starting ART -Below 1yr(F)',
              ref: 'HV03-20',
              indicator: 'starting_art_females_lt_one'
            },
            {
              label: 'Starting ART -Below 15yrs(M)',
              ref: 'HV03-21',
              indicator: 'starting_art_males_below_15'
            },
            {
              label: 'Starting ART -Below 15yrs(F)',
              ref: 'HV03-22',
              indicator: 'starting_art_females_below_15'
            },
            {
              label: 'Starting ART -15yr and Older(M)',
              ref: 'HV03-23',
              indicator: 'starting_art_males_15_and_older'
            },
            {
              label: 'Starting ART -15yr and Older(F)',
              ref: 'HV03-24',
              indicator: 'starting_art_females_15_and_older'
            },
            {
              label: 'Starting on ART -Total (Sum HV03-21 to HV03-24)',
              ref: 'HV03-25',
              indicator: 'starting_art_total'
            },
            {
              label: 'Starting -Pregnant',
              ref: 'HV03-26',
              indicator: 'Starting_Pregnant'
            },
            {
              label: 'Starting -TB Patient',
              ref: 'HV03-27',
              indicator: 'starting_art_and_has_tb'
            }
          ]
        },
        {
          sectionTitle:
            '3.5 Revisits on ART' +
            ' (from the tally sheet -this month only and from last 2 months)',
          indicators: [
            {
              label: 'Revisit on ART -Below 1yr(M)',
              ref: 'HV03-28',
              indicator: 'revisits_on_art_males_lt_one'
            },
            {
              label: 'Revisit on ART -Below 1yr(F)',
              ref: 'HV03-28',
              indicator: 'revisits_on_art_females_lt_one'
            },
            {
              label: 'Revisit on ART -Below 15yrs(M)',
              ref: 'HV03-29',
              indicator: 'revisits_on_art_males_below_15'
            },
            {
              label: 'Revisit on ART -Below 15yrs(F)',
              ref: 'HV03-30',
              indicator: 'revisits_on_art_females_below_15'
            },
            {
              label: 'Revisit on ART -15yrs and older(M)',
              ref: 'HV03-31',
              indicator: 'revisits_on_art_males_15_and_older'
            },
            {
              label: 'Revisit on ART -15yrs and older(F)',
              ref: 'HV03-32',
              indicator: 'revisits_on_art_females_15_and_older'
            },
            {
              label: 'Total Revisit on ART (Sum HV03-29 to HV03-32)',
              ref: 'HV03-33',
              indicator: 'revisits_on_art_total'
            }
          ]
        },
        {
          sectionTitle:
            '3.6 Currently on ART' +
            ' [ALL] - (Add 3.4 and 3.5 e.g HV03-34=HV03-20+HV03-28)',
          indicators: [
            {
              label: 'Currently on ART - Below 1yr(M)',
              ref: 'HV03-34',
              indicator: 'on_art_males_lt_one'
            },
            {
              label: 'Currently on ART - Below 1yr(F)',
              ref: 'HV03-34',
              indicator: 'on_art_females_lt_one'
            },
            {
              label: 'Currently on ART - Below 15 yrs(M)',
              ref: 'HV03-35',
              indicator: 'on_art_males_below_15'
            },
            {
              label: 'Currently on ART - Below 15 yrs(F)',
              ref: 'HV03-36',
              indicator: 'on_art_females_below_15'
            },
            {
              label: 'Currently on ART -15yr and older(M)',
              ref: 'HV03-37',
              indicator: 'on_art_males_15_and_older'
            },
            {
              label: 'Currently on ART -15yr and older(F)',
              ref: 'HV03-38',
              indicator: 'on_art_females_15_and_older'
            },
            {
              label: 'Total currently on ART (Sum HV03-35 to HV03-38)',
              ref: 'HV03-39',
              indicator: 'on_art_total'
            }
          ]
        },
        {
          sectionTitle: '3.7 Cumulative Ever on ART',
          indicators: [
            {
              label: 'Ever on ART - Below 15yrs(M)',
              ref: 'HV03-40',
              indicator: 'ever_on_art_males_below_15'
            },
            {
              label: 'Ever on ART - Below 15yrs(F)',
              ref: 'HV03-41',
              indicator: 'ever_on_art_females_below_15'
            },
            {
              label: 'Ever on ART - 15yrs & older(M)',
              ref: 'HV03-42',
              indicator: 'ever_on_art_males_15_and_older'
            },
            {
              label: 'Ever on ART - 15yrs & older(F)',
              ref: 'HV03-43',
              indicator: 'ever_on_art_females_15_and_older'
            },
            {
              label: 'Total Ever on ART (Sum HV03-40 to HV03-43)',
              ref: 'HV03-44',
              indicator: 'ever_on_art'
            }
          ]
        },
        {
          sectionTitle: '3.8 Survival and Retention on ART at 12 months',
          indicators: [
            {
              label: 'ART Net Cohort at 12 months',
              ref: 'HV03-45',
              indicator: 'art_net_cohort_at_12_months'
            },
            {
              label: 'On Original 1st Line at 12 months',
              ref: 'HV03-46',
              indicator: 'on_original_first_line'
            },
            {
              label: 'On alternative 1st Line at 12 months',
              ref: 'HV03-47',
              indicator: 'on_alternative_first_line'
            },
            {
              label: 'On 2nd Line (or higher) at 12 months',
              ref: 'HV03-48',
              indicator: 'on_second_line_or_higher'
            },
            {
              label: 'Total on therapy at 12 months (Sum HV03-46 to HV03-48)',
              ref: 'HV03-49',
              indicator: 'total_on_therapy_at_12_months'
            }
          ]
        },
        {
          sectionTitle: '3.9 Screening',
          indicators: [
            {
              label: 'Screened for TB -Below 15yrs(M)',
              ref: 'HV03-50',
              indicator: 'screened_for_tb_males_below_15'
            },
            {
              label: 'Screened for TB -Below 15yrs(F)',
              ref: 'HV03-51',
              indicator: 'screened_for_tb_females_below_15'
            },
            {
              label: 'Screened for TB -15yrs & older(M)',
              ref: 'HV03-52',
              indicator: 'screened_for_tb_males_15_and_older'
            },
            {
              label: 'Screened for TB -15yrs & older(F)',
              ref: 'HV03-53',
              indicator: 'screened_for_tb_females_15_and_older'
            },
            {
              label: 'Total Screened for TB (Sum HV03-50 to HV03-53)',
              ref: 'HV03-54',
              indicator: 'screened_for_tb'
            },
            {
              label: 'Screened for cervical cancer (F 18 years and older)',
              ref: 'HV03-55',
              indicator: 'Screened_for_cervical_cancer'
            }
          ]
        },
        {
          sectionTitle: '3.10 Prevention with Positives',
          indicators: [
            {
              label: 'Modern contraceptive methods',
              ref: 'HV09-04',
              indicator: 'using_modern_contracept_method'
            },
            {
              label: 'Provided with condoms',
              ref: 'HV09-05',
              indicator: 'condoms_provided'
            }
          ]
        },
        {
          sectionTitle: '3.11 HIV Care Visits',
          indicators: [
            {
              label: 'Females (18 years and older)',
              ref: 'HV03-70',
              indicator: 'female_gte_18yo_visits'
            },
            {
              label: 'Scheduled',
              ref: 'HV03-71',
              indicator: 'scheduled_visits'
            },
            {
              label: 'Unscheduled',
              ref: 'HV03-72',
              indicator: 'unscheduled_visits'
            },
            {
              label: 'Total HIV Care visit',
              ref: 'HV03-73',
              indicator: 'total_visits'
            }
          ]
        }
      ]
    };
  }
}
