import { TestBed, ComponentFixture } from '@angular/core/testing';

import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

import { DateRangeComponent } from './date-range.component';


describe('Date-range component Tests', () => {
    let comp: DateRangeComponent;
    let fixture: ComponentFixture<DateRangeComponent>;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [DateTimePickerModule,
                NgxMyDatePickerModule.forRoot(),
            ],
            declarations: [DateRangeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DateRangeComponent);
        comp = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(comp).toBeDefined();
    });

    it('should have required properties', () => {
        expect(comp.startDate).toBeUndefined();
        expect(comp.endDate).toBeUndefined();
    });

    it('should have update start and end date methods', () => {
        expect(comp.updateStartDate).toBeDefined();
        expect(comp.updateEndDate).toBeDefined();
    });

});
