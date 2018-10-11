
import {throwError as observableThrowError,  Observable, of } from 'rxjs';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FeedBackService } from './feedback.service';
import { FeedBackComponent } from './feedback.component';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import { UserService } from '../openmrs-api/user.service';
import { UserDefaultPropertiesService }
    from '../user-default-properties/user-default-properties.service';

import { FormsModule } from '@angular/forms';
import { DepartmentProgramsConfigService
} from '../etl-api/department-programs-config.service';
class DataStub {

    public postFeedback(payload): Observable<any> {
        return of({ status: 'okay' });
    }

}
class UserServiceStub {
    person = {
        display: 'test persion'
    };
    getLoggedInUser() {
        return {
            person: this.person
        };
    }
}
class UserDefaultPropertiesServiceStub {
    getCurrentUserDefaultLocationObject() {
        return {
            display: 'Location test'
        };
    }
}

class FakeDepartmentProgramsConfigService {

  getDartmentProgramsConfig(): Observable<any> {
    return of({ status: 'okay' });
  }

}

describe('FeedBackComponent', () => {
    let fixture: ComponentFixture<FeedBackComponent>;
    let comp: FeedBackComponent;
    let dataStub: FeedBackService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, NgBusyModule],
            declarations: [FeedBackComponent]
        }).overrideComponent(FeedBackComponent, {
            set: {
                providers: [

                    {
                        provide: UserDefaultPropertiesService,
                        useClass: UserDefaultPropertiesServiceStub
                    },
                    {
                      provide: DepartmentProgramsConfigService,
                      useClass: FakeDepartmentProgramsConfigService
                    },
                      { provide: FeedBackService, useClass: DataStub },
                    { provide: UserService, useClass: UserServiceStub },
                    {
                        provide: Http, useFactory: (backend, options) => {
                            return new Http(backend, options);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    MockBackend,
                    BaseRequestOptions
                ]
            }
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(FeedBackComponent);
                comp = fixture.componentInstance;
                dataStub = fixture.debugElement.injector.get(FeedBackService);
            });
    }));

    afterAll(() => {
        TestBed.resetTestingModule();
    });

    it('should  render properly', () => {
        fixture.componentInstance.ngOnInit();
        fixture.detectChanges();
        expect(fixture.nativeElement
            .querySelectorAll('button').length).toBe(2);
        expect(fixture.nativeElement
            .querySelectorAll('input').length).toBe(1);
        expect(fixture.nativeElement
            .querySelectorAll('textarea').length).toBe(1);
    });

    it('should hit the success callback when postFeedback returns success', fakeAsync(() => {
        const spy = spyOn(dataStub, 'postFeedback').and.returnValue(
            of({ status: 'okay' })
        );
        comp.sendFeedBack();
        tick(50);
        fixture.detectChanges();
        expect(comp.success).toEqual(true);
        expect(spy.calls.any()).toEqual(true);
    }));

    it('should hit the error callback when postFeedback returns an error', fakeAsync(() => {
        const spy = spyOn(dataStub, 'postFeedback').and.returnValue(
            observableThrowError({ error: '' })
        );
        comp.sendFeedBack();
        tick(50);
        fixture.detectChanges();
        expect(comp.error).toEqual(true);
        expect(spy.calls.any()).toEqual(true);
    }));


    it('should call back when goBack is called', () => {
        spyOn(window.history, 'back');
        comp.goBack();
        expect(window.history.back).toHaveBeenCalled();
    });
    it('should update status when dismiss functions are called', () => {
        comp.success = true;
        comp.error = true;
        comp.dismissError();
        comp.dismissSuccess();
        expect(comp.success).toBeFalsy();
        expect(comp.error).toBeFalsy();
    });
});
