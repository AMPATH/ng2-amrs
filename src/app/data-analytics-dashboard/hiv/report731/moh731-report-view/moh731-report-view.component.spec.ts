import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Moh731ReportViewComponent } from './moh731-report-view.component';

describe('Moh731ReportViewComponent', () => {
  let component: Moh731ReportViewComponent;
  let fixture: ComponentFixture<Moh731ReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Moh731ReportViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Moh731ReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
