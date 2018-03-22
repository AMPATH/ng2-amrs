/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, ComponentFixture,
  tick, discardPeriodicTasks } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { OnlineTrackerComponent } from './online-tracker.component';
import { OnlineTrackerService } from './online-tracker.service';
import { SessionService } from '../openmrs-api/session.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { LocalStorageService } from './../utils/local-storage.service';
import { AppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytics.service';

class DataStub {

  public updateOnlineStatus(): Promise<any> {
    alert('Data stub call');
    return Promise.resolve(true);
  }

}

describe('Component: OnlineTracker', () => {
  let fixture: ComponentFixture<OnlineTrackerComponent>;
  let component: OnlineTrackerComponent;
  let debugElement: DebugElement;
  let dataStub: OnlineTrackerService;
  let element;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineTrackerComponent],
      providers: [
        { provide: OnlineTrackerService, useClass: DataStub },
        {
          provide: Http,
          useFactory: (
            backendInstance: MockBackend,
            defaultOptions: BaseRequestOptions
          ) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        SessionService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        LocalStorageService,
        AppFeatureAnalytics
      ]
    })
      .compileComponents()
      .then(() => {

        fixture = TestBed.createComponent(OnlineTrackerComponent);
        debugElement = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(OnlineTrackerService);

      });
  }));

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should set online to true when updateOnline return true', fakeAsync(() => {
    const spy = spyOn(dataStub, 'updateOnlineStatus').and.returnValue(
      Promise.resolve(true)
    );
    fixture.detectChanges();
    component.getOnlineStatus();
    tick();
    component.subscribeToTimer = false;
    expect(component.isOnline).toBe(true);
    expect(component.isUpdating).toBe(false);
    expect(spy.calls.any()).toEqual(true);
    discardPeriodicTasks();

  }));

  it('should set online to false when updateOnline return false', fakeAsync(() => {
    const spy = spyOn(dataStub, 'updateOnlineStatus').and.returnValue(
      Promise.resolve(false)
    );
    fixture.detectChanges();
    component.getOnlineStatus();
    tick();
    component.subscribeToTimer = false;
    expect(component.isOnline).toBe(false);
    expect(component.isUpdating).toBe(true);
    expect(spy.calls.any()).toEqual(true);
    discardPeriodicTasks();

  }));
});
