

import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { AddCohortListComponent } from './add-cohort-list.component';

describe('Component: AddCohortList Unit Tests', () => {

  let cohortResourceService: CohortResourceService, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: CohortResourceService,
        }
      ]
    });

    cohortResourceService = TestBed.get(CohortResourceService);
    component = new AddCohortListComponent(cohortResourceService , null);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });
  it('should have required properties', (done) => {
    expect(component.showSuccessAlert).toBe(false);
    expect(component.showErrorAlert).toBe(false);
    expect(component.successAlert).toBeUndefined();
    expect(component.errorAlert).toBeUndefined();
   // expect(component.selectedRelationshipType).toBeUndefined();
    expect(component.errors.length).toBe(0);

    done();

  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'addCohortList').and.callFake((err, data) => {
    });
    component.addCohortList((err, data) => {
    });
    expect(component.addCohortList).toHaveBeenCalled();
    spyOn(component, 'displaySuccessAlert').and.callFake((err, data) => {

    });

    component.displaySuccessAlert((err, data) => {
    });
    expect(component.displaySuccessAlert).toHaveBeenCalled();

    spyOn(component, 'displayErrorAlert').and.callFake((err, data) => {

    });
    component.displayErrorAlert((err, data) => {
    });
    expect(component.displayErrorAlert).toHaveBeenCalled();

    done();

    done();

  });
});

