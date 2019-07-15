import { TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';

import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { NgSelectModule } from '@ng-select/ng-select';

import { DashboardFiltersComponent } from './dashboard-filters.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { GenderSelectComponent } from './gender-selector/gender-selector.component';
import { IndicatorSelectComponent } from './indicator-selector/indicator-selector.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../etl-api/clinical-summary-visualization-resource.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import {
  ClinicalSummaryVisualizationService
} from '../../hiv-care-lib/services/clinical-summary-visualization.service';
// tslint:disable:component-class-suffix

@Component({
  selector: 'hiv-care-overview',
  template: `<p></p>`
})
export class FakeHivCareOverview {
  @Input() options: any;
}

@Component({
  selector: 'art-overview-chart',
  template: `<p></p>`
})
export class FakeArtOverviewChart {
  @Input() options: any;
}

@Component({
  selector: 'patient-status-overview-chart',
  template: `<p></p>`
})
export class FakepatientStatusOverviewChart {
  @Input() options: any;
}

export class FakeClinicDashboardCacheService {

}

export class FakeClinicalSummaryVisualizationService {

}

export class FakeClinicalSummaryVisualizationResourceService {

}

 describe('Component: DashboardFiltersComponent', () => {
  let parentComponent: DashboardFiltersComponent;
  let parentFixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DateTimePickerModule,
        FormsModule,
        CommonModule,
        NgSelectModule
      ],
      providers: [
        {
          provide: ClinicDashboardCacheService,
          useFactory: new FakeClinicDashboardCacheService()
        },
        {
          provide: ClinicalSummaryVisualizationService,
          useFactory: () => new FakeClinicalSummaryVisualizationService()
        },
        {
          provide: ClinicalSummaryVisualizationResourceService,
          useFactory: (appSettingsService, cacheService) =>
            new FakeClinicalSummaryVisualizationResourceService(),
          deps: [AppSettingsService, DataCacheService]
        }],
      declarations: [
        DashboardFiltersComponent,
        DateRangeComponent,
        GenderSelectComponent,
        FakeHivCareOverview,
        FakeArtOverviewChart,
        FakepatientStatusOverviewChart,
        IndicatorSelectComponent,
        RangeSliderComponent
      ]
    });
    parentFixture = TestBed.createComponent(DashboardFiltersComponent);
    parentComponent = parentFixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should have a defined component', () => {
    expect(parentComponent).toBeDefined();
  });

  it('should update parent model when date changes', (done) => {
    const fixture = TestBed.createComponent(DateRangeComponent);
    const component = fixture.componentInstance;
    expect(component.startDate).toBeUndefined();
    expect(component.endDate).toBeUndefined();
    component.updateStartDate(moment([2016, 2, 22]).format());
    component.updateEndDate(moment([2017, 2, 22]).format());
    fixture.detectChanges();
    component.onDateChange.subscribe((v) => {
      parentComponent.filterModel = {};
      setTimeout(() => {
        parentComponent.onDateChanged(v);
      }, 20);
    });
    parentComponent.options = {
      indicator_select: false,
      date_range: true,
      range_slider: false,
      gender_select: false
    };
    parentFixture.detectChanges();
    parentComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(moment(parentComponent.filterModel.startDate)
          .format('DD/MM/YYYY')).toBe('22/03/2016');
        expect(moment(parentComponent.filterModel.endDate)
          .format('DD/MM/YYYY')).toBe('22/03/2017');
        parentComponent.onDateChanged(vv);
      }, 21);
    });
    done();
  });

  it('should update parent model when gender changes', (done) => {
    const fixture = TestBed.createComponent(GenderSelectComponent);
    const component = fixture.componentInstance;
    expect(component.selectedGender.length).toEqual(0);
    component.onGenderSelected(['F']);
    component.onGenderChange.subscribe((gender) => {
      parentComponent.filterModel = {};
      setTimeout(() => {
        expect(component.selectedGender.length).toEqual(1);
        expect(component.selectedGender[0]).toEqual('F');
        parentComponent.onGenderChanged(gender);
      }, 500);
    });
    parentComponent.options = {
      indicator_select: false,
      date_range: false,
      range_slider: false,
      gender_select: true
    };
    fixture.detectChanges();
    parentComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(parentComponent.filterModel.gender[0]).toEqual('F');
      }, 500);
    });
    parentFixture.detectChanges();
    done();
  });

  it('should update parent model when indicators change', (done) => {
    const fixture = TestBed.createComponent(IndicatorSelectComponent);
    const component = fixture.componentInstance;
    expect(component.selectedIndicators.length).toEqual(0);
    component.onIndicatorSelected(['indicator']);
    component.onIndicatorChange.subscribe((indicators) => {
      parentComponent.filterModel = {};
      setTimeout(() => {
        expect(component.selectedIndicators.length).toEqual(1);
        expect(component.selectedIndicators[0]).toEqual('indicator');
        parentComponent.onIndicatorChanged(indicators);
      }, 500);
    });
    parentComponent.options = {
      indicator_select: true,
      date_range: false,
      range_slider: false,
      gender_select: false
    };
    parentComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(parentComponent.filterModel.indicators[0]).toEqual('indicator');
      }, 500);
    });
    parentFixture.detectChanges();
    done();
  });

  xit('should update parent model when age range changes', (done) => {
    const fixture = TestBed.createComponent(RangeSliderComponent);
    const component = fixture.componentInstance;
    component.start = 11;
    component.end = 13;
    component.onAgeChangeFinish.subscribe((age) => {
      parentComponent.filterModel = {};
      setTimeout(() => {
        expect(component.start).toEqual(11);
        expect(component.end).toEqual(13);
        parentComponent.onAgeChangeFinished(age);
      }, 100);
    });
    parentComponent.options = {
      indicator_select: false,
      date_range: false,
      range_slider: true,
      gender_select: false
    };
    fixture.detectChanges();
    parentComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(parentComponent.filterModel.ageFrom).toEqual(11);
        expect(parentComponent.filterModel.ageTo).toEqual(13);
      }, 100);
    });
    parentFixture.detectChanges();
    done();
  });

});
