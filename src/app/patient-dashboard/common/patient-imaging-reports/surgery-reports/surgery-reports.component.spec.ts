import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeryReportsComponent } from './surgery-reports.component';

describe('SurgeryReportsComponent', () => {
  let component: SurgeryReportsComponent;
  let fixture: ComponentFixture<SurgeryReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeryReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
