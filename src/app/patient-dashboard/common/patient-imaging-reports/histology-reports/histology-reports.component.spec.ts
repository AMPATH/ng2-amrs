import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistologyReportsComponent } from './histology-reports.component';

describe('HistologyReportsComponent', () => {
  let component: HistologyReportsComponent;
  let fixture: ComponentFixture<HistologyReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistologyReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistologyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
