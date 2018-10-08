import { Injectable } from '@angular/core';
import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';
import { Observable, of } from 'rxjs';
@Injectable()
export class MockHivClinicFlowResourceService implements ClinicFlowResource {
    public dummyHivClinicFlowData = {
        startIndex: 0,
        size: 162,
        result: [
            {
                patient_id: 13977,
                patient_uuid: 'patient-uuid',
                names: 'First Middle Name',
                identifiers: 'id-1,id-2',
                visit_person_Name: 'provider name',
                location: 'MTRH Module 2',
                locationId: 13,
                visit_person_id: 59128,
                visit_id: 1231,
                registered: '2017-03-29T04:32:10.000Z',
                visit_end: null,
                encounters: [
                    {
                        encounter_type: 110,
                        encounter_start: '2017-03-29T05:06:47.000Z',
                        encounter_end: '2017-03-29T05:08:21.000Z',
                        encounter_type_name: 'TRIAGE',
                        location: 'MTRH Module 2',
                        person_name: 'triage provider',
                        person_id: 823228
                    },
                    {
                        encounter_type: 2,
                        encounter_start: '2017-03-29T05:32:00.000Z',
                        encounter_end: '2017-03-29T05:38:32.000Z',
                        encounter_type_name: 'ADULTRETURN',
                        location: 'MTRH Module 2',
                        person_name: 'provider name 2',
                        person_id: 773461
                    }
                ],
                triaged: '2017-03-29T05:06:47.000Z',
                time_to_be_triaged: 34,
                seen_by_clinician: '2017-03-29T05:32:00.000Z',
                completed_visit: '2017-03-29T05:38:32.000Z',
                time_to_be_seen_by_clinician: 25,
                time_to_complete_visit: 66
            }
        ],
        averageWaitingTime: {
            averageWaitingTime: '11.6',
            averageVisitCompletionTime: '32.8',
            averageTriageWaitingTime: '11.7',
            averageClinicianWaitingTime: '11.5'
        },
        medianWaitingTime: {
            medianWaitingTime: '12.0',
            medianVisitCompletionTime: '37.5',
            medianTriageWaitingTime: '9.5',
            medianClinicianWaitingTime: '14.0'
        },
        incompleteVisitsCount: 4,
        completeVisitsCount: 4,
        totalVisitsCount: 8,
        resultsByLocation: [
            {
                locationName: 'MTRH Module 2',
                locationId: 13,
                results: [
                    {
                        patient_id: 8120,
                        patient_uuid: 'puuid -q',
                        names: 'h h h',
                        identifiers: '000969307-8',
                        visit_person_Name: 'Simon Maiyo',
                        location: 'MTRH Module 2',
                        locationId: 13,
                        visit_person_id: 59128,
                        visit_id: 281435,
                        registered: '2017-03-31T05:32:05.000Z',
                        visit_end: null,
                        encounters: [
                            {
                                encounter_type: 110,
                                encounter_start: '2017-03-31T05:52:15.000Z',
                                encounter_end: '2017-03-31T05:54:46.000Z',
                                encounter_type_name: 'TRIAGE',
                                location: 'MTRH Module 2',
                                person_name: 't provider',
                                person_id: 234212
                            },
                            {
                                encounter_type: 2,
                                encounter_start: '2017-03-31T06:04:55.000Z',
                                encounter_end: '2017-03-31T06:09:53.000Z',
                                encounter_type_name: 'ADULTRETURN',
                                location: 'MTRH Module 2',
                                person_name: 'a provider',
                                person_id: 773461
                            }
                        ],
                        triaged: '2017-03-31T05:52:15.000Z',
                        time_to_be_triaged: 20,
                        seen_by_clinician: '2017-03-31T06:04:55.000Z',
                        completed_visit: '2017-03-31T06:09:53.000Z',
                        time_to_be_seen_by_clinician: 13,
                        time_to_complete_visit: 38
                    }]
            }
        ],
        statsByLocation: [
            {
                locationId: 13,
                location: 'MTRH Module 2',
                medianWaitingTime: {
                    medianWaitingTime: '14.0',
                    medianVisitCompletionTime: '54.0',
                    medianTriageWaitingTime: '3.0',
                    medianClinicianWaitingTime: '37.5'
                },
                incompleteVisitsCount: 6,
                completeVisitsCount: 78,
                totalVisitsCount: 84
            }
        ]
    };

    constructor() { }

    public getClinicFlow(dateStarted, locations): Observable<any> {
        return of(this.dummyHivClinicFlowData);
    }

    public getHivDummyData() {
        return this.dummyHivClinicFlowData;
    }

}
