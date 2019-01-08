import { DailyScheduleClinicFlowComponent } from './daily-schedule-clinic-flow.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { CalendarModule } from 'angular-calendar';

import {
    ClinicFlowCacheService
} from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

describe('Daily-schedule-clinic-flow Tests', () => {
    let comp: DailyScheduleClinicFlowComponent;
    let fixture: ComponentFixture<DailyScheduleClinicFlowComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                DateTimePickerModule,
                NgxMyDatePickerModule.forRoot(),
                CalendarModule.forRoot(),

            ],
            declarations: [DailyScheduleClinicFlowComponent],
            providers: [
                ClinicFlowCacheService,
                ClinicDashboardCacheService,
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(DailyScheduleClinicFlowComponent);
                comp = fixture.componentInstance;
            });
    }));

    xit('should be defined', () => {
        expect(comp).toBeDefined();
    });

});
