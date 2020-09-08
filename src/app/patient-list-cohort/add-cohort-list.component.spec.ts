import { TestBed, inject, async } from '@angular/core/testing';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { AddCohortListComponent } from './add-cohort-list.component';
import { CohortListService } from './cohort-list.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from './../utils/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Component: AddCohortList Unit Tests', () => {
  let cohortResourceService: CohortResourceService, component;
  let cohortListService: CohortListService;
  let appSettingsService: AppSettingsService;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CohortResourceService,
        CohortListService,
        AppSettingsService,
        LocalStorageService
      ]
    });

    cohortResourceService = TestBed.get(CohortResourceService);
    cohortListService = TestBed.get(CohortListService);
    appSettingsService = TestBed.get(AppSettingsService);
    localStorageService = TestBed.get(LocalStorageService);
    component = new AddCohortListComponent(
      cohortResourceService,
      null,
      cohortListService
    );
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
    expect(component.errors.length).toBe(0);

    done();
  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'addCohortList').and.callFake((err, data) => {});
    component.addCohortList((err, data) => {});
    expect(component.addCohortList).toHaveBeenCalled();
    spyOn(component, 'displaySuccessAlert').and.callFake((err, data) => {});

    component.displaySuccessAlert((err, data) => {});
    expect(component.displaySuccessAlert).toHaveBeenCalled();

    spyOn(component, 'displayErrorAlert').and.callFake((err, data) => {});
    component.displayErrorAlert((err, data) => {});
    expect(component.displayErrorAlert).toHaveBeenCalled();
    done();
  });
});
