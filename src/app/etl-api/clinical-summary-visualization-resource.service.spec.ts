import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ClinicalSummaryVisualizationResourceService } from './clinical-summary-visualization-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
const expectedPatientCareResults = {
    startIndex: 0,
    size: 3,
    result: [
        {
            location_uuid: 'location-uuid',
            location_id: 13,
            patients: 5294,
            deceased_patients: 49,
            untraceable_patients: 163,
            transferred_out_patients: 166,
            hiv_negative_patients: 2,
            patients_continuing_care: 4238,
            self_disengaged_from_care: 4,
            defaulters: 239,
            transfer_to_MNCH: 7,
            other_patient_care_status: 93
        }
    ]
};

class MockCacheStorageService {
    constructor(a, b) {}

    public ready() {
        return true;
    }
}

const expectedArtResults = {
    startIndex: 0,
    size: 3,
    result: [
        {
            location_uuid: 'location-uuid',
            location_id: 13,
            patients: 4276,
            on_nevirapine: 1641,
            on_lopinavir: 266,
            on_efavirenz: 2067,
            on_atazanavir: 266,
            on_raltegravir: 5,
            on_other_arv_drugs: 15,
            not_on_arv: 17
        }
    ]
};

const expectedComparativeResults = {
    startIndex: 0,
    size: 3,
    result: [
        {
            reporting_date: '2016-03-30T21:00:00.000Z',
            location_uuid: 'location-uuid',
            location_id: 13,
            reporting_month: '03/2016',
            currently_in_care_total: 4418,
            on_art_total: 4269,
            not_on_art_total: 169,
            patients_requiring_vl: 3886,
            tested_appropriately: 3438,
            not_tested_appropriately: 448,
            due_for_annual_vl: 157,
            pending_vl_orders: 0,
            missing_vl_order: 448,
            perc_tested_appropriately: 88.4714,
            virally_suppressed: 3147,
            not_virally_suppressed: 291,
            perc_virally_suppressed: 91.5358
        }
    ],
    indicator: [{

    }]
};

const reportParams = {
    startDate: '2017-02-01',
    startIndex: undefined,
    locationUuids: 'uuid',
    limit: undefined,
    endDate: '2017-03-31T23:59:59.999%2B0300',
    gender: 'M,F',
    groupBy: 'groupByEndDate',
    indicator: 'indicator-123',
    order: 'encounter_datetime%7Casc'
};

const patientList = {
    startIndex: 0,
    size: 3,
    result: [
        {
            person_id: 2050,
            patient_uuid: 'patient-uuid',
            vl_1_date: '2015-06-25T21:00:00.000Z',
            vl_1: 638,
            person_name: 'David Dvi Kurga',
            identifiers: 'identifier-1, identifier-1',
            gender: 'M',
            age: 49
        }
    ]
};

describe('ClinicalSummaryVisualizationResourceService Tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                CacheModule,
                HttpClientTestingModule
            ],
            providers: [
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
                ClinicalSummaryVisualizationResourceService,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {
                expect(s).toBeTruthy();
            })
    );

    it('clinical summary visualization resourceService resource methods should be defined',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {
                expect(s.getUrl).toBeDefined();
                expect(s.getPatientListUrl).toBeDefined();
                expect(s.getHivComparativeOverviewReport).toBeDefined();
                expect(s.getHivComparativeOverviewPatientList).toBeDefined();
                expect(s.getArtOverviewReport).toBeDefined();
                expect(s.getArtOverviewReportPatientList).toBeDefined();
                expect(s.getPatientCareStatusReport).toBeDefined();
                expect(s.getPatientCareStatusReportList).toBeDefined();
            })
    );

    xit('should return report urlRequest parameters',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {
                const urlParams = s.getUrlRequestParams(reportParams);
                const params = urlParams.toString();
                expect(params).toContain('locationUuids=uuid');
                expect(params).toContain('startIndex=0');
                expect(params).toContain('endDate=2017-03-31T23:59:59.999%252B0300');
                expect(params).toContain('gender=M,F');
                expect(params).toContain('startDate=2017-02-01');
                expect(params).toContain('groupBy=groupByEndDate');
                expect(params).toContain('indicator=indicator-123');
                expect(params).toContain('order=encounter_datetime%257Casc');
                expect(params).toContain('limit=300');

            }
        )
    );

    it('should return Hiv Comparative Overview Report',
        inject([ClinicalSummaryVisualizationResourceService, HttpTestingController],
            (s: ClinicalSummaryVisualizationResourceService, httpMOck: HttpTestingController) => {

                const url = 'https://amrsreporting.ampath.or.ke:8002'
                    + '/etl/clinical-hiv-comparative-overview?startIndex=0&endDate='
                    + '2017-03-31T23:59:59.999%252B0300&gender=M,F&startDate='
                    + '2017-02-01&groupBy=groupByEndDate&indicator=indicator-123'
                    + '&order=encounter_datetime%257Casc&locationUuids=uuid&limit=300';

                const req = httpMOck.match(url);
                expect(req).toBeDefined();

                s.getHivComparativeOverviewReport(reportParams).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expectedComparativeResults);
                });
            })
    );

    it('should return Hiv Comparative Overview Report Patient List',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {

                s.getHivComparativeOverviewPatientList(reportParams).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(patientList.result);
                });
            })
    );


    it('should return clinical-art-overview Report',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {

                s.getArtOverviewReport(reportParams).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expectedArtResults);
                });
            })
    );

    it('should return clinical-art-overview Report Patient List',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {

                s.getArtOverviewReportPatientList(reportParams).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(patientList.result);
                });
            })
    );

    it('should return clinical-patient-care-status-overview Report',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {

                s.getPatientCareStatusReport(reportParams).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expectedPatientCareResults);
                });
            })
    );

    it('should return clinical-patient-care-status-overview Report Patient List',
        inject([ClinicalSummaryVisualizationResourceService],
            (s: ClinicalSummaryVisualizationResourceService) => {

                s.getPatientCareStatusReportList(reportParams).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(patientList.result);
                });
            })
    );
});
