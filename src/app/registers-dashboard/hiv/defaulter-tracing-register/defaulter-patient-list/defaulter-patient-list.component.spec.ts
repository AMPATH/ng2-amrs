import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaulterPatientListComponent } from './defaulter-patient-list.component';

describe('DefaulterPatientListComponent', () => {
  let component: DefaulterPatientListComponent;
  let fixture: ComponentFixture<DefaulterPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaulterPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaulterPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
