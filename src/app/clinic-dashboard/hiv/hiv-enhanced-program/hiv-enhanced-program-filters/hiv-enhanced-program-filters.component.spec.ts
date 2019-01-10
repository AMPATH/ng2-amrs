import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular/main';
import { HivEnhancedFiltersComponent } from './hiv-enhanced-program-filters.component';
import { FormsModule } from '@angular/forms';

describe('Hiv-enhanced-program-filters component Tests', () => {
    let comp: HivEnhancedFiltersComponent;
    let fixture: ComponentFixture<HivEnhancedFiltersComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [FormsModule, AgGridModule],
            declarations: [HivEnhancedFiltersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HivEnhancedFiltersComponent);
        comp = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(comp).toBeDefined();
    });

    it('should have required properties', () => {
        expect(comp.filterCollapsed).toBeUndefined();
        expect(comp.parentIsBusy).toBe(false);
        expect(comp.filterCollapsed).toBeUndefined();
        expect(comp.onClickedGenerate).toBeDefined();
    });

    it('should have all the required functions defined and callable', (done) => {
        spyOn(comp, 'ngOnInit').and.callThrough();
        comp.ngOnInit();
        expect(comp.ngOnInit).toHaveBeenCalled();

        spyOn(comp, 'onClickedGenerate').and.callThrough();
        comp.onClickedGenerate();
        expect(comp.onClickedGenerate).toHaveBeenCalled();
        done();
    });
});
