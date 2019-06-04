import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DailyScheduleClinicFlowComponent } from './daily-schedule-clinic-flow.component';

describe('Daily-schedule clinic flow component Tests', () => {
    let comp: DailyScheduleClinicFlowComponent;
    let fixture: ComponentFixture<DailyScheduleClinicFlowComponent>;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [DateTimePickerModule,
                NgxMyDatePickerModule.forRoot(),
            ],
            declarations: [DailyScheduleClinicFlowComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DailyScheduleClinicFlowComponent);
        comp = fixture.componentInstance;
    });

    /*it('should be defined', () => {
        expect(comp).toBeDefined();
    });*/

});
