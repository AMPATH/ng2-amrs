import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSurveillanceBaseComponent } from './case-surveillance-base.component';

describe('CaseSurveillanceBaseComponent', () => {
  let component: CaseSurveillanceBaseComponent;
  let fixture: ComponentFixture<CaseSurveillanceBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseSurveillanceBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSurveillanceBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
