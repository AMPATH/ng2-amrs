import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, APP_BASE_HREF } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserDefaultPropertiesComponent } from './user-default-properties.component';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserMockService } from './user.service.mock';
import { UserDefaultPropertiesModule } from './user-default-properties.module';
import { BehaviorSubject } from 'rxjs';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { FakeRetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import { RetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry.service';
import { ProviderResourceService } from '../openmrs-api/provider-resource.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

class MockActivatedRoute {
  public params;
  private paramsSubject = new BehaviorSubject(this.testParams);
  private _params: {};
  constructor() {
    this.params = this.paramsSubject.asObservable();
  }
  get testParams() {
    return this._params;
  }
  set testParams(newParams: any) {
    this._params = newParams;
    this.paramsSubject.next(newParams);
  }
}

class MockPropertyService {
  public getCurrentUserDefaultLocation() {
    return 'test location';
  }

  public getLocations() {
    return (new BehaviorSubject(null)).asObservable();
  }

  getUserProperty() {
    return {}
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
    return Observable.of({})
  }
  public getProviderByPersonUuid(uuid) {
    let providerResults = new ReplaySubject(1);
    return providerResults;
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
      imports: [UserDefaultPropertiesModule, CacheModule],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {provide: APP_BASE_HREF, useValue: '/'},
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: UserDefaultPropertiesService,
          useClass: MockPropertyService
        },
        {
          provide: RetrospectiveDataEntryService, useFactory: () => {
          return new FakeRetrospectiveDataEntryService();
        }
        },
        { provide : Location, useClass: SpyLocation },
        { provide : Router, useValue : jasmine.createSpyObj('Router', ['navigate'])  },
        AppSettingsService,
        {
          provide: UserService,
          useValue: new UserMockService(null)
        },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        SessionStorageService,
        LocalStorageService,
        DataCacheService,
        CacheService,
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
      });

  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  xit('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  // it('should set the default value of location from route params if you they are defined',
  //   inject([Router, ActivatedRoute, UserDefaultPropertiesService, UserService],
  //     (r: Router, route: ActivatedRoute, t: UserDefaultPropertiesService, u: UserService) => {
  //       activeRoute.testParams = { confirm: 1 };
  //       component.ngOnInit();
  //       fixture.detectChanges();
  //       route.params.subscribe((params) => {
  //         expect(params['confirm']).toEqual(1);
  //         expect(component.query).toEqual('test location');
  //       });
  // }));

  // it('should have required properties', (done) => {
  //   expect(component.locations.length).toEqual(0);
  //   expect(component.isBusy).toBeFalsy();
  //   expect(typeof component.user).toBeDefined(User);
  //   expect(component.query).toEqual('');
  //   expect(component.filteredList.length).toEqual(0);
  //   expect(component.currentLocation).toEqual('');
  //   expect(component.selectedIdx).toEqual(-1);
  //   done();

  // });

  // beforeEach((done) => {

  //   spyOn(component, 'ngOnInit').and.callFake(() => {});
  //   component.ngOnInit();
  //   expect(component.ngOnInit).toHaveBeenCalled();

  //   spyOn(component, 'goToPatientSearch').and.callFake(() => {});
  //   component.goToPatientSearch();
  //   expect(component.goToPatientSearch).toHaveBeenCalled();

  //   spyOn(component, 'filter').and.callFake(() => {});
  //   component.filter('click');
  //   expect(component.filter).toHaveBeenCalled();

  //   spyOn(component, 'select').and.callFake(() => {});
  //   component.select({display: 'test'});
  //   expect(component.select).toHaveBeenCalled();

  //   done();

  // });
  xit('should set default value of location from route params if they are defined',
    inject([Router, ActivatedRoute, UserDefaultPropertiesService, UserService],
      (r: Router, route: ActivatedRoute, t: UserDefaultPropertiesService, u: UserService) => {
        activeRoute.testParams = { confirm: 1 };
        component.ngOnInit();
        fixture.detectChanges();
        route.params.subscribe((params) => {
          expect(params['confirm']).toEqual(1);
          expect(component.currentLocation).toEqual('test location');
        });
  }));

  xit('should have required properties', (done) => {
    expect(component.locations.length).toEqual(0);
    expect(component.isBusy).toBeFalsy();
    expect(component.currentLocation).toBeFalsy(undefined);
    done();

  });

  xit('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callFake(() => {});
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'goToPatientSearch').and.callFake(() => {});
    component.goToPatientSearch();
    expect(component.goToPatientSearch).toHaveBeenCalled();

    /*spyOn(component, 'filter').and.callFake(() => {});
    component.filter('click');
    expect(component.filter).toHaveBeenCalled();*/

    spyOn(component, 'select').and.callFake(() => {});
    component.select({display: 'test'});
    expect(component.select).toHaveBeenCalled();

    done();

  });

});
