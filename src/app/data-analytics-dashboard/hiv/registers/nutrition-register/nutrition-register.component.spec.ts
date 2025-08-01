import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionRegisterComponent } from './nutrition-register.component';

describe('NutritionRegisterComponent', () => {
  let component: NutritionRegisterComponent;
  let fixture: ComponentFixture<NutritionRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
