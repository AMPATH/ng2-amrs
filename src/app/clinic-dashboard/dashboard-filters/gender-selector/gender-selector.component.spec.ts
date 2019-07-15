import { TestBed, ComponentFixture } from '@angular/core/testing';

import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

import { GenderSelectComponent } from './gender-selector.component';
import { NgamrsSharedModule } from 'src/app/shared/ngamrs-shared.module';


describe('Gender-selector component Tests', () => {
    let comp: GenderSelectComponent;
    let fixture: ComponentFixture<GenderSelectComponent>;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [DateTimePickerModule,
                NgxMyDatePickerModule.forRoot(),
                NgamrsSharedModule
            ],
            declarations: [GenderSelectComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(GenderSelectComponent);
        comp = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(comp).toBeDefined();
    });

    it('should have required properties', () => {
        expect(comp.selectedGender.length).toBe(0);
        expect(comp.genderOptions).toBeUndefined();
    });

    it('should have onGenderSelected defined and callable', () => {
        expect(comp.onGenderSelected).toBeDefined();

        const gender = ['male', 'female'];
        comp.onGenderSelected(gender);
        fixture.detectChanges();
        expect(comp.selectedGender).toBe(gender);
    });

});
