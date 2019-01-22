import { TestBed, inject, async } from '@angular/core/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { MOHReportService } from './moh-731-report-pdf-view.service';
import { MOHReportComponent } from './moh-731-report-pdf-view.component';
import {
  Moh731ResourceServiceMock
} from '../../etl-api/moh-731-resource.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class LocationServiceMock {
  public getLocations(): Observable<any> {
    return of([{
      uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
      display: 'location',
      name: 'location',
      countyDistrict: 'district',
      stateProvince: 'county'
    }, {
      uuid: 'uuid 2',
      display: 'location 2',
      name: 'location 2',
      countyDistrict: 'district 2',
      stateProvince: 'county 2'
    }]);
  }

  constructor() {
  }

}

describe('Component: MOHReportComponent', () => {
  const mock = new Moh731ResourceServiceMock();
  const data = mock.getTestData();
  const rowData = data.result;
  const sectionDefinitions = data.sectionDefinitions;

  const params = {
    county: 'Kakamega',
    district: 'dsit',
    endDate: '2017-04-10',
    facility: 'Location 2',
    facilityName: 'Location 2',
    location_name: 'Location 2',
    location_uuid: 'Location-uuid',
    startDate: '2017-03-10'
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        MOHReportComponent,
        MOHReportService,
        AppSettingsService,
        LocalStorageService,
        LocationResourceService,

        {
          provide: LocationResourceService, useFactory: () => {
            return new LocationServiceMock();
          }, deps: []
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of MOHReportComponent', () => {
    const moh731ReportComponent: MOHReportComponent
      = TestBed.get(MOHReportComponent);
    expect(moh731ReportComponent).toBeTruthy();
  });

  it('should have all required properties declared and initialized as public property / method',
    () => {
      const component: MOHReportComponent
        = TestBed.get(MOHReportComponent);
      // properties
      expect(component.pdfSrc).toBeNull();
      expect(component.page).toBe(1);
      expect(component.isBusy).toBe(false);
      expect(component.locations).toBeDefined();
      expect(component.pdfProxy).toBe(null);
      expect(component.pdfMakeProxy).toBe(null);
      expect(component.errorFlag).toBe(false);
      // methods
      expect(component.generatePdf).toBeDefined();
      expect(component.afterLoadCompletes).toBeDefined();
      expect(component.sectionDefinitions).toBeUndefined();
      expect(component.data).toBeUndefined();
      expect(component.mohReports).toBeUndefined();
      expect(component.startDate).toBeUndefined();
      expect(component.endDate).toBeUndefined();
      expect(component.downloadPdf).toBeDefined();
      expect(component.sectionsDef).toBeUndefined();
      expect(component.nextPage).toBeDefined();
      expect(component.prevPage).toBeDefined();
      expect(component.generateMoh731ByLocation).toBeDefined();
      expect(component.printMohReport).toBeDefined();
    });

  it('should generate pdf when the generatePdf is called',
    (done) => {
      const component: MOHReportComponent = TestBed.get(MOHReportComponent);
      const mohReportService: MOHReportService = TestBed.get(MOHReportService);
      component.data = data;
      component.startDate = '2017-03-10';
      component.endDate = '2017-04-10';
      spyOn(component, 'generatePdf').and.callThrough();
      component.generatePdf();
      expect(component.generatePdf).toHaveBeenCalled();
      done();
    }
  );

  it('should navigate to the next page when nextPage is invoked',
    (done) => {
      const component: MOHReportComponent
        = TestBed.get(MOHReportComponent);
      component.data = data;
      component.startDate = '2017-03-10';
      component.endDate = '2017-04-10';
      component.ngOnInit();
      component.nextPage(); // navigate
      expect(component.page).toBe(2);
      done();
    }
  );

  it('should navigate to the previous page when prevPage() is invoked',
    (done) => {
      const component: MOHReportComponent
        = TestBed.get(MOHReportComponent);
      component.data = data;
      component.startDate = '2017-03-10';
      component.endDate = '2017-04-10';

      component.ngOnInit();
      component.prevPage(); // navigate
      expect(component.page).toBe(0);
      done();
    }
  );

});
