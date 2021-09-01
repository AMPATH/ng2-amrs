import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MOH412ReportViewComponent } from './moh-412-report-view.component';

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

class MockActivatedRoute {
  constructor() {}
}

const mockResults = [
  {
    location_id: 1,
    location_uuid: 'uuid1',
    reporting_month: '2021-08',
    location: 'Location 1',
    age_range: '25_to_49',
    hiv_status: 'positive',
    screening_visit_type: 'initial',
    screened_initial_visit: 7,
    dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__positive__screened_via_or_via_vili: 10
  },
  {
    location_id: 2,
    location_uuid: 'uuid2',
    reporting_month: '2021-08',
    location: 'Location 2',
    age_range: '25_to_49',
    hiv_status: 'positive',
    screening_visit_type: 'initial',
    screened_initial_visit: 8,
    dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__positive__screened_via_or_via_vili: 11
  },
  {
    location_id: 3,
    location_uuid: 'uuid3',
    reporting_month: '2021-08',
    location: 'Location 3',
    age_range: '25_to_49',
    hiv_status: 'positive',
    screening_visit_type: 'initial',
    screened_initial_visit: 6,
    dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__positive__screened_via_or_via_vili: 12
  }
];

const mockSesctionDef = [
  {
    page: '1. SCREENING METHOD',
    pageBody: [
      {
        sectionTitle: 'Initial Screening',
        sections: [
          {
            name: 'VIA OR VIA/VILI',
            body: [
              {
                title: 'HIV Positive',
                indicators: [
                  {
                    label: ' < 25 yrs',
                    ref: '',
                    indicator:
                      'dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__positive__screened_via_or_via_vili'
                  }
                ]
              },
              {
                title: 'HIV Negative',
                indicators: [
                  {
                    label: ' < 25 yrs',
                    ref: 'HV02-44',
                    indicator:
                      'dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__negative__screened_via_or_via_vili'
                  }
                ]
              },
              {
                title:
                  'Total HIV Postive and Negative VIA OR VIA/VILI Initial Screenings',
                indicators: [
                  {
                    label: 'Total Initial Screenings',
                    ref: '',
                    indicator: 'screened_initial_visit'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const mockSesctionDefData = [
  {
    page: '1. SCREENING METHOD',
    pageBody: [
      {
        sectionTitle: 'Initial Screening',
        sections: [
          {
            name: 'VIA OR VIA/VILI',
            body: [
              {
                title: 'HIV Positive',
                indicators: [
                  {
                    label: ' < 25 yrs',
                    ref: '',
                    indicator:
                      'dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__positive__screened_via_or_via_vili',
                    indicatorData: [
                      {
                        location: 'Location 1',
                        locationUuid: 'uuid1',
                        count: 10,
                        reportingMonth: '2021-08'
                      },
                      {
                        location: 'Location 2',
                        locationUuid: 'uuid2',
                        count: 11,
                        reportingMonth: '2021-08'
                      },
                      {
                        location: 'Location 3',
                        locationUuid: 'uuid3',
                        count: 12,
                        reportingMonth: '2021-08'
                      }
                    ]
                  }
                ]
              },
              {
                title: 'HIV Negative',
                indicators: [
                  {
                    label: ' < 25 yrs',
                    ref: 'HV02-44',
                    indicator:
                      'dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__negative__screened_via_or_via_vili',
                    indicatorData: [
                      {
                        location: 'Location 1',
                        locationUuid: 'uuid1',
                        count: 0,
                        reportingMonth: '2021-08'
                      },
                      {
                        location: 'Location 2',
                        locationUuid: 'uuid2',
                        count: 0,
                        reportingMonth: '2021-08'
                      },
                      {
                        location: 'Location 3',
                        locationUuid: 'uuid3',
                        count: 0,
                        reportingMonth: '2021-08'
                      }
                    ]
                  }
                ]
              },
              {
                title:
                  'Total HIV Postive and Negative VIA OR VIA/VILI Initial Screenings',
                indicators: [
                  {
                    label: 'Total Initial Screenings',
                    ref: '',
                    indicator: 'screened_initial_visit',
                    indicatorData: [
                      {
                        location: 'Location 1',
                        locationUuid: 'uuid1',
                        count: 7,
                        reportingMonth: '2021-08'
                      },
                      {
                        location: 'Location 2',
                        locationUuid: 'uuid2',
                        count: 8,
                        reportingMonth: '2021-08'
                      },
                      {
                        location: 'Location 3',
                        locationUuid: 'uuid3',
                        count: 6,
                        reportingMonth: '2021-08'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const mockParams = {
  startDate: '2021-08-01',
  endDate: '2021-08-31',
  locationUuids: 'uuid1',
  locationType: 'screening_location'
};
const testParams = {
  startDate: '2021-08-01',
  endDate: '2021-08-31',
  locationUuid: 'uuid1',
  locationType: 'screening_location',
  indicators:
    'dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__negative__screened_via_or_via_vili'
};
const mockIndicator =
  'dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__negative__screened_via_or_via_vili';

describe('Component: MOH412ReportViewComponent', () => {
  let fixture: ComponentFixture<MOH412ReportViewComponent>;
  let component: MOH412ReportViewComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MOH412ReportViewComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: MockActivatedRoute }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MOH412ReportViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct column headers', () => {
    component.generateLocationsColumnHeader(mockResults);
    const colHeader = component.colHeaders;
    const expectedColHeader = [
      {
        location: 'Location 1'
      },
      {
        location: 'Location 2'
      },
      {
        location: 'Location 3'
      }
    ];
    expect(colHeader.length).toEqual(3);
    expect(JSON.stringify(colHeader)).toBe(JSON.stringify(expectedColHeader));
  });

  it('should add location data to indicator section def data', () => {
    component.addLocationDataToIndicatorSection(mockSesctionDef, mockResults);
    expect(JSON.stringify(component.sectionData)).toBe(
      JSON.stringify(mockSesctionDefData)
    );
  });

  it('should add location data to indicator section def data', () => {
    component.addLocationDataToIndicatorSection(mockSesctionDef, mockResults);
    expect(JSON.stringify(component.sectionData)).toBe(
      JSON.stringify(mockSesctionDefData)
    );
  });

  it('should generate correct url params', () => {
    const expectedParams = {
      startDate: '2021-08-01',
      endDate: '2021-08-31',
      locationUuids: 'uuid1',
      locationType: 'screening_location',
      indicators:
        'dc__screening_visit_type__initial__age_range__less_than_25__hiv_status__negative__screened_via_or_via_vili'
    };
    component.params = mockParams;
    const generatedUrlParams = component.generateUrlParams(
      testParams,
      mockIndicator
    );
    expect(JSON.stringify(generatedUrlParams)).toBe(
      JSON.stringify(expectedParams)
    );
  });

  it('should navigate to patient list', () => {
    component.params = mockParams;
    component.navigateToPatientList(testParams, mockIndicator);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
