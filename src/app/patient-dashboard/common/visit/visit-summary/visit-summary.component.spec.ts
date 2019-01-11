/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitSummaryComponent } from './visit-summary.component';

describe('VisitSummaryComponent', () => {
  let component: VisitSummaryComponent;
  let fixture: ComponentFixture<VisitSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisitSummaryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have required properties', () => {

    expect(component.setVisitSummary).toBeDefined();
    expect(component.viewVisitDetails).toBeDefined();
    expect(component.visitSummaryDetails).toBeUndefined();
    expect(component.visitSummarySelected).toBeDefined();

  });
});
