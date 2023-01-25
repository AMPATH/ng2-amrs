export interface Covid19StatusSummary {
  vaccination_status: string;
  vaccination_status_code: string;
  vaccination_status_code_message: string;
  date_given_first_dose?: Date;
  first_dose_vaccine_administered: string;
  date_given_second_dose?: Date;
  second_dose_vaccine_administered: string;
}
