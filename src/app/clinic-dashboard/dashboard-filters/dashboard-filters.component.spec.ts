import { TestBed } from '@angular/core/testing';
import { Component, Input }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';

import { DateTimePickerModule } from 'ng2-openmrs-formentry/src/app/components/date-time-picker';
import { SelectModule } from 'ng2-openmrs-formentry/src/app/components/select';


import { DashboardFiltersComponent } from './dashboard-filters.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { GenderSelectComponent } from './gender-selector/gender-selector.component';
import { IndicatorSelectComponent } from './indicator-selector/indicator-selector.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import {
  VisualizationComponent
} from '../clinical-summary-visualization/visualization-component';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../etl-api/clinical-summary-visualization-resource.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { Http } from '@angular/http';
import { ClinicalSummaryVisualizationService
} from '../services/clinical-summary-visualization.service';

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
        SelectModule
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
          useFactory: (http, appSettingsService, cacheService) =>
            new FakeClinicalSummaryVisualizationResourceService(null, null, null),
          deps: [Http, AppSettingsService, DataCacheService]
        }],
      declarations: [
        DashboardFiltersComponent,
        DateRangeComponent,
        GenderSelectComponent,
        VisualizationComponent,
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

  it('should have a defined component', () => {
    expect(parentComponent).toBeDefined();
  });

  it('should update parent model when date changes', (done) => {
    let fixture = TestBed.createComponent(DateRangeComponent);
    let component = fixture.componentInstance;
    expect(component.startDate).toBeUndefined();
    expect(component.endDate).toBeUndefined();
    component.updateStartDate(moment([2016, 2, 22]).format());
    component.updateEndDate(moment([2017, 2, 22]).format());
    component.onDateChange.subscribe((v) => {
      parentComponent.filterModel = {};
      setTimeout(() => {
        expect(moment(v.startDate).format('DD/MM/YYYY')).toBe('22/03/2016');
        expect(moment(v.endDate).format('DD/MM/YYYY')).toBe('22/03/2017');
        parentComponent.onDateChanged(v);
      }, 100);
    });
    parentComponent.options = {
      indicator_select: false,
      date_range: true,
      range_slider: false,
      gender_select: false
    };
    fixture.detectChanges();
    parentComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(moment(parentComponent.filterModel.startDate)
          .format('DD/MM/YYYY')).toBe('22/03/2016');
        expect(moment(parentComponent.filterModel.endDate)
          .format('DD/MM/YYYY')).toBe('22/03/2017');
        parentComponent.onDateChanged(vv);
      }, 100);
    });
    parentFixture.detectChanges();
    done();
  });

  it('should update parent model when gender changes', (done) => {
    let fixture = TestBed.createComponent(GenderSelectComponent);
    let component = fixture.componentInstance;
    expect(component.selectedGender.length).toEqual(0);
    component.onGenderSelected(['F']);
    component.onGenderChange.subscribe((gender) => {
      parentComponent.filterModel = {};
      setTimeout(() => {
        expect(component.selectedGender.length).toEqual(1);
        expect(component.selectedGender[0]).toEqual('F');
        parentComponent.onGenderChanged(gender);
      }, 100);
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
        expect(parentComponent.filterModel.gender).toBeDefined();
        expect(parentComponent.filterModel.gender[0]).toEqual('F');
      }, 100);
    });
    parentFixture.detectChanges();
    done();
  });

  it('should update parent model when indicators change', (done) => {
    let fixture = TestBed.createComponent(IndicatorSelectComponent);
    let component = fixture.componentInstance;
    expect(component.selectedIndicators.length).toEqual(0);
    component.onIndicatorSelected(['indicator']);
    component.onIndicatorChange.subscribe((indicators) => {
      parentComponent.filterModel = {};
      setTimeout(() => {
        expect(component.selectedIndicators.length).toEqual(1);
        expect(component.selectedIndicators[0]).toEqual('indicator');
        parentComponent.onIndicatorChanged(indicators);
      }, 100);
    });
    parentComponent.options = {
      indicator_select: true,
      date_range: false,
      range_slider: false,
      gender_select: false
    };
    parentComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(parentComponent.filterModel.indicators).toBeDefined();
        expect(parentComponent.filterModel.indicators[0]).toEqual('indicator');
      }, 100);
    });
    parentFixture.detectChanges();
    done();
  });

  it('should update parent model when age range changes', (done) => {
    let fixture = TestBed.createComponent(RangeSliderComponent);
    let component = fixture.componentInstance;
    expect(component.start).toBeUndefined();
    expect(component.end).toBeUndefined();
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
    parentComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(parentComponent.filterModel.ageFrom).toBeDefined();
        expect(parentComponent.filterModel.ageTo).toBeDefined();
        expect(parentComponent.filterModel.ageFrom).toEqual(11);
        expect(parentComponent.filterModel.ageTo).toEqual(13);
      }, 100);
    });
    parentFixture.detectChanges();
    fixture.detectChanges();
    done();
  });

});
