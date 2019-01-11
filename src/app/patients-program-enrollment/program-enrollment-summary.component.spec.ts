import { TestBed, async , ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProgramEnrollmentSummaryComponent } from './program-enrollment-summary.component';
import { AgGridModule } from 'ag-grid-angular';
class MockRouter {
    public navigate = jasmine.createSpy('navigate');
}

describe('Component: Program Enrollment Summary', () => {
  let fixture: ComponentFixture<ProgramEnrollmentSummaryComponent>;
  let router: Router;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        AgGridModule.withComponents([])
      ],
      declarations: [
        ProgramEnrollmentSummaryComponent
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProgramEnrollmentSummaryComponent);
        comp = fixture.componentInstance;
        router = fixture.debugElement.injector.get(Router);

      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
      expect(comp).toBeDefined();
  });
});
