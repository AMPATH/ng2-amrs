import { TestBed, async, inject } from '@angular/core/testing';
import { ClinicRoutesFactory } from './clinic-side-nav-routes.factory';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

describe('Clinic Routes Factory:', () => {
  const fakeRoutesProvider: RoutesProviderService = {
    analyticsDashboardConfig: {},
    patientDashboardConfig: {},
    patientListCohortConfig: {},
    providerDashboardConfig: {},
    clinicDashboardConfig: {
      'id': 'clinicDashboard',
      'name': 'Clinic Dashboard',
      'baseRoute': 'clinic-dashboard',
      'routeParameter': 'locationUuid',
      'departments': [
        {
          'departmentName': 'General',
          'baseRoute': 'general',
          'alias': 'general',
          'routes': [
            {
              'url': 'daily-schedule',
              'label': 'Daily Schedule',
              'icon': 'fa fa-calendar-o',
              'isSideBarOpen': false
            },
            {
              'url': 'monthly-schedule',
              'label': 'Monthly Schedule',
              'icon': 'fa fa-calendar',
              'isSideBarOpen': false
            },
            {
              'url': 'clinic-lab-orders',
              'label': 'Lab Orders',
              'icon': 'icon-i-pathology',
              'isSideBarOpen': false
            },
            {
              'url': 'defaulter-list',
              'label': 'Defaulter List',
              'icon': 'fa fa-list',
              'isSideBarOpen': false
            },
            {
              'url': 'patient-status-change-visualization',
              'label': 'Patient Care Status',
              'icon': 'fa fa-bar-chart'
            },
            {
              'url': 'patient-registration',
              'label': 'Patient Registration',
              'icon': 'glyphicon glyphicon-user',
              'isSideBarOpen': false
            },
            {
              'url': 'program-enrollment',
              'label': 'Program Enrollment',
              'icon': 'fa fa-list-alt',
              'isSideBarOpen': false
            }
          ]
        },
        {
          'departmentName': 'HIV',
          'baseRoute': 'hiv',
          'alias': 'hiv',
          'routes': [
            {
              'url': 'daily-schedule',
              'label': 'Daily Schedule',
              'icon': 'fa fa-calendar-o',
              'isSideBarOpen': false
            },
            {
              'url': 'monthly-schedule',
              'label': 'Monthly Schedule',
              'icon': 'fa fa-calendar',
              'isSideBarOpen': false
            },
            {
              'url': 'hiv-comparative-chart',
              'label': 'Clinical Visualization',
              'icon': 'fa fa-line-chart',
              'isSideBarOpen': false
            },
            {
              'url': 'moh-731-report',
              'label': 'MOH 731 Reports',
              'icon': 'glyphicon glyphicon-equalizer',
              'isSideBarOpen': false
            },
            {
              'url': 'hiv-summary-indicator-report',
              'label': 'HIV Summary Indicators',
              'icon': 'fa fa-file-pdf-o',
              'isSideBarOpen': false
            },
            {
              'url': 'patients-requiring-vl',
              'label': 'Patients Requiring VL',
              'icon': 'icon-i-laboratory',
              'isSideBarOpen': false
            }
          ]
        }
      ]
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClinicRoutesFactory,
        {
          provide: RoutesProviderService, useFactory: () => {
            return fakeRoutesProvider;
          }, deps: []
        },
        LocalStorageService
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });


  it('should inject client routes service',
    inject([ClinicRoutesFactory], (s: ClinicRoutesFactory) => {
      expect(s).toBeTruthy();
    })
  );

  xit('should create dashboard routes for a given clinic',
    inject([ClinicRoutesFactory], (s: ClinicRoutesFactory) => {
      const locationUuid = 'locationUuid';

      const createdRoutes = s.createClinicDashboardRoutes(locationUuid);

      expect(createdRoutes).toBeTruthy();

    }));

  it('should have related programs shared routes', () => {
    const sampleConfig = {
      'id': 'patientDashboard',
      'name': 'Patient Dashboard',
      'baseRoute': 'patient-dashboard',
      'programs': [
        {
          'programName': 'General Info',
          'programUuid': 'general-uuid',
          'baseRoute': 'general',
          'alias': 'general',
          'published': true,
          'requiresPatientEnrollment': false,
          'routes': [
            {
              'url': 'patient-info',
              'label': 'Patient Info',
              'icon': 'fa fa-clipboard'
            }
          ]
        },
        {
          'programName': 'HIV',
          'programUuid': '781d85b0-1359-11df-a1f1-0026b9348838',
          'baseRoute': 'hiv',
          'alias': 'hiv',
          'published': true,
          'shared-routes-class': 'hiv',
          'requiresPatientEnrollment': true,
          'routes': []
        },
        {
          'programName': 'Oncology',
          'programUuid': 'onc-uuid',
          'baseRoute': 'oncology',
          'alias': 'hiv',
          'published': false,
          'shared-routes-class': 'oncology',
          'requiresPatientEnrollment': true,
          'routes': []
        }
      ],
      'sharedRoutes': {
        'hiv': [
          {
            'url': 'shared-hiv',
            'label': 'shared-hiv',
            'icon': 'fa fa-clipboard'
          }
        ],
        'oncology': [
          {
            'url': 'shared-oncology',
            'label': 'shared-oncology',
            'icon': 'fa fa-clipboard'
          }
        ]
      }
    };

    const service = TestBed.get(ClinicRoutesFactory);

    const processed = service.processSharedRoutes(sampleConfig);

    expect(processed.programs[1].routes.length).toBe(1);
    expect(processed.programs[2].routes.length).toBe(1);
    expect(processed.programs[1].routes[0].url).toEqual('shared-hiv');
    expect(processed.programs[2].routes[0].url).toEqual('shared-oncology');
  });
});
