/**
 * Declarative definition of the MOH 731 (Ver. July 2023) comprehensive
 * HIV/AIDS reporting form.
 *
 * The paper form is the source of truth for the layout: sections hold one or
 * more columns, a column holds blocks (the numbered sub sections), and a block
 * holds rows of labelled cells. Every cell carries its official HV code and,
 * where the indicator is computed by the ETL, the field it maps to.
 *
 * Both the report view (a replica of the paper form) and the tabular view are
 * rendered from this definition so the two can never drift apart.
 */

export interface Moh731Cell {
  /** Official MOH indicator code, e.g. HV01-01 */
  code: string;
  /** ETL field on the report payload. Absent when the indicator is not computed. */
  field?: string;
  /** Gender to filter the patient list by. Empty for indicators that are not gendered. */
  gender?: string;
}

export interface Moh731Row {
  /** Row label shown in the left gutter. */
  label?: string;
  /** Full width sub heading within a block, e.g. "Number SAM +". */
  heading?: string;
  /** One entry per value column. `null` leaves that column blank. */
  cells?: Array<Moh731Cell | null>;
  /** Breaks the stack of boxes above it, as the printed form does. */
  gapBefore?: boolean;
  /** Rules off the rows above it within the same block. */
  dividerBefore?: boolean;
}

export interface Moh731Block {
  /** Numbered sub section title, e.g. "1.1 HIV Tests". */
  title?: string;
  /** Renders a shaded section bar above the block (used by sections 4 and 5). */
  sectionTitle?: string;
  /** Header shown above each value column, e.g. Male / Female. */
  headers?: Array<string | null>;
  /** Row the header sits above. Defaults to the first row of the block. */
  headerRowIndex?: number;
  /** Title used for the patient list header. Defaults to the block title. */
  indicatorGroup?: string;
  rows: Moh731Row[];
}

export interface Moh731Section {
  title: string;
  columns: Moh731Block[][];
  /**
   * Width of each column as a percentage of the sheet, measured off the
   * printed form. Fixed rather than proportional so a column that runs short of
   * room never steals width from the one beside it. Defaults to equal columns.
   */
  columnWidths?: number[];
  /** Section 3 is the only one the paper rules between its columns. */
  columnDividers?: boolean;
}

const MALE_FEMALE: Array<string | null> = ['Male', 'Female'];
const MALE_FEMALE_PMTCT: Array<string | null> = [
  'Male',
  'Female (including PMTCT)'
];

