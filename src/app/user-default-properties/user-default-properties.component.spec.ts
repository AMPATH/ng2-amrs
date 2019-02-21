/* tslint:disable:no-inferrable-types */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { Location, APP_BASE_HREF } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserDefaultPropertiesComponent } from './user-default-properties.component';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { UserService } from '../openmrs-api/user.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserMockService } from './user.service.mock';
import { UserDefaultPropertiesModule } from './user-default-properties.module';
import { BehaviorSubject } from 'rxjs';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { IonicStorageModule } from '@ionic/storage';
import {
  FakeRetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import {
  RetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry.service';
import { ProviderResourceService } from '../openmrs-api/provider-resource.service';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import 'rxjs/add/observable/of';

class MockActivatedRoute {
  // Observable that contains a map of the parameters
  private subjectParamMap = new BehaviorSubject(convertToParamMap(this.testParamMap));
  paramMap = this.subjectParamMap.asObservable();

  private _testParamMap: ParamMap;
  get testParamMap() {
    return this._testParamMap;
  }
  set testParamMap(params: {}) {
    this._testParamMap = convertToParamMap(params);
    this.subjectParamMap.next(this._testParamMap);
  }

  // Observable that contains a map of the query parameters
  private subjectQueryParamMap = new BehaviorSubject(convertToParamMap(this.testParamMap));
  queryParamMap = this.subjectQueryParamMap.asObservable();

  private _testQueryParamMap: ParamMap;
  get testQueryParamMap() {
    return this._testQueryParamMap;
  }
  set testQueryParamMap(params: {}) {
    this._testQueryParamMap = convertToParamMap(params);
    this.subjectQueryParamMap.next(this._testQueryParamMap);
  }

  get snapshot() {
    return {
      paramMap: this.testParamMap,
      queryParamMap: this.testQueryParamMap
    };
  }
}

class MockPropertyService {
  getCurrentUserDefaultLocation() {
    return 'test location';
  }

  getLocations() {
    return (new BehaviorSubject(null)).asObservable();
  }

  getUserProperty() {
    return {};
  }
}

class MockProviderResourceService {
  public v: string = 'full';

  public getUrl(): string {
    return 'provider';
  }

  public searchProvider(searchText: string, cached: boolean = false, v: string = null):
    Observable<any> {
    return Observable.of({});
  }

  public getProviderByUuid(uuid: string, cached: boolean = false, v: string = null):
    Observable<any> {
    return Observable.of({});
  }
  public getProviderByPersonUuid(uuid) {
    const providerResults = new ReplaySubject(1);
    return providerResults;
  }
}

class StorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }
}

describe('Component: User Default Settings Unit Tests', () => {

  let propertiesResourceService: UserDefaultPropertiesService
    , fixture: ComponentFixture<UserDefaultPropertiesComponent>
    , injector: any
    , activeRoute: MockActivatedRoute
    , component: UserDefaultPropertiesComponent;

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [UserDefaultPropertiesModule, HttpClientTestingModule, CacheModule, IonicStorageModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: UserDefaultPropertiesService,
          useClass: MockPropertyService
        },
        {
          provide: RetrospectiveDataEntryService, useFactory: () => {
            return new FakeRetrospectiveDataEntryService();
          }
        },
        { provide: Location, useClass: SpyLocation },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        AppSettingsService,
        {
          provide: UserService,
          useValue: new UserMockService(null)
        },
        {
          provide: ActivatedRoute, useClass: MockActivatedRoute
        },
        SessionStorageService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new StorageService(null, null);
          }, deps: []
        },
        {
          provide: ProviderResourceService, useFactory: () => {
            return new MockProviderResourceService();
          }
        },
        LocalStorageService
      ]
    }).compileComponents()
      .then(() => {

        fixture = TestBed.createComponent(UserDefaultPropertiesComponent);
        component = fixture.componentInstance;
        injector = fixture.debugElement.injector;
        propertiesResourceService = TestBed.get(UserDefaultPropertiesService);
        activeRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;
        activeRoute.testParamMap = { confirm: 1 };
      });

  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {
    expect(component.locations.length).toEqual(0);
    expect(component.isBusy).toBeFalsy();
    expect(component.currentLocation).toBeFalsy(undefined);
    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callFake(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'goToPatientSearch').and.callFake(() => { });
    component.goToPatientSearch();
    expect(component.goToPatientSearch).toHaveBeenCalled();

    spyOn(component, 'select').and.callFake(() => { });
    component.select({ display: 'test' });
    expect(component.select).toHaveBeenCalled();

    done();

  });

});
