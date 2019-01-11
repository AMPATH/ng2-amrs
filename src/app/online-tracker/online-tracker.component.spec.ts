/* tslint:disable:no-unused-variable */

import {
  TestBed, async, fakeAsync, ComponentFixture,
  tick, discardPeriodicTasks
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { OnlineTrackerComponent } from './online-tracker.component';
import { OnlineTrackerService } from './online-tracker.service';
import { SessionService } from '../openmrs-api/session.service';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { LocalStorageService } from './../utils/local-storage.service';
import { AppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytics.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      imports: [HttpClientTestingModule],
      declarations: [OnlineTrackerComponent],
      providers: [
        { provide: OnlineTrackerService, useClass: DataStub },
        SessionService,
        HttpClient,
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

  afterEach(() => {
    TestBed.resetTestingModule();
  });

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
    expect(component.isUpdating).toBe(false);
    expect(spy.calls.any()).toEqual(true);
    discardPeriodicTasks();

  }));
});
