import { TestBed, async, inject } from '@angular/core/testing';
import { LabOrdersComponent } from './lab-orders.component';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../../services/patient.service';
import * as _ from 'lodash';
describe('FeedBackService', () => {
    let component: LabOrdersComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientService,
                LabOrdersComponent,
                {
                    provide: AppFeatureAnalytics, useFactory: () => {
                        return new FakeAppFeatureAnalytics();
                    }, deps: []
                }
            ]
        });
        component = TestBed.get(LabOrdersComponent);

    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defied', () => {
        expect(component).toBeDefined();
    });
});
