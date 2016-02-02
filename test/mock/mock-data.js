"use strict";
//mock data
module.exports = function ()
{
	return {
		getPatientMockData:function getPatientMockData() {
			return [
			{
				person_id: 123,
				uuid: "c6e4e026-3b49-4b64-81de-05cf8bd18594",
				encounter_id: 5480271,
				encounter_datetime: "2015-08-05T08:33:17.000Z",
				location_id: 100,
				location_uuid: "00b47ef5-a29b-40a2-a7f4-6851df8d6532",
				visit_num: null,
				death_date: null,
				scheduled_visit: null,
				transfer_out: null,
				out_of_care: null,
				prev_rtc_date: "2015-08-05T21:00:00.000Z",
				rtc_date: "2015-08-05T21:00:00.000Z",
				arv_start_date: null,
				arv_first_regimen: null,
				cur_arv_meds: null,
				cur_arv_line: null,
				first_evidence_patient_pregnant: null,
				edd: null,
				screened_for_tb: null,
				tb_tx_start_date: "2015-07-29T18:00:00.000Z",
				pcp_prophylaxis_start_date: null,
				cd4_resulted: null,
				cd4_resulted_date: null,
				cd4_1: 500,
				cd4_1_date: "2015-07-25T21:00:00.000Z",
				cd4_2: null,
				cd4_2_date: null,
				cd4_percent_1: null,
				cd4_percent_1_date: null,
				cd4_percent_2: null,
				cd4_percent_2_date: null,
				vl_resulted: null,
				vl_resulted_date: null,
				vl_1: 500,
				vl_1_date: "2015-08-03T21:00:00.000Z",
				vl_2: null,
				vl_2_date: null,
				vl_order_date: null,
				cd4_order_date: null
			}
			]
		},

		getCustomMockData: function getCustomMockData() {
			return [
			{
				patient_id: 1001,
				creator: 3,
				date_created: "2006-02-14T21:00:00.000Z",
				changed_by: 164623,
				date_changed: "2012-04-23T14:36:23.000Z",
				voided: 0,
				voided_by: null,
				date_voided: null,
				void_reason: null
			}
			]
		}
		
	}
}();