import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepMonthlyReportBaseComponent } from './prep-monthly-base.component';

describe('PrepMonthlyReportBaseComponent', () => {
  let component: PrepMonthlyReportBaseComponent;
  let fixture: ComponentFixture<PrepMonthlyReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrepMonthlyReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepMonthlyReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
