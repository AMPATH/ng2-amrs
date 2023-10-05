import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MultiSelectModule } from 'primeng/primeng';
import { PrepMonthlyReportViewComponent } from './prep-monthly-report-view.component';

describe('ReportViewCompoent', () => {
  let component: PrepMonthlyReportViewComponent;
  let fixture: ComponentFixture<PrepMonthlyReportViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientTestingModule],
      imports: [DomSanitizer, MultiSelectModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PrepMonthlyReportViewComponent);
        component = fixture.componentInstance;
      });
  });

  it('should be created', () => {
    pending();
  });
});
