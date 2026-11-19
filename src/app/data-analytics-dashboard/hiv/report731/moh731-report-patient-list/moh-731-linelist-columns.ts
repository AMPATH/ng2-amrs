/**
 * Columns of each MOH 731 linelist, taken from the O3 (3.x) report's linelist
 * sections so both show the same details for a figure. Name, identifiers, sex
 * and age come from the patient list grid itself.
 *
 * Generated from ampath-esm-reports: reports/moh-731/linelist/
 * moh-731-linelist-sections.ts (visible columns) and moh-731-indicators.ts
 * (which section each indicator opens).
 */
export interface Moh731LinelistColumn {
  headerName: string;
  field: string;
  /** Shown as a date (DD-MM-YYYY). */
  date: boolean;
}

export const MOH_731_LINELIST_COLUMNS: {
  [section: string]: Moh731LinelistColumn[];
} = {
  hivTests: [
    {
      headerName: 'Test Date',
      field: 'test_date',
      date: true
    },
    {
      headerName: 'Age',
      field: 'age_at_test',
      date: false
    },
    {
      headerName: 'Service',
      field: 'service',
      date: false
    },
    {
      headerName: 'Test Type',
      field: 'test_type',
      date: false
    },
    {
      headerName: 'Setting',
      field: 'hts_setting',
      date: false
    },
    {
      headerName: 'Population Type',
      field: 'population_type',
      date: false
    },
    {
      headerName: 'Final Result',
      field: 'final_result',
      date: false
    },
    {
      headerName: 'Initiated in Care',
      field: 'initiated_in_care',
      date: false
    },
    {
      headerName: 'ART Start Date',
      field: 'arv_first_regimen_start_date',
      date: true
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    },
    {
      headerName: 'Entered By',
      field: 'entered_by',
      date: false
    }
  ],
  prepVisits: [
    {
      headerName: 'Visit Date',
      field: 'visit_date',
      date: true
    },
    {
      headerName: 'Visit',
      field: 'visit',
      date: false
    },
    {
      headerName: 'Population',
      field: 'population_category',
      date: false
    },
    {
      headerName: 'PrEP Start Date',
      field: 'prep_start_date',
      date: true
    },
    {
      headerName: 'Transfer In',
      field: 'transfer_in',
      date: false
    },
    {
      headerName: 'PrEP Status',
      field: 'prep_status',
      date: false
    },
    {
      headerName: 'PrEP Type',
      field: 'prep_type',
      date: false
    },
    {
      headerName: 'Regimen',
      field: 'regimen',
      date: false
    },
    {
      headerName: 'HIV Test',
      field: 'hiv_test',
      date: false
    },
    {
      headerName: 'STI',
      field: 'has_sti',
      date: false
    },
    {
      headerName: 'STI Signs',
      field: 'sti_signs',
      date: false
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    },
    {
      headerName: 'Entered By',
      field: 'entered_by',
      date: false
    }
  ],
  ancKnownPositives: [
    {
      headerName: 'ANC Date',
      field: 'anc_date',
      date: true
    },
    {
      headerName: 'Visit',
      field: 'visit',
      date: false
    },
    {
      headerName: 'ANC Visit No.',
      field: 'anc_visit_number',
      date: false
    },
    {
      headerName: 'Age',
      field: 'age_at_anc',
      date: false
    },
    {
      headerName: 'HIV Status',
      field: 'hiv_status',
      date: false
    },
    {
      headerName: 'Initiated in Care',
      field: 'initiated_in_care',
      date: false
    },
    {
      headerName: 'ART Start Date',
      field: 'arv_first_regimen_start_date',
      date: true
    },
    {
      headerName: 'Infant Prophylaxis Dispensed',
      field: 'infant_prophylaxis_dispensed',
      date: false
    },
    {
      headerName: 'Infant Prophylaxis Regimen',
      field: 'infant_prophylaxis_regimen',
      date: false
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    },
    {
      headerName: 'Entered By',
      field: 'entered_by',
      date: false
    }
  ],
  ancHbv: [
    {
      headerName: 'ANC Date',
      field: 'anc_date',
      date: true
    },
    {
      headerName: 'Visit',
      field: 'visit',
      date: false
    },
    {
      headerName: 'ANC Visit No.',
      field: 'anc_visit_number',
      date: false
    },
    {
      headerName: 'Group',
      field: 'anc_group',
      date: false
    },
    {
      headerName: 'HIV Result',
      field: 'hiv_result',
      date: false
    },
    {
      headerName: 'Age',
      field: 'age_at_anc',
      date: false
    },
    {
      headerName: 'Screened HBV',
      field: 'screened_hbv',
      date: false
    },
    {
      headerName: 'HBV Result',
      field: 'hbv_result',
      date: false
    },
    {
      headerName: 'HBV Test Date',
      field: 'hbv_test_date',
      date: true
    },
    {
      headerName: 'HBV Recorded On',
      field: 'hbv_encounter_types',
      date: false
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    },
    {
      headerName: 'Entered By',
      field: 'entered_by',
      date: false
    }
  ],
  hivPositiveMothers: [
    {
      headerName: 'Visit Date',
      field: 'visit_date',
      date: true
    },
    {
      headerName: 'Service',
      field: 'service',
      date: false
    },
    {
      headerName: 'HIV Status',
      field: 'hiv_status',
      date: false
    },
    {
      headerName: 'ANC Visit No.',
      field: 'anc_visit_number',
      date: false
    },
    {
      headerName: 'Infant Prophylaxis Given',
      field: 'infant_prophylaxis_dispensed',
      date: false
    },
    {
      headerName: 'Prophylaxis Regimen',
      field: 'infant_prophylaxis_regimen',
      date: false
    },
    {
      headerName: 'Initiated in Care',
      field: 'initiated_in_care',
      date: false
    },
    {
      headerName: 'ART Start Date',
      field: 'arv_first_regimen_start_date',
      date: true
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    },
    {
      headerName: 'Entered By',
      field: 'entered_by',
      date: false
    }
  ],
  infantFeeding: [
    {
      headerName: 'Visit Date',
      field: 'encounter_datetime',
      date: true
    },
    {
      headerName: 'RTC Date',
      field: 'rtc_date',
      date: true
    },
    {
      headerName: 'Age (Months)',
      field: 'age_months',
      date: false
    },
    {
      headerName: 'Feeding Method',
      field: 'feeding_methods',
      date: false
    },
    {
      headerName: 'Feeding Category',
      field: 'feeding_category',
      date: false
    },
    {
      headerName: 'MOH 731 Code',
      field: 'moh731_code',
      date: false
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    },
    {
      headerName: 'Entered By',
      field: 'entered_by',
      date: false
    }
  ],
  artMonthly: [
    {
      headerName: 'ART Status',
      field: 'art_status',
      date: false
    },
    {
      headerName: 'ART Start Date',
      field: 'arv_first_regimen_start_date',
      date: true
    },
    {
      headerName: 'Current Regimen',
      field: 'cur_arv_meds',
      date: false
    },
    {
      headerName: 'ARV Line',
      field: 'cur_arv_line',
      date: false
    },
    {
      headerName: 'Last Visit',
      field: 'last_visit_date',
      date: true
    },
    {
      headerName: 'RTC Date',
      field: 'rtc_date',
      date: true
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    }
  ],
  tbDsd: [
    {
      headerName: 'ART Start Date',
      field: 'arv_first_regimen_start_date',
      date: true
    },
    {
      headerName: 'TB Screening Date',
      field: 'tb_screening_date',
      date: true
    },
    {
      headerName: 'TB Screening Result',
      field: 'tb_screening_result',
      date: false
    },
    {
      headerName: 'TPT Start Date',
      field: 'ipt_start_date',
      date: true
    },
    {
      headerName: 'DSD Status',
      field: 'dsd_status',
      date: false
    },
    {
      headerName: 'DSD Model',
      field: 'dsd_model',
      date: false
    },
    {
      headerName: 'DSD Recorded',
      field: 'dsd_obs_date',
      date: true
    },
    {
      headerName: 'Last Visit',
      field: 'last_visit_date',
      date: true
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    }
  ],
  art: [
    {
      headerName: 'Phone Number',
      field: 'phone_number',
      date: false
    }
  ],
  tb: [
    {
      headerName: 'Phone Number',
      field: 'phone_number',
      date: false
    }
  ],
  nutrition: [
    {
      headerName: 'Visit Date',
      field: 'encounter_date',
      date: true
    },
    {
      headerName: 'SAM / MAM',
      field: 'sam_mam',
      date: false
    },
    {
      headerName: 'Food Given',
      field: 'food_given',
      date: false
    },
    {
      headerName: 'Pregnant / Lactating',
      field: 'pregnant_lactating',
      date: false
    },
    {
      headerName: 'Current ARV Regimen',
      field: 'current_arv_regimen',
      date: false
    },
    {
      headerName: 'ART Start Date',
      field: 'art_start_date',
      date: true
    },
    {
      headerName: 'RTC Date',
      field: 'rtc_date',
      date: true
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    }
  ],
  pep: [
    {
      headerName: 'Exposure Date',
      field: 'exposure_date',
      date: true
    },
    {
      headerName: 'Exposure Type',
      field: 'exposure_type',
      date: false
    },
    {
      headerName: 'PEP Given',
      field: 'pep_given_status',
      date: false
    },
    {
      headerName: 'Location',
      field: 'location',
      date: false
    },
    {
      headerName: 'Entered By',
      field: 'entered_by',
      date: false
    }
  ]
};