export const MOH_731_SECTIONS: Moh731Section[] = [
  {
    title: '1. HIV Testing Services & Pre exposure Prophylaxis',
    columnWidths: [53.5, 46.5],
    columns: [
      [
        {
          title: '1.1 HIV Tests',
          indicatorGroup: 'HIV Tests',
          headers: MALE_FEMALE_PMTCT,
          rows: [
            {
              label: 'Tests',
              cells: [
                { code: 'HV01-01', field: 'hiv_male', gender: 'M' },
                { code: 'HV01-02', field: 'hiv_female', gender: 'F' }
              ]
            },
            {
              label: 'Tests_Facility',
              gapBefore: true,
              cells: [{ code: 'HV01-03', field: 'hiv_setting_facility' }, null]
            },
            {
              label: 'Tests_Community',
              cells: [{ code: 'HV01-04', field: 'hiv_setting_community' }, null]
            },
            {
              label: 'Tested KVP',
              gapBefore: true,
              cells: [{ code: 'HV01-05', field: 'hiv_setting_kvp' }, null]
            }
          ]
        },
        {
          title: '1.3. No. Initiated on PrEP (NEW)',
          indicatorGroup: 'Initiated on PrEP (NEW)',
          headers: MALE_FEMALE,
          rows: [
            {
              label: 'General popn',
              cells: [
                {
                  code: 'HV01-19',
                  field: 'prep_new_male_general_pop',
                  gender: 'M'
                },
                {
                  code: 'HV01-20',
                  field: 'prep_new_female_general_pop',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'MSM/MSW',
              cells: [
                { code: 'HV01-21', field: 'prep_new_msm', gender: 'M' },
                null
              ]
            },
            {
              label: 'FSW',
              cells: [
                null,
                { code: 'HV01-22', field: 'prep_new_fsw', gender: 'F' }
              ]
            },
            {
              label: 'PWID/PWUD',
              cells: [
                { code: 'HV01-23', field: 'prep_new_pwud_male', gender: 'M' },
                { code: 'HV01-24', field: 'prep_new_pwud_female', gender: 'F' }
              ]
            },
            {
              label: 'Discordant Couple',
              cells: [
                {
                  code: 'HV01-25',
                  field: 'prep_new_discordant_male',
                  gender: 'M'
                },
                {
                  code: 'HV01-26',
                  field: 'prep_new_discordant_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Vulnerable Pop.',
              cells: [
                {
                  code: 'HV01-27',
                  field: 'prep_new_vulnerable_male',
                  gender: 'M'
                },
                {
                  code: 'HV01-28',
                  field: 'prep_new_vulnerable_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'AYP (10-24yrs)',
              cells: [
                { code: 'HV01-29', field: 'prep_new_ayp_male', gender: 'M' },
                { code: 'HV01-30', field: 'prep_new_ayp_female', gender: 'F' }
              ]
            },
            {
              label: 'Pregnant and breastfeeding women',
              cells: [
                null,
                {
                  code: 'HV01-31',
                  field: 'prep_new_preg_breastfeeding',
                  gender: 'F'
                }
              ]
            }
          ]
        },
        {
          title: '1.5. No. Seroconverted while on PrEP',
          indicatorGroup: 'Seroconverted while on PrEP',
          headers: MALE_FEMALE,
          rows: [
            {
              label: 'HIV Positive',
              cells: [
                { code: 'HV01-45', field: 'seroconverted_male', gender: 'M' },
                { code: 'HV01-46', field: 'seroconverted_female', gender: 'F' }
              ]
            }
          ]
        }
      ],
      [
        {
          title: '1.2 HIV Positive Results',
          indicatorGroup: 'HIV Positive Results',
          headers: MALE_FEMALE_PMTCT,
          rows: [
            {
              label: 'Positive_1-9',
              cells: [
                { code: 'HV01-06', field: 'male_2_9', gender: 'M' },
                { code: 'HV01-07', field: 'female_2_9', gender: 'F' }
              ]
            },
            {
              label: 'Positive_10-14',
              cells: [
                { code: 'HV01-08', field: 'male_10_14', gender: 'M' },
                { code: 'HV01-09', field: 'female_10_14', gender: 'F' }
              ]
            },
            {
              label: 'Positive_15-19',
              cells: [
                { code: 'HV01-10', field: 'male_15_19', gender: 'M' },
                { code: 'HV01-11', field: 'female_15_19', gender: 'F' }
              ]
            },
            {
              label: 'Positive_20-24',
              cells: [
                { code: 'HV01-12', field: 'male_20_24', gender: 'M' },
                { code: 'HV01-13', field: 'female_20_24', gender: 'F' }
              ]
            },
            {
              label: 'Positive_25+',
              cells: [
                { code: 'HV01-14', field: 'male_25_above', gender: 'M' },
                { code: 'HV01-15', field: 'female_25_above', gender: 'F' }
              ]
            },
            {
              label: 'Positive_KVP',
              cells: [{ code: 'HV01-16', field: 'positive_kvp' }, null]
            },
            {
              label: 'Discordant',
              gapBefore: true,
              cells: [
                { code: 'HV01-17', field: 'discordant_male', gender: 'M' },
                { code: 'HV01-18', field: 'discordant_female', gender: 'F' }
              ]
            },
            {
              label: 'Inconclusive Test Results',
              gapBefore: true,
              cells: [
                { code: 'HV01-47', field: 'inconclusive_male', gender: 'M' },
                { code: 'HV01-48', field: 'inconclusive_female', gender: 'F' }
              ]
            }
          ]
        },
        {
          title: '1.4. No. on PrEP Diagnosed with STI',
          indicatorGroup: 'No. on PrEP Diagnosed with STI',
          headers: MALE_FEMALE,
          rows: [
            {
              label: 'General popn',
              cells: [
                {
                  code: 'HV01-32',
                  field: 'prep_sti_male_general_pop',
                  gender: 'M'
                },
                {
                  code: 'HV01-33',
                  field: 'prep_sti_female_general_pop',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'MSM/MSW',
              cells: [
                { code: 'HV01-34', field: 'prep_sti_msm', gender: 'M' },
                null
              ]
            },
            {
              label: 'FSW',
              cells: [
                null,
                { code: 'HV01-35', field: 'prep_sti_fsw', gender: 'F' }
              ]
            },
            {
              label: 'PWID/PWUD',
              cells: [
                { code: 'HV01-36', field: 'prep_sti_pwud_male', gender: 'M' },
                { code: 'HV01-37', field: 'prep_sti_pwud_female', gender: 'F' }
              ]
            },
            {
              label: 'Discordant Couple',
              cells: [
                {
                  code: 'HV01-38',
                  field: 'prep_sti_discordant_male',
                  gender: 'M'
                },
                {
                  code: 'HV01-39',
                  field: 'prep_sti_discordant_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Vulnerable Pop.',
              cells: [
                {
                  code: 'HV01-40',
                  field: 'prep_sti_vulnerable_male',
                  gender: 'M'
                },
                {
                  code: 'HV01-41',
                  field: 'prep_sti_vulnerable_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'AYP (10-24 yrs)',
              cells: [
                { code: 'HV01-42', field: 'prep_sti_ayp_male', gender: 'M' },
                { code: 'HV01-43', field: 'prep_sti_ayp_female', gender: 'F' }
              ]
            },
            {
              label: 'Pregnant and breastfeeding women',
              cells: [
                null,
                {
                  code: 'HV01-44',
                  field: 'prep_sti_preg_breastfeeding',
                  gender: 'F'
                }
              ]
            }
          ]
        }
      ]
    ]
  },
  {
    title: '2. Elimination of Mother-to-Child Transmission (EMTCT)',
    columnWidths: [53.5, 46.5],
    columns: [
      [
        {
          title: '2.1 Maternal HIV Testing',
          indicatorGroup: 'Maternal HIV Testing',
          headers: ['Initial', 'Retest'],
          headerRowIndex: 1,
          rows: [
            {
              label: 'Known Positive at 1st ANC',
              cells: [
                { code: 'HV02-01', field: 'known_positive_1st_anc' },
                null
              ]
            },
            {
              label: 'Tested at ANC',
              cells: [
                { code: 'HV02-02', field: 'initial_test_anc' },
                { code: 'HV02-03', field: 'retest_anc' }
              ]
            },
            {
              label: 'Tested at L&D',
              cells: [
                { code: 'HV02-04', field: 'initial_test_LD' },
                { code: 'HV02-05', field: 'retest_LD' }
              ]
            },
            {
              label: 'Tested at PNC_<=6 weeks',
              cells: [
                { code: 'HV02-06', field: 'initial_test_pnc_less_6_weeks' },
                { code: 'HV02-07', field: 'retest_pnc_less_6_weeks' }
              ]
            },
            {
              label: 'Tested at PNC_>6 weeks',
              cells: [
                { code: 'HV02-08', field: 'initial_test_pnc_greater_6_weeks' },
                { code: 'HV02-09', field: 'retest_pnc_greater_6_weeks' }
              ]
            }
          ]
        },
        {
          title: '2.2 HIV Positive Results',
          indicatorGroup: 'Maternal HIV Positive Results',
          rows: [
            {
              label: 'Positive Results_ANC',
              cells: [{ code: 'HV02-10', field: 'positive_anc' }]
            },
            {
              label: 'Positive Results_L&D',
              cells: [{ code: 'HV02-11', field: 'positive_LD' }]
            },
            {
              label: 'Positive Results_PNC <=6weeks',
              cells: [{ code: 'HV02-12', field: 'positive_pnc_less_6_weeks' }]
            },
            {
              label: 'Positive PNC >6weeks',
              cells: [
                { code: 'HV02-13', field: 'positive_pnc_greater_6_weeks' }
              ]
            }
          ]
        },
        {
          title: '2.3 Maternal HAART',
          indicatorGroup: 'Maternal HAART',
          rows: [
            {
              label: 'On HAART at 1st ANC',
              cells: [{ code: 'HV02-14', field: 'maternal_haart_1st_anc' }]
            },
            {
              label: 'Start HAART_ANC',
              cells: [
                { code: 'HV02-15', field: 'start_maternal_haart_1st_anc' }
              ]
            },
            {
              label: 'Start HAART_L&D',
              cells: [{ code: 'HV02-16', field: 'start_maternal_haart_LD' }]
            },
            {
              label: 'Start HAART_PNC <= 6 weeks',
              cells: [{ code: 'HV02-17', field: 'maternal_haart_less_6_weeks' }]
            },
            {
              label: 'Start HAART_PNC>6weeks',
              cells: [{ code: 'HV02-18', field: 'maternal_haart_more_6_weeks' }]
            }
          ]
        }
      ],
      [
        {
          title: '2.4 HBV Screening at ANC',
          indicatorGroup: 'HBV Screening at ANC',
          rows: [
            {
              label: 'Screened_HBV_ANC',
              cells: [
                { code: 'HV02-19', field: 'hbv_screened_anc', gender: 'F' }
              ]
            },
            {
              label: 'HBV Screened_Positive',
              cells: [{ code: 'HV02-20', field: 'hbv_screened_positive_anc' }]
            }
          ]
        },
        {
          title:
            '2.5 Adolescents girls & Young Women (10-24 Yrs) testing & results',
          indicatorGroup:
            'Adolescents girls & Young Women (10-24 Yrs) testing & results',
          headers: ['10-19yrs', '20-24yrs'],
          rows: [
            {
              label: '1st ANC KP',
              cells: [
                {
                  code: 'HV02-21',
                  field: 'known_positive_anc_10_19',
                  gender: 'F'
                },
                {
                  code: 'HV02-22',
                  field: 'known_positive_anc_20_24',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'New HIV Positive',
              cells: [
                {
                  code: 'HV02-23',
                  field: 'positive_anc_ld_pnc_10_19',
                  gender: 'F'
                },
                {
                  code: 'HV02-24',
                  field: 'positive_anc_ld_pnc_20_24',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'On HAART 1st ANC KP',
              cells: [
                { code: 'HV02-25', field: 'on_art_anc_10_19', gender: 'F' },
                { code: 'HV02-26', field: 'on_art_anc_20_24', gender: 'F' }
              ]
            },
            {
              label: 'Started HAART New',
              cells: [
                { code: 'HV02-27', field: 'start_art_10_19', gender: 'F' },
                { code: 'HV02-28', field: 'start_art_20_24', gender: 'F' }
              ]
            }
          ]
        },
        {
          title: '2.6 Infant Prophylaxis',
          indicatorGroup: 'Infant Prophylaxis',
          rows: [
            {
              label: 'Infant ARV Prophylaxis_ANC',
              cells: [{ code: 'HV02-29', field: 'infant_arv_anc' }]
            },
            {
              label: 'Infant ARV Prophylaxis_L&D',
              cells: [{ code: 'HV02-30', field: 'infant_arv_ld' }]
            },
            {
              label: 'Infant ARV Prophylaxis_PNC',
              cells: [{ code: 'HV02-31', field: 'infant_arv_pnc' }]
            }
          ]
        },
        {
          title: '2.7 Infant Feeding',
          indicatorGroup: 'Infant Feeding',
          rows: [
            { heading: 'Below 6 months' },
            {
              label: 'Exclusive Breastfeeding (EBF)',
              cells: [{ code: 'HV02-32', field: 'exclusive_bf' }]
            },
            { heading: '6 to 24 months' },
            {
              label: 'Breastfeeding (BF)',
              cells: [{ code: 'HV02-33', field: 'bf' }]
            },
            {
              label: 'Not Breastfeeding (NBF)',
              cells: [{ code: 'HV02-34', field: 'weaning' }]
            }
          ]
        }
      ]
    ]
  },
  {
    title: '3. HIV and TB treatment',
    // Measured off the printed form, whose two column rules fall at 44.4% and
    // 72.2% of the sheet: the treatment column takes about half again as much
    // room as the nutrition and TB clinic columns, which are equal.
    columnWidths: [44.37, 27.82, 27.81],
    columnDividers: true,
    columns: [
      [
        {
          title: '3.1 Starting ART',
          indicatorGroup: 'Starting ART',
          rows: [
            {
              label: 'Start ART_<1',
              cells: [
                {
                  code: '(M) HV03-01',
                  field: 'art_new_less_1_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-02',
                  field: 'art_new_less_1_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Start ART_1-4',
              cells: [
                { code: '(M) HV03-03', field: 'art_new_1_4_male', gender: 'M' },
                {
                  code: '(F) HV03-04',
                  field: 'art_new_1_4_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Start ART_5-9',
              cells: [
                { code: '(M) HV03-05', field: 'art_new_5_9_male', gender: 'M' },
                {
                  code: '(F) HV03-06',
                  field: 'art_new_5_9_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Start ART_10-14',
              cells: [
                {
                  code: '(M) HV03-07',
                  field: 'art_new_10_14_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-08',
                  field: 'art_new_10_14_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Start ART_15-19',
              cells: [
                {
                  code: '(M) HV03-09',
                  field: 'art_new_15_19_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-10',
                  field: 'art_new_15_19_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Start ART_20-24',
              cells: [
                {
                  code: '(M) HV03-11',
                  field: 'art_new_20_24_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-12',
                  field: 'art_new_20_24_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'Start ART_25+',
              cells: [
                {
                  code: '(M) HV03-013',
                  field: 'art_new_25_above_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-014',
                  field: 'art_new_25_above_female',
                  gender: 'F'
                }
              ]
            }
          ]
        },
        {
          title: '3.2 Currently on ART ([All])',
          indicatorGroup: 'Currently on ART',
          rows: [
            {
              label: 'On ART_<1',
              cells: [
                {
                  code: '(M) HV03-015',
                  field: 'on_art_less_1_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-016',
                  field: 'on_art_less_1_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'On ART_1-4',
              cells: [
                { code: '(M) HV03-017', field: 'on_art_1_4_male', gender: 'M' },
                {
                  code: '(F) HV03-018',
                  field: 'on_art_1_4_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'On ART_5-9',
              cells: [
                { code: '(M) HV03-019', field: 'on_art_5_9_male', gender: 'M' },
                {
                  code: '(F) HV03-020',
                  field: 'on_art_5_9_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'On ART_10-14',
              cells: [
                {
                  code: '(M) HV03-021',
                  field: 'on_art_10_14_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-022',
                  field: 'on_art_10_14_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'On ART_15-19',
              cells: [
                {
                  code: '(M) HV03-023',
                  field: 'on_art_15_19_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-024',
                  field: 'on_art_15_19_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'On ART_20-24',
              cells: [
                {
                  code: '(M) HV03-025',
                  field: 'on_art_20_24_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-026',
                  field: 'on_art_20_24_female',
                  gender: 'F'
                }
              ]
            },
            {
              label: 'On ART_25+',
              cells: [
                {
                  code: '(M) HV03-027',
                  field: 'on_art_25_above_male',
                  gender: 'M'
                },
                {
                  code: '(F) HV03-028',
                  field: 'on_art_25_above_female',
                  gender: 'F'
                }
              ]
            }
          ]
        },
        {
          title: '3.3 TB Screening',
          indicatorGroup: 'TB Screening',
          rows: [
            {
              label: 'Screen for TB_<15',
              cells: [{ code: 'HV03-029', field: 'screened_tb_less_15' }]
            },
            {
              label: 'Screen for TB_15+',
              cells: [{ code: 'HV03-030', field: 'screened_tb_greater_15' }]
            }
          ]
        },
        {
          title: '3.4 Starting TPT',
          indicatorGroup: 'Starting TPT',
          rows: [
            {
              label: 'Start TPT_<15',
              cells: [{ code: 'HV03-031', field: 'start_tpt_less_15' }]
            },
            {
              label: 'Start TPT_15+',
              cells: [{ code: 'HV03-032', field: 'start_tpt_greater_15' }]
            }
          ]
        },
        {
          title: '3.5 Differentiated Service Delivery',
          indicatorGroup: 'Differentiated Service Delivery',
          rows: [
            {
              label: 'Established',
              cells: [{ code: 'HV03-033', field: 'established' }]
            },
            {
              label: 'Not Established',
              cells: [{ code: 'HV03-034', field: 'not_established' }]
            },
            {
              label: 'Community',
              cells: [{ code: 'HV03-035', field: 'community' }]
            },
            {
              label: 'Facility',
              cells: [{ code: 'HV03-036', field: 'facility' }]
            }
          ]
        }
      ],
      [
        {
          title: '3.6 Nutrition and HIV',
          indicatorGroup: 'Nutrition and HIV',
          rows: [
            { heading: 'Number SAM +' },
            {
              label: '0-5Months',
              cells: [{ code: 'HV03-037', field: 'has_sam_0_5_months' }]
            },
            {
              label: '6-59Months',
              cells: [{ code: 'HV03-038', field: 'has_sam_6_59_months' }]
            },
            {
              label: '5-9Years',
              cells: [{ code: 'HV03-039', field: 'has_sam_5_9_years' }]
            },
            {
              label: '10-17Years',
              cells: [{ code: 'HV03-040', field: 'has_sam_10_17_years' }]
            },
            {
              label: '18+Years',
              cells: [{ code: 'HV03-041', field: 'has_sam_18_and_above_years' }]
            },
            {
              label: 'Pregnant & Lactating',
              cells: [
                { code: 'HV03-042', field: 'has_sam_preg_lact', gender: 'F' }
              ]
            },
            { heading: 'Number MAM +' },
            {
              label: '0-5Months',
              cells: [{ code: 'HV03-043', field: 'has_smm_0_5_months' }]
            },
            {
              label: '6-59Months',
              cells: [{ code: 'HV03-044', field: 'has_smm_6_59_months' }]
            },
            {
              label: '5-9Years',
              cells: [{ code: 'HV03-045', field: 'has_smm_5_9_years' }]
            },
            {
              label: '10-17Years',
              cells: [{ code: 'HV03-046', field: 'has_smm_10_17_years' }]
            },
            {
              label: '18+Years',
              cells: [{ code: 'HV03-047', field: 'has_smm_18_and_above_years' }]
            },
            {
              label: 'Pregnant & Lactating',
              cells: [
                { code: 'HV03-048', field: 'has_smm_preg_lact', gender: 'F' }
              ]
            },
            { heading: 'Number SAM + receiving therapeutic foods' },
            {
              label: '0-5Months',
              cells: [
                { code: 'HV03-049', field: 'severe_acute_supp_0_5_months' }
              ]
            },
            {
              label: '6-59Months',
              cells: [
                { code: 'HV03-050', field: 'severe_acute_supp_6_59_months' }
              ]
            },
            {
              label: '5-9Years',
              cells: [
                { code: 'HV03-051', field: 'severe_acute_supp_5_9_years' }
              ]
            },
            {
              label: '10-17Years',
              cells: [
                { code: 'HV03-052', field: 'severe_acute_supp_10_17_years' }
              ]
            },
            {
              label: '18+Years',
              cells: [
                {
                  code: 'HV03-053',
                  field: 'severe_acute_supp_18_and_above_years'
                }
              ]
            },
            {
              label: 'Pregnant & Lactating',
              cells: [
                {
                  code: 'HV03-054',
                  field: 'severe_acute_supp_preg_lact',
                  gender: 'F'
                }
              ]
            },
            { heading: 'Number MAM + receiving Supplemental foods' },
            {
              label: '0-5Months',
              cells: [
                { code: 'HV03-055', field: 'severe_moderate_supp_0_5_months' }
              ]
            },
            {
              label: '6-59Months',
              cells: [
                { code: 'HV03-056', field: 'severe_moderate_supp_6_59_months' }
              ]
            },
            {
              label: '5-9Years',
              cells: [
                { code: 'HV03-057', field: 'severe_moderate_supp_5_9_years' }
              ]
            },
            {
              label: '10-17Years',
              cells: [
                { code: 'HV03-058', field: 'severe_moderate_supp_10_17_years' }
              ]
            },
            {
              label: '18+Years',
              cells: [
                {
                  code: 'HV03-059',
                  field: 'severe_moderate_supp_18_and_above_years'
                }
              ]
            },
            {
              label: 'Pregnant & Lactating',
              cells: [
                {
                  code: 'HV03-060',
                  field: 'severe_moderate_supp_preg_lact',
                  gender: 'F'
                }
              ]
            }
          ]
        }
      ],
      [
        {
          title: '3.7 HIV in TB Clinic',
          indicatorGroup: 'HIV in TB Clinic',
          rows: [
            {
              label: 'TB cases _New',
              cells: [{ code: 'HV03-061' }]
            },
            {
              label: 'TB New_Known HIV Positive(KPs)',
              cells: [{ code: 'HV03-062' }]
            },
            {
              label: 'TB_New HIV Positive',
              cells: [{ code: 'HV03-063' }]
            },
            {
              label: 'TB_New_Known HIV Positive(KP) on HAART',
              cells: [{ code: 'HV03-064' }]
            },
            {
              label: 'TB New_start_HAART',
              cells: [{ code: 'HV03-065' }]
            }
          ]
        },
        {
          sectionTitle: '4. Medical Male Circumcision',
          title: '4.1 Number circumcised',
          indicatorGroup: 'Number circumcised',
          rows: [
            { label: 'Circumcised_0-60 days', cells: [{ code: 'HV04-01' }] },
            {
              label: 'Circumcised_61 days -9 yrs',
              cells: [{ code: 'HV04-02' }]
            },
            { label: 'Circumcised_10-14', cells: [{ code: 'HV04-03' }] },
            { label: 'Circumcised_15 +', cells: [{ code: 'HV04-04' }] },
            {
              label: 'Tested_ HIV+',
              dividerBefore: true,
              cells: [{ code: 'HV04-05' }]
            },
            { label: 'Tested_ HIV-', cells: [{ code: 'HV04-06' }] }
          ]
        },
        {
          title: '4.2 Type of circumcision',
          indicatorGroup: 'Type of circumcision',
          rows: [
            { label: 'Surgical', cells: [{ code: 'HV04-07' }] },
            { label: 'Devices', cells: [{ code: 'HV04-08' }] }
          ]
        },
        {
          title: '4.3 Circumcision Adverse Events',
          indicatorGroup: 'Circumcision Adverse Events',
          rows: [
            { label: 'AE_During_Moderate', cells: [{ code: 'HV04-09' }] },
            { label: 'AE_During_Severe', cells: [{ code: 'HV04-10' }] },
            { label: 'AE_Post_Moderate', cells: [{ code: 'HV04-11' }] },
            { label: 'AE_Post_Severe', cells: [{ code: 'HV04-12' }] },
            { label: 'Follow up visit <14d', cells: [{ code: 'HV04-13' }] }
          ]
        },
        {
          sectionTitle: '5. Post Exposure Prophylaxis',
          indicatorGroup: 'Post Exposure Prophylaxis',
          rows: [
            {
              label: 'Exposed_Occupational',
              cells: [{ code: 'HV05-01', field: 'exposed_occupational' }]
            },
            {
              label: 'Exposed_Other',
              cells: [{ code: 'HV05-02', field: 'exposed_non_occupational' }]
            },
            {
              label: 'PEP_Occupational',
              gapBefore: true,
              cells: [{ code: 'HV05-03', field: 'pep_occupational' }]
            },
            {
              label: 'PEP_Other',
              cells: [{ code: 'HV05-04', field: 'pep_non_occupational' }]
            }
          ]
        }
      ]
    ]
  }
];

export interface Moh731IndicatorDef {
  /** ETL field, used as the grid column field. */
  indicator: string;
  /** Column header in the grid. */
  label: string;
  code: string;
  gender: string;
  /** Heading used by the patient list. */
  title: string;
}

export interface Moh731SectionDef {
  sectionTitle: string;
  indicators: Moh731IndicatorDef[];
}

export function blockTitle(block: Moh731Block): string {
  if (block.sectionTitle && block.title) {
    return `${block.sectionTitle} - ${block.title}`;
  }
  return block.sectionTitle || block.title || '';
}

/**
 * Section definitions for the tabular view, in the same shape the ETL returns
 * them in, so the grid is built exactly the way the other MOH 731 report builds
 * its own: a column group per sub section, a column per indicator.
 */
export function buildMoh731SectionDefs(): Moh731SectionDef[] {
  const sectionDefs: Moh731SectionDef[] = [];

  MOH_731_SECTIONS.forEach((section) => {
    section.columns.forEach((column) => {
      column.forEach((block) => {
        const indicators: Moh731IndicatorDef[] = [];
        const seen: { [field: string]: boolean } = {};
        // A field can sit under two columns of the form (male and female boxes
        // of an indicator that is not gender split). It only earns one column.
        const occurrences: { [field: string]: number } = {};
        block.rows.forEach((row) => {
          (row.cells || []).forEach((cell) => {
            if (cell && cell.field) {
              occurrences[cell.field] = (occurrences[cell.field] || 0) + 1;
            }
          });
        });

        block.rows.forEach((row) => {
          (row.cells || []).forEach((cell, index) => {
            if (!cell || !cell.field || seen[cell.field]) {
              return;
            }
            seen[cell.field] = true;
            const header = block.headers ? block.headers[index] : null;
            // The header only disambiguates when the row fills more than one
            // column, e.g. a male and a female box of the same indicator.
            const isSplitRow =
              (row.cells || []).filter((entry) => !!entry).length > 1;
            const label =
              header && isSplitRow && occurrences[cell.field] === 1
                ? `${row.label} (${header})`
                : row.label;
            indicators.push({
              indicator: cell.field,
              label: `${label} [${cell.code.replace(/^\([MF]\)\s*/, '')}]`,
              code: cell.code.replace(/^\([MF]\)\s*/, ''),
              gender: occurrences[cell.field] === 1 ? cell.gender || '' : '',
              title: block.indicatorGroup || blockTitle(block)
            });
          });
        });

        if (indicators.length > 0) {
          sectionDefs.push({
            sectionTitle: blockTitle(block),
            indicators: indicators
          });
        }
      });
    });
  });

  return sectionDefs;
}

/**
 * The patient list behind a box is asked for with a "dynamically created"
 * indicator, the form the reporting framework already uses elsewhere:
 *
 *   dc__gender__M__age_range__1_to_4__started_art
 *
 * naming the disaggregation columns and the measure. The report's own field
 * names are flat, so each is translated here into the cell of the form it
 * stands for. A field with no entry is asked for by name alone.
 */
const PATIENT_LIST_AGE_BANDS: { [suffix: string]: string } = {
  less_1: '0_to_1',
  '1_4': '1_to_4',
  '5_9': '5_to_9',
  '10_14': '10_to_14',
  '15_19': '15_to_19',
  '20_24': '20_to_24',
  '25_above': 'older_than_24'
};

const PATIENT_LIST_MEASURES: { [field: string]: string } = {
  screened_tb_less_15: 'age_group_15__below_15__screened_for_tb',
  screened_tb_greater_15: 'age_group_15__15_and_above__screened_for_tb',
  start_tpt_less_15: 'age_group_15__below_15__started_tpt',
  start_tpt_greater_15: 'age_group_15__15_and_above__started_tpt',
  established: 'is_established',
  not_established: 'is_not_established',
  community: 'is_community_delivery',
  facility: 'is_facility_delivery',
  start_tb: 'started_tb_tx',
  start_tb_known_positive: 'tb_known_positive',
  start_tb_positive: 'tb_new_positive',
  start_tb_on_art: 'tb_on_art_at_diagnosis',
  start_tb_art_new: 'started_art_and_has_tb'
};

/** The indicator to ask the patient list for, given a form field. */
export function patientListIndicator(field: string): string {
  if (!field) {
    return field;
  }

  // 3.1 and 3.2 are cut by age and sex, and their fields are named for the cell
  // they sit in, so the cell can be read back off the name.
  const banded = /^(art_new|on_art)_(.+)_(male|female)$/.exec(field);
  if (banded) {
    const band = PATIENT_LIST_AGE_BANDS[banded[2]];
    if (band) {
      const measure = banded[1] === 'art_new' ? 'started_art' : 'on_art';
      const sex = banded[3] === 'male' ? 'M' : 'F';
      return 'dc__gender__' + sex + '__age_range__' + band + '__' + measure;
    }
  }

  const mapped = PATIENT_LIST_MEASURES[field];
  if (mapped) {
    return mapped.indexOf('__') === -1 ? mapped : 'dc__' + mapped;
  }

  // Nutrition and anything else is counted whole, so its own name is enough.
  return field;
}
