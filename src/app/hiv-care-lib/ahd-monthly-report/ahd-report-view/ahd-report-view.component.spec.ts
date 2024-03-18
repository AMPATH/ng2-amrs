import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhdReportViewComponent } from './ahd-report-view.component';

describe('AhdReportViewComponent', () => {
  let component: AhdReportViewComponent;
  let fixture: ComponentFixture<AhdReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AhdReportViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhdReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