/** The linelist section each indicator opens. */
export const MOH_731_INDICATOR_SECTIONS: { [indicator: string]: string } = {
  art_new_10_14_female: 'artMonthly',
  art_new_10_14_male: 'artMonthly',
  art_new_15_19_female: 'artMonthly',
  art_new_15_19_male: 'artMonthly',
  art_new_1_4_female: 'artMonthly',
  art_new_1_4_male: 'artMonthly',
  art_new_20_24_female: 'artMonthly',
  art_new_20_24_male: 'artMonthly',
  art_new_25_above_female: 'artMonthly',
  art_new_25_above_male: 'artMonthly',
  art_new_5_9_female: 'artMonthly',
  art_new_5_9_male: 'artMonthly',
  art_new_less_1_female: 'artMonthly',
  art_new_less_1_male: 'artMonthly',
  bf: 'infantFeeding',
  community: 'tbDsd',
  discordant_female: 'hivTests',
  discordant_male: 'hivTests',
  established: 'tbDsd',
  exclusive_bf: 'infantFeeding',
  exposed_non_occupational: 'pep',
  exposed_occupational: 'pep',
  facility: 'tbDsd',
  female_10_14: 'hivTests',
  female_15_19: 'hivTests',
  female_20_24: 'hivTests',
  female_25_above: 'hivTests',
  female_2_9: 'hivTests',
  has_sam_0_5_months: 'nutrition',
  has_sam_10_17_years: 'nutrition',
  has_sam_18_and_above_years: 'nutrition',
  has_sam_5_9_years: 'nutrition',
  has_sam_6_59_months: 'nutrition',
  has_sam_preg_lact: 'nutrition',
  has_smm_0_5_months: 'nutrition',
  has_smm_10_17_years: 'nutrition',
  has_smm_18_and_above_years: 'nutrition',
  has_smm_5_9_years: 'nutrition',
  has_smm_6_59_months: 'nutrition',
  has_smm_preg_lact: 'nutrition',
  hbv_screened_anc: 'ancHbv',
  hbv_screened_positive_anc: 'ancHbv',
  hiv_female: 'hivTests',
  hiv_male: 'hivTests',
  hiv_setting_community: 'hivTests',
  hiv_setting_facility: 'hivTests',
  hiv_setting_kvp: 'hivTests',
  inconclusive_female: 'hivTests',
  inconclusive_male: 'hivTests',
  infant_arv_anc: 'hivPositiveMothers',
  infant_arv_ld: 'hivPositiveMothers',
  infant_arv_pnc: 'hivPositiveMothers',
  initial_test_LD: 'hivTests',
  initial_test_anc: 'hivTests',
  initial_test_pnc_greater_6_weeks: 'hivTests',
  initial_test_pnc_less_6_weeks: 'hivTests',
  known_positive_1st_anc: 'ancKnownPositives',
  known_positive_anc_10_19: 'ancKnownPositives',
  known_positive_anc_20_24: 'ancKnownPositives',
  male_10_14: 'hivTests',
  male_15_19: 'hivTests',
  male_20_24: 'hivTests',
  male_25_above: 'hivTests',
  male_2_9: 'hivTests',
  maternal_haart_1st_anc: 'ancKnownPositives',
  maternal_haart_less_6_weeks: 'hivTests',
  maternal_haart_more_6_weeks: 'hivTests',
  not_established: 'tbDsd',
  on_art_10_14_female: 'artMonthly',
  on_art_10_14_male: 'artMonthly',
  on_art_15_19_female: 'artMonthly',
  on_art_15_19_male: 'artMonthly',
  on_art_1_4_female: 'artMonthly',
  on_art_1_4_male: 'artMonthly',
  on_art_20_24_female: 'artMonthly',
  on_art_20_24_male: 'artMonthly',
  on_art_25_above_female: 'artMonthly',
  on_art_25_above_male: 'artMonthly',
  on_art_5_9_female: 'artMonthly',
  on_art_5_9_male: 'artMonthly',
  on_art_anc_10_19: 'ancKnownPositives',
  on_art_anc_20_24: 'ancKnownPositives',
  on_art_less_1_female: 'artMonthly',
  on_art_less_1_male: 'artMonthly',
  pep_non_occupational: 'pep',
  pep_occupational: 'pep',
  positive_LD: 'hivTests',
  positive_anc: 'hivTests',
  positive_anc_ld_pnc_10_19: 'hivTests',
  positive_anc_ld_pnc_20_24: 'hivTests',
  positive_kvp: 'hivTests',
  positive_pnc_greater_6_weeks: 'hivTests',
  positive_pnc_less_6_weeks: 'hivTests',
  prep_new_ayp_female: 'prepVisits',
  prep_new_ayp_male: 'prepVisits',
  prep_new_discordant_female: 'prepVisits',
  prep_new_discordant_male: 'prepVisits',
  prep_new_female_general_pop: 'prepVisits',
  prep_new_fsw: 'prepVisits',
  prep_new_male_general_pop: 'prepVisits',
  prep_new_msm: 'prepVisits',
  prep_new_preg_breastfeeding: 'prepVisits',
  prep_new_pwud_female: 'prepVisits',
  prep_new_pwud_male: 'prepVisits',
  prep_new_vulnerable_female: 'prepVisits',
  prep_new_vulnerable_male: 'prepVisits',
  prep_sti_ayp_female: 'prepVisits',
  prep_sti_ayp_male: 'prepVisits',
  prep_sti_discordant_female: 'prepVisits',
  prep_sti_discordant_male: 'prepVisits',
  prep_sti_female_general_pop: 'prepVisits',
  prep_sti_fsw: 'prepVisits',
  prep_sti_male_general_pop: 'prepVisits',
  prep_sti_msm: 'prepVisits',
  prep_sti_preg_breastfeeding: 'prepVisits',
  prep_sti_pwud_female: 'prepVisits',
  prep_sti_pwud_male: 'prepVisits',
  prep_sti_vulnerable_female: 'prepVisits',
  prep_sti_vulnerable_male: 'prepVisits',
  retest_LD: 'hivTests',
  retest_anc: 'hivTests',
  retest_pnc_greater_6_weeks: 'hivTests',
  retest_pnc_less_6_weeks: 'hivTests',
  screened_tb_greater_15: 'tbDsd',
  screened_tb_less_15: 'tbDsd',
  seroconverted_female: 'prepVisits',
  seroconverted_male: 'prepVisits',
  severe_acute_supp_0_5_months: 'nutrition',
  severe_acute_supp_10_17_years: 'nutrition',
  severe_acute_supp_18_and_above_years: 'nutrition',
  severe_acute_supp_5_9_years: 'nutrition',
  severe_acute_supp_6_59_months: 'nutrition',
  severe_acute_supp_preg_lact: 'nutrition',
  severe_moderate_supp_0_5_months: 'nutrition',
  severe_moderate_supp_10_17_years: 'nutrition',
  severe_moderate_supp_18_and_above_years: 'nutrition',
  severe_moderate_supp_5_9_years: 'nutrition',
  severe_moderate_supp_6_59_months: 'nutrition',
  severe_moderate_supp_preg_lact: 'nutrition',
  start_art_10_19: 'hivTests',
  start_art_20_24: 'hivTests',
  start_maternal_haart_1st_anc: 'hivTests',
  start_maternal_haart_LD: 'hivTests',
  start_tb: 'tb',
  start_tb_art_new: 'tb',
  start_tb_known_positive: 'tb',
  start_tb_on_art: 'tb',
  start_tb_positive: 'tb',
  start_tpt_greater_15: 'tbDsd',
  start_tpt_less_15: 'tbDsd',
  weaning: 'infantFeeding'
};
