import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { RangeSliderComponent } from './range-slider.component';

describe('Date-range component Tests', () => {
    let comp: RangeSliderComponent;
    let fixture: ComponentFixture<RangeSliderComponent>;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [DateTimePickerModule,
                NgxMyDatePickerModule.forRoot(),
            ],
            declarations: [RangeSliderComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(RangeSliderComponent);
        comp = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(comp).toBeDefined();
    });

    it('should have required properties', () => {
        expect(comp.start).toBeUndefined();
        expect(comp.end).toBeUndefined();
    });

});
