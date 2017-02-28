import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location, APP_BASE_HREF } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserDefaultPropertiesComponent } from './user-default-properties.component';
import { UserDefaultPropertiesMockService } from './user-default-properties.service.mock';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserMockService } from './user.service.mock';
import { UserDefaultPropertiesModule } from './user-default-properties.module';

describe('Component: User Default Settings Unit Tests', () => {

  let propertiesResourceService: UserDefaultPropertiesService
    , fixture: ComponentFixture<UserDefaultPropertiesComponent>
    , injector: any
    , component: UserDefaultPropertiesComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UserDefaultPropertiesModule],
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
          useClass: UserDefaultPropertiesMockService
        },
        { provide : Location, useClass: SpyLocation },
        { provide : Router, useValue : jasmine.createSpyObj('Router', ['navigate'])  },
        AppSettingsService,
        {
          provide: UserService,
          useValue: new UserMockService(null)
        },
        SessionStorageService,
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

  it('should instantiate the component', (done) => {

    expect(component).toEqual(jasmine.any(UserDefaultPropertiesComponent));
    done();

  });

  it('should have required properties', (done) => {

    expect(component.locations.length).toEqual(0);
    expect(component.isBusy).toBeFalsy();
    expect(typeof component.user).toBeDefined(User);
    expect(component.query).toEqual('');
    expect(component.filteredList.length).toEqual(0);
    expect(component.currentLocation).toEqual('');
    expect(component.selectedIdx).toEqual(-1);

    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callFake(() => {});
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'goToPatientSearch').and.callFake(() => {});
    component.goToPatientSearch();
    expect(component.goToPatientSearch).toHaveBeenCalled();

    spyOn(component, 'filter').and.callFake(() => {});
    component.filter('click');
    expect(component.filter).toHaveBeenCalled();

    spyOn(component, 'select').and.callFake(() => {});
    component.select({display: 'test'});
    expect(component.select).toHaveBeenCalled();

    done();

  });

});
