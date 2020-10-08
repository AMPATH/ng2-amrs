import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { DynamicRoutesService } from './dynamic-routes.service';
import { DynamicRouteModel } from './dynamic-route.model';

describe('Service: DynamicRoutesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicRoutesService]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of DynamicRoutesService', () => {
    const service: DynamicRoutesService = TestBed.get(DynamicRoutesService);
    expect(service).toBeTruthy();
  });

  it('should have required properties initialized and exposed publicly', () => {
    const service: DynamicRoutesService = TestBed.get(DynamicRoutesService);
    expect(service.routes).toBeTruthy();
    expect(service.routesModel).toBeTruthy();
    expect(service.dashboardConfig).toBeTruthy();
    expect(service.analyticsDashboardConfig).toBeTruthy();
    expect(service.clinicDashboardConfig).toBeTruthy();
    expect(service.patientDashboardConfig).toBeTruthy();
  });

  it(
    'should have dashboardConfig property initialized with mandatory dashboards' +
      'i.e analytics, clinic and patient dashboard ',
    () => {
      const service: DynamicRoutesService = TestBed.get(DynamicRoutesService);
      expect(service.dashboardConfig.analyticsDashboard).toBeTruthy();
      expect(service.dashboardConfig.clinicDashboard).toBeTruthy();
      expect(service.dashboardConfig.patientDashboard).toBeTruthy();
    }
  );

  it(
    'should set routes when setRoutes() is invoked with a valid ' +
      'route object of type DynamicRouteModel',
    (done) => {
      const service: DynamicRoutesService = TestBed.get(DynamicRoutesService);
      const dynamicRouteMock: DynamicRouteModel = {
        dashboardId: 'clinicDashboard',
        programs: [],
        moduleLabel: 'Clinic Dashboard',
        params: {
          locationUuid: 'location-uuid'
        },
        routes: []
      };

      service.routes.subscribe(
        (routes) => {
          expect(routes).toEqual(dynamicRouteMock);
          done();
        },
        (err) => console.log(err),
        () => console.log('Completed')
      );
      service.setRoutes(dynamicRouteMock);
    }
  );

  it('should generate valid parameter string when extractParameter() is invoked', inject(
    [],
    fakeAsync(() => {
      const service: DynamicRoutesService = TestBed.get(DynamicRoutesService);
      const dynamicRouteModel: DynamicRouteModel = {
        dashboardId: '',
        programs: [],
        moduleLabel: '',
        params: {
          patientUuid: 'patient-uuid'
        },
        routes: []
      };
      const stringParams = service.extractParameter(
        'patientUuid',
        dynamicRouteModel
      );
      tick(50);
      expect(stringParams).toEqual('/patient-uuid');
    })
  ));
});
