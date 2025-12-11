import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSurveillancePatientListComponent } from './case-surveillance-patient-list.component';

describe('CaseSurveillancePatientListComponent', () => {
  let component: CaseSurveillancePatientListComponent;
  let fixture: ComponentFixture<CaseSurveillancePatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseSurveillancePatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSurveillancePatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
