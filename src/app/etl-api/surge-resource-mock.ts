import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { SurgeResourceService } from './surge-resource.service';

@Injectable()
export class SurgeResourceServiceMock extends SurgeResourceService {
    constructor() {
        super(null, null);
    }

    public getSurgeWeeklyReport(params: any) {
        const subj  = new Subject<any>();
        const that = this;
        setTimeout(() => {
            subj.next(that.testWeeklySurgeData());
        });
        return subj.asObservable();
    }

    public getSurgeWeeklyPatientList(params: any) {
        return Observable.of('data');
    }

    public testWeeklySurgeData() {
        return {
            'schemas': {
                'main': {
                    'name': 'SurgeReportAggregate',
                    'version': '1.0',
                    'tag': '',
                    'description': '',
                    'uses': [
                        {
                            'name': 'surgeReport',
                            'version': '1.0',
                            'type': 'dataset_def'
                        }
                    ],
                    'sources': [
                        {
                            'dataSet': 'surgeReport',
                            'alias': 'srb'
                        }
                    ],
                    'columns': [
                        {
                            'type': 'simple_column',
                            'alias': 'location_uuid',
                            'column': 'srb.location_uuid'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'location',
                            'column': 'srb.location'
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'scheduled_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(scheduled_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'visit_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(visit_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'on_schedule',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(on_schedule)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'unscheduled_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(unscheduled_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'early_appointment',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(early_appointment_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'late_appointment_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(late_appointment_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'missed_appointment_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(missed_appointment_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'ltfu',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(ltfu)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'defaulted',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(defaulted)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'missed',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(missed)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'started_art_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(started_art_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'started_dc_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(started_dc_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'dc_eligible_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(dc_eligible_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'new_prep_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(new_prep_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'cur_prep_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(cur_prep_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'enrolled_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(enrolled_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'due_for_vl_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(due_for_vl_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'has_vl_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(has_vl_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'is_suppressed',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(is_suppressed)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'is_un_suppressed',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(is_un_suppressed)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'tx2_scheduled_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(tx2_scheduled_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'tx2_scheduled_honored',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(tx2_scheduled_honored)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'tx2_visit_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(tx2_visit_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'missed_tx2_visit_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(missed_tx2_visit_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'returned_to_care_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(returned_to_care_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'active_in_care_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(active_in_care_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'is_pre_art_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(is_pre_art_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'art_revisit_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(art_revisit_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'on_art_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(on_art_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'transfer_in_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(transfer_in_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'transfer_out_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(transfer_out_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'scheduled_this_week_and_due_for_vl',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(scheduled_this_week_and_due_for_vl)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'due_for_vl_has_vl_order',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(due_for_vl_has_vl_order)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'due_for_vl_dont_have_order',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(due_for_vl_dont_have_order)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'ltfu_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(ltfu_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'missed_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(missed_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'defaulted_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(defaulted_this_week)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'due_for_vl_this_week_active',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(due_for_vl_this_week_active)'
                            }
                        },
                        {
                            'type': 'derived_column',
                            'alias': 'on_schedule_this_week',
                            'expressionType': 'simple_expression',
                            'expressionOptions': {
                                'expression': 'sum(on_schedule_this_week)'
                            }
                        }
                    ],
                    'groupBy': {
                        'groupParam': 'groupByParam',
                        'columns': [
                            'location_uuid'
                        ],
                        'excludeParam': 'excludeParam'
                    },
                    'dynamicJsonQueryGenerationDirectives': {
                        'patientListGenerator': {
                            'useTemplate': 'patient-list-frozen-template',
                            'useTemplateVersion': '1.0',
                            'generatingDirectives': {
                                'joinDirectives': {
                                    'joinType': 'INNER',
                                    'joinCondition': '<<base_column>> = <<template_column>>',
                                    'baseColumn': 'person_id',
                                    'templateColumn': 'person_id'
                                }
                            }
                        }
                    },
                    'default': {
                        'name': 'SurgeReportAggregate',
                        'version': '1.0',
                        'tag': '',
                        'description': '',
                        'uses': [
                            {
                                'name': 'surgeReport',
                                'version': '1.0',
                                'type': 'dataset_def'
                            }
                        ],
                        'sources': [
                            {
                                'dataSet': 'surgeReport',
                                'alias': 'srb'
                            }
                        ],
                        'columns': [
                            {
                                'type': 'simple_column',
                                'alias': 'location_uuid',
                                'column': 'srb.location_uuid'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'location',
                                'column': 'srb.location'
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'scheduled_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(scheduled_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'visit_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(visit_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'on_schedule',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(on_schedule)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'unscheduled_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(unscheduled_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'early_appointment',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(early_appointment_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'late_appointment_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(late_appointment_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'missed_appointment_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(missed_appointment_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'ltfu',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(ltfu)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'defaulted',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(defaulted)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'missed',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(missed)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'started_art_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(started_art_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'started_dc_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(started_dc_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'dc_eligible_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(dc_eligible_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'new_prep_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(new_prep_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'cur_prep_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(cur_prep_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'enrolled_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(enrolled_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'due_for_vl_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(due_for_vl_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'has_vl_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(has_vl_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'is_suppressed',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(is_suppressed)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'is_un_suppressed',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(is_un_suppressed)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'tx2_scheduled_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(tx2_scheduled_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'tx2_scheduled_honored',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(tx2_scheduled_honored)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'tx2_visit_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(tx2_visit_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'missed_tx2_visit_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(missed_tx2_visit_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'returned_to_care_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(returned_to_care_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'active_in_care_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(active_in_care_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'is_pre_art_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(is_pre_art_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'art_revisit_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(art_revisit_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'on_art_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(on_art_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'transfer_in_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(transfer_in_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'transfer_out_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(transfer_out_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'scheduled_this_week_and_due_for_vl',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(scheduled_this_week_and_due_for_vl)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'due_for_vl_has_vl_order',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(due_for_vl_has_vl_order)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'due_for_vl_dont_have_order',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(due_for_vl_dont_have_order)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'ltfu_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(ltfu_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'missed_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(missed_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'defaulted_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(defaulted_this_week)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'due_for_vl_this_week_active',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(due_for_vl_this_week_active)'
                                }
                            },
                            {
                                'type': 'derived_column',
                                'alias': 'on_schedule_this_week',
                                'expressionType': 'simple_expression',
                                'expressionOptions': {
                                    'expression': 'sum(on_schedule_this_week)'
                                }
                            }
                        ],
                        'groupBy': {
                            'groupParam': 'groupByParam',
                            'columns': [
                                'location_uuid'
                            ],
                            'excludeParam': 'excludeParam'
                        },
                        'dynamicJsonQueryGenerationDirectives': {
                            'patientListGenerator': {
                                'useTemplate': 'patient-list-frozen-template',
                                'useTemplateVersion': '1.0',
                                'generatingDirectives': {
                                    'joinDirectives': {
                                        'joinType': 'INNER',
                                        'joinCondition': '<<base_column>> = <<template_column>>',
                                        'baseColumn': 'person_id',
                                        'templateColumn': 'person_id'
                                    }
                                }
                            }
                        }
                    }
                },
                'surgeReport': {
                    'name': 'surgeReport',
                    'version': '1.0',
                    'tag': '',
                    'description': '',
                    'uses': [],
                    'sources': [
                        {
                            'table': 'ndwr.surge_weekly_report_dataset_1_test',
                            'alias': 'srb'
                        },
                        {
                            'table': 'amrs.location',
                            'alias': 'l',
                            'join': {
                                'type': 'INNER',
                                'joinCondition': 'l.location_id = srb.location_id'
                            }
                        }
                    ],
                    'columns': [
                        {
                            'type': 'simple_column',
                            'alias': 'year_week',
                            'column': 'srb.year_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'encounter_yw',
                            'column': 'srb.encounter_yw'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'encounter_date',
                            'column': 'srb.encounter_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'end_date',
                            'column': 'srb.end_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'start_date',
                            'column': 'srb.start_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'age',
                            'column': 'srb.age'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'gender',
                            'column': 'srb.gender'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'clinical_visit_number',
                            'column': 'srb.clinical_visit_number'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'prev_rtc_date',
                            'column': 'srb.prev_rtc_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'visit_this_week',
                            'column': 'srb.visit_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'on_schedule',
                            'column': 'srb.on_schedule'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'early_appointment',
                            'column': 'srb.early_appointment'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'early_appointment_this_week',
                            'column': 'srb.early_appointment_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'late_appointment_this_week',
                            'column': 'srb.late_appointment_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'days_since_rtc_date',
                            'column': 'srb.days_since_rtc_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'scheduled_this_week',
                            'column': 'srb.scheduled_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'unscheduled_this_week',
                            'column': 'srb.unscheduled_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'tx2_visit_this_week',
                            'column': 'srb.tx2_visit_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'missed_tx2_visit_this_week',
                            'column': 'srb.missed_tx2_visit_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'death_date',
                            'column': 'srb.death_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'missed_appointment_this_week',
                            'column': 'srb.missed_appointment_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'ltfu',
                            'column': 'srb.ltfu'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'defaulted',
                            'column': 'srb.defaulted'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'missed',
                            'column': 'srb.missed'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'next_status',
                            'column': 'srb.next_status'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'active_in_care_this_week',
                            'column': 'srb.active_in_care_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cur_arv_adherence',
                            'column': 'srb.cur_arv_adherence'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cur_who_stage',
                            'column': 'srb.cur_who_stage'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'is_pre_art_this_week',
                            'column': 'srb.is_pre_art_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'arv_first_regimen_location_id',
                            'column': 'srb.arv_first_regimen_location_id'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'arv_first_regimen',
                            'column': 'srb.arv_first_regimen'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'arv_first_regimen_names',
                            'column': 'srb.arv_first_regimen_names'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'started_art_this_week',
                            'column': 'srb.started_art_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'enrollment_date',
                            'column': 'srb.enrollment_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'days_since_starting_arvs',
                            'column': 'srb.days_since_starting_arvs'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'arv_first_regimen_start_date',
                            'column': 'srb.arv_first_regimen_start_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'enrolled_this_week',
                            'column': 'srb.enrolled_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cur_arv_meds',
                            'column': 'srb.cur_arv_meds'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'art_revisit_this_week',
                            'column': 'srb.art_revisit_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'on_art_this_week',
                            'column': 'srb.on_art_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'has_vl_this_week',
                            'column': 'srb.has_vl_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'is_suppressed',
                            'column': 'srb.is_suppressed'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'is_un_suppressed',
                            'column': 'srb.is_un_suppressed'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'days_since_last_vl',
                            'column': 'srb.days_since_last_vl'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'due_for_vl_this_week',
                            'column': 'srb.due_for_vl_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'reason_for_needing_vl_this_week',
                            'column': 'srb.reason_for_needing_vl_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cd4_1',
                            'column': 'srb.cd4_1'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cd4_1_date',
                            'column': 'srb.cd4_1_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'child_hiv_status_disclosure_status',
                            'column': 'srb.child_hiv_status_disclosure_status'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'transfer_in_this_week',
                            'column': 'srb.transfer_in_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'transfer_in_location_id',
                            'column': 'srb.transfer_in_location_id'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'transfer_in_date',
                            'column': 'srb.transfer_in_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'transfer_out_this_week',
                            'column': 'srb.transfer_out_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'transfer_out_location_id',
                            'column': 'srb.transfer_out_location_id'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'transfer_out_date',
                            'column': 'srb.transfer_out_date'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'status',
                            'column': 'srb.status'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'prev_status',
                            'column': 'srb.prev_status'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cur_status',
                            'column': 'srb.cur_status'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'dc_eligible_this_week',
                            'column': 'srb.dc_eligible_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'started_dc_this_week',
                            'column': 'srb.started_dc_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'tx2_scheduled_this_week',
                            'column': 'srb.tx2_scheduled_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'tx2_scheduled_honored',
                            'column': 'srb.tx2_scheduled_honored'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'returned_to_care_this_week',
                            'column': 'srb.returned_to_care_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'new_prep_this_week',
                            'column': 'srb.new_prep_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cur_prep_this_week',
                            'column': 'srb.cur_prep_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'prev_enc_id',
                            'column': 'srb.prev_enc_id'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'cur_enc_id',
                            'column': 'srb.cur_enc_id'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'scheduled_this_week_and_due_for_vl',
                            'column': 'srb.scheduled_this_week_and_due_for_vl'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'due_for_vl_has_vl_order',
                            'column': 'srb.due_for_vl_has_vl_order'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'due_for_vl_dont_have_order',
                            'column': 'srb.due_for_vl_dont_have_order'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'ltfu_this_week',
                            'column': 'srb.ltfu_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'missed_this_week',
                            'column': 'srb.missed_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'due_for_vl_this_week_active',
                            'column': 'srb.due_for_vl_this_week_active'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'on_schedule_this_week',
                            'column': 'srb.on_schedule_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'defaulted_this_week',
                            'column': 'srb.defaulted_this_week'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'location_uuid',
                            'column': 'l.uuid'
                        },
                        {
                            'type': 'simple_column',
                            'alias': 'location',
                            'column': 'l.name'
                        }
                    ],
                    'filters': {
                        'conditionJoinOperator': 'and',
                        'conditions': [
                            {
                                'filterType': 'tableColumns',
                                'conditionExpression': 'year_week = ? ',
                                'parameterName': 'year_week'
                            },
                            {
                                'filterType': 'tableColumns',
                                'conditionExpression': 'l.uuid in ?',
                                'parameterName': 'locationUuids'
                            }
                        ]
                    },
                    'default': {
                        'name': 'surgeReport',
                        'version': '1.0',
                        'tag': '',
                        'description': '',
                        'uses': [],
                        'sources': [
                            {
                                'table': 'ndwr.surge_weekly_report_dataset_1_test',
                                'alias': 'srb'
                            },
                            {
                                'table': 'amrs.location',
                                'alias': 'l',
                                'join': {
                                    'type': 'INNER',
                                    'joinCondition': 'l.location_id = srb.location_id'
                                }
                            }
                        ],
                        'columns': [
                            {
                                'type': 'simple_column',
                                'alias': 'year_week',
                                'column': 'srb.year_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'encounter_yw',
                                'column': 'srb.encounter_yw'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'encounter_date',
                                'column': 'srb.encounter_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'end_date',
                                'column': 'srb.end_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'start_date',
                                'column': 'srb.start_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'age',
                                'column': 'srb.age'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'gender',
                                'column': 'srb.gender'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'clinical_visit_number',
                                'column': 'srb.clinical_visit_number'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'prev_rtc_date',
                                'column': 'srb.prev_rtc_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'visit_this_week',
                                'column': 'srb.visit_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'on_schedule',
                                'column': 'srb.on_schedule'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'early_appointment',
                                'column': 'srb.early_appointment'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'early_appointment_this_week',
                                'column': 'srb.early_appointment_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'late_appointment_this_week',
                                'column': 'srb.late_appointment_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'days_since_rtc_date',
                                'column': 'srb.days_since_rtc_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'scheduled_this_week',
                                'column': 'srb.scheduled_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'unscheduled_this_week',
                                'column': 'srb.unscheduled_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'tx2_visit_this_week',
                                'column': 'srb.tx2_visit_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'missed_tx2_visit_this_week',
                                'column': 'srb.missed_tx2_visit_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'death_date',
                                'column': 'srb.death_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'missed_appointment_this_week',
                                'column': 'srb.missed_appointment_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'ltfu',
                                'column': 'srb.ltfu'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'defaulted',
                                'column': 'srb.defaulted'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'missed',
                                'column': 'srb.missed'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'next_status',
                                'column': 'srb.next_status'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'active_in_care_this_week',
                                'column': 'srb.active_in_care_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cur_arv_adherence',
                                'column': 'srb.cur_arv_adherence'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cur_who_stage',
                                'column': 'srb.cur_who_stage'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'is_pre_art_this_week',
                                'column': 'srb.is_pre_art_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'arv_first_regimen_location_id',
                                'column': 'srb.arv_first_regimen_location_id'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'arv_first_regimen',
                                'column': 'srb.arv_first_regimen'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'arv_first_regimen_names',
                                'column': 'srb.arv_first_regimen_names'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'started_art_this_week',
                                'column': 'srb.started_art_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'enrollment_date',
                                'column': 'srb.enrollment_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'days_since_starting_arvs',
                                'column': 'srb.days_since_starting_arvs'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'arv_first_regimen_start_date',
                                'column': 'srb.arv_first_regimen_start_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'enrolled_this_week',
                                'column': 'srb.enrolled_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cur_arv_meds',
                                'column': 'srb.cur_arv_meds'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'art_revisit_this_week',
                                'column': 'srb.art_revisit_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'on_art_this_week',
                                'column': 'srb.on_art_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'has_vl_this_week',
                                'column': 'srb.has_vl_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'is_suppressed',
                                'column': 'srb.is_suppressed'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'is_un_suppressed',
                                'column': 'srb.is_un_suppressed'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'days_since_last_vl',
                                'column': 'srb.days_since_last_vl'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'due_for_vl_this_week',
                                'column': 'srb.due_for_vl_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'reason_for_needing_vl_this_week',
                                'column': 'srb.reason_for_needing_vl_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cd4_1',
                                'column': 'srb.cd4_1'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cd4_1_date',
                                'column': 'srb.cd4_1_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'child_hiv_status_disclosure_status',
                                'column': 'srb.child_hiv_status_disclosure_status'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'transfer_in_this_week',
                                'column': 'srb.transfer_in_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'transfer_in_location_id',
                                'column': 'srb.transfer_in_location_id'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'transfer_in_date',
                                'column': 'srb.transfer_in_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'transfer_out_this_week',
                                'column': 'srb.transfer_out_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'transfer_out_location_id',
                                'column': 'srb.transfer_out_location_id'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'transfer_out_date',
                                'column': 'srb.transfer_out_date'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'status',
                                'column': 'srb.status'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'prev_status',
                                'column': 'srb.prev_status'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cur_status',
                                'column': 'srb.cur_status'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'dc_eligible_this_week',
                                'column': 'srb.dc_eligible_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'started_dc_this_week',
                                'column': 'srb.started_dc_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'tx2_scheduled_this_week',
                                'column': 'srb.tx2_scheduled_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'tx2_scheduled_honored',
                                'column': 'srb.tx2_scheduled_honored'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'returned_to_care_this_week',
                                'column': 'srb.returned_to_care_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'new_prep_this_week',
                                'column': 'srb.new_prep_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cur_prep_this_week',
                                'column': 'srb.cur_prep_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'prev_enc_id',
                                'column': 'srb.prev_enc_id'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'cur_enc_id',
                                'column': 'srb.cur_enc_id'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'scheduled_this_week_and_due_for_vl',
                                'column': 'srb.scheduled_this_week_and_due_for_vl'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'due_for_vl_has_vl_order',
                                'column': 'srb.due_for_vl_has_vl_order'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'due_for_vl_dont_have_order',
                                'column': 'srb.due_for_vl_dont_have_order'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'ltfu_this_week',
                                'column': 'srb.ltfu_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'missed_this_week',
                                'column': 'srb.missed_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'due_for_vl_this_week_active',
                                'column': 'srb.due_for_vl_this_week_active'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'on_schedule_this_week',
                                'column': 'srb.on_schedule_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'defaulted_this_week',
                                'column': 'srb.defaulted_this_week'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'location_uuid',
                                'column': 'l.uuid'
                            },
                            {
                                'type': 'simple_column',
                                'alias': 'location',
                                'column': 'l.name'
                            }
                        ],
                        'filters': {
                            'conditionJoinOperator': 'and',
                            'conditions': [
                                {
                                    'filterType': 'tableColumns',
                                    'conditionExpression': 'year_week = ? ',
                                    'parameterName': 'year_week'
                                },
                                {
                                    'filterType': 'tableColumns',
                                    'conditionExpression': 'l.uuid in ?',
                                    'parameterName': 'locationUuids'
                                }
                            ]
                        }
                    }
                }
            },
            'size': 1,
            'result': [
                {
                    'location_uuid': '294efcca-cf90-40da-8abb-1e082866388d',
                    'location': 'St. Luke\'s',
                    'scheduled_this_week': 3,
                    'visit_this_week': 3,
                    'on_schedule': 18,
                    'unscheduled_this_week': 1,
                    'early_appointment': 75,
                    'late_appointment_this_week': 125,
                    'missed_appointment_this_week': 1,
                    'ltfu': 105,
                    'defaulted': 6,
                    'missed': 4,
                    'started_art_this_week': 0,
                    'started_dc_this_week': 0,
                    'dc_eligible_this_week': 0,
                    'new_prep_this_week': 0,
                    'cur_prep_this_week': 0,
                    'enrolled_this_week': 0,
                    'due_for_vl_this_week': 203,
                    'has_vl_this_week': 0,
                    'is_suppressed': 0,
                    'is_un_suppressed': 0,
                    'tx2_scheduled_this_week': 0,
                    'tx2_scheduled_honored': 0,
                    'tx2_visit_this_week': 11,
                    'missed_tx2_visit_this_week': 0,
                    'returned_to_care_this_week': 1,
                    'active_in_care_this_week': null,
                    'is_pre_art_this_week': null,
                    'art_revisit_this_week': 3,
                    'on_art_this_week': null,
                    'transfer_in_this_week': 1,
                    'transfer_out_this_week': 0,
                    'scheduled_this_week_and_due_for_vl': 3,
                    'due_for_vl_has_vl_order': 0,
                    'due_for_vl_dont_have_order': 111,
                    'ltfu_this_week': 0,
                    'missed_this_week': 0,
                    'defaulted_this_week': 0,
                    'due_for_vl_this_week_active': 1,
                    'on_schedule_this_week': 0,
                    'target_to_bring_back': 115
                }
            ],
            'sectionDefinitions': [
                {
                    'sectionTitle': '',
                    'indicators': [
                        {
                            'label': 'Locations',
                            'ref': 'HV03-28',
                            'indicator': 'location'
                        }
                    ]
                },
                {
                    'sectionTitle': 'Visits',
                    'indicators': [
                        {
                            'label': 'Sheduled this week',
                            'ref': 'HV03-28',
                            'indicator': 'scheduled_this_week'
                        },
                        {
                            'label': 'Honored visit',
                            'ref': 'HV03-29',
                            'indicator': 'on_schedule_this_week'
                        },
                        {
                            'label': 'Visit this week',
                            'ref': 'HV03-28',
                            'indicator': 'visit_this_week'
                        },
                        {
                            'label': 'Unsheduled this week',
                            'ref': 'HV03-31',
                            'indicator': 'unscheduled_this_week'
                        },
                        {
                            'label': 'Unsheduled early',
                            'ref': 'HV03-30',
                            'indicator': 'early_appointment'
                        },
                        {
                            'label': 'Unscheduled late',
                            'ref': 'HV03-32',
                            'indicator': 'late_appointment_this_week'
                        }
                    ]
                },
                {
                    'sectionTitle': 'Client Disengagements',
                    'indicators': [
                        {
                            'label': 'Missed Cumulative',
                            'ref': 'HV03-28',
                            'indicator': 'missed'
                        },
                        {
                            'label': 'Missed this week',
                            'ref': 'HV03-30',
                            'indicator': 'missed_appointment_this_week'
                        },
                        {
                            'label': 'Defaulted Cumulative',
                            'ref': 'HV03-28',
                            'indicator': 'defaulted'
                        },
                        {
                            'label': 'Defaulted this week',
                            'ref': 'HV03-32',
                            'indicator': 'defaulted_this_week'
                        },
                        {
                            'label': 'LTFU Cumulative',
                            'ref': 'HV03-33',
                            'indicator': 'ltfu'
                        },
                        {
                            'label': 'LTFU this week',
                            'ref': 'HV03-30',
                            'indicator': 'ltfu_this_week'
                        },
                        {
                            'label': 'Target to bring back',
                            'ref': 'HV03-28',
                            'indicator': 'target_to_bring_back'
                        },
                        {
                            'label': 'Brought To Care',
                            'ref': 'HV03-28',
                            'indicator': 'returned_to_care_this_week'
                        }
                    ]
                },
                {
                    'sectionTitle': 'Viral Load',
                    'indicators': [
                        {
                            'label': 'Active and Due for VL this week',
                            'ref': 'HV03-28',
                            'indicator': 'due_for_vl_this_week_active'
                        },
                        {
                            'label': 'Sheduled and Due for VL',
                            'ref': 'HV03-28',
                            'indicator': 'scheduled_this_week_and_due_for_vl'
                        },
                        {
                            'label': 'VL resulted this week',
                            'ref': 'HV03-29',
                            'indicator': 'has_vl_this_week'
                        },
                        {
                            'label': 'Scheduled Due with VL ordered',
                            'ref': 'HV03-28',
                            'indicator': 'due_for_vl_has_vl_order'
                        },
                        {
                            'label': 'Scheduled Due without VL ordered',
                            'ref': 'HV03-29',
                            'indicator': 'due_for_vl_dont_have_order'
                        },
                        {
                            'label': 'Has VL and Suppressed',
                            'ref': 'HV03-30',
                            'indicator': 'is_suppressed'
                        },
                        {
                            'label': 'Has VL and Unsuppressed',
                            'ref': 'HV03-31',
                            'indicator': 'is_un_suppressed'
                        }
                    ]
                },
                {
                    'sectionTitle': 'Differentiated Care(DC)',
                    'indicators': [
                        {
                            'label': 'DC eligible this week',
                            'ref': 'HV03-32',
                            'indicator': 'dc_eligible_this_week'
                        },
                        {
                            'label': 'Enrolled to DC this week',
                            'ref': 'HV03-30',
                            'indicator': 'started_dc_this_week'
                        }
                    ]
                },
                {
                    'sectionTitle': 'ART',
                    'indicators': [
                        {
                            'label': 'active in care this week',
                            'ref': 'HV03-31',
                            'indicator': 'active_in_care_this_week'
                        },
                        {
                            'label': 'Enrolled this week',
                            'ref': 'HV03-31',
                            'indicator': 'enrolled_this_week'
                        },
                        {
                            'label': 'Patients on ART',
                            'ref': 'HV03-31',
                            'indicator': 'on_art_this_week'
                        },
                        {
                            'label': 'Started ART this week',
                            'ref': 'HV03-29',
                            'indicator': 'started_art_this_week'
                        },
                        {
                            'label': 'Pre-ART this week',
                            'ref': 'HV03-32',
                            'indicator': 'is_pre_art_this_week'
                        },
                        {
                            'label': 'ART revisit this week',
                            'ref': 'HV03-33',
                            'indicator': 'art_revisit_this_week'
                        },
                        {
                            'label': 'Transfer in this week',
                            'ref': 'HV03-32',
                            'indicator': 'transfer_in_this_week'
                        },
                        {
                            'label': 'Transfer out this week',
                            'ref': 'HV03-33',
                            'indicator': 'transfer_out_this_week'
                        }
                    ]
                },
                {
                    'sectionTitle': 'New on ART and Second Visits',
                    'indicators': [
                        {
                            'label': 'Started ART this week',
                            'ref': 'HV03-29',
                            'indicator': 'started_art_this_week'
                        },
                        {
                            'label': 'ART second visit this week',
                            'ref': 'HV03-28',
                            'indicator': 'tx2_visit_this_week'
                        },
                        {
                            'label': 'Scheduled second visit',
                            'ref': 'HV03-32',
                            'indicator': 'tx2_scheduled_this_week'
                        },
                        {
                            'label': 'Honored Second visit',
                            'ref': 'HV03-33',
                            'indicator': 'tx2_scheduled_honored'
                        },
                        {
                            'label': 'Missed ART second visit this week',
                            'ref': 'HV03-29',
                            'indicator': 'missed_tx2_visit_this_week'
                        }
                    ]
                },
                {
                    'sectionTitle': 'Prevention',
                    'indicators': [
                        {
                            'label': 'Current On PREP this week',
                            'ref': 'HV03-28',
                            'indicator': 'cur_prep_this_week'
                        },
                        {
                            'label': 'Enrolled to PREP this week',
                            'ref': 'HV03-33',
                            'indicator': 'new_prep_this_week'
                        }
                    ]
                }
            ]
        };
    }
}
