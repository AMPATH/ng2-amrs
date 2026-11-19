import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersDashboardComponent } from './registers-dashboard.component';

describe('RegistersDashboardComponent', () => {
  let component: RegistersDashboardComponent;
  let fixture: ComponentFixture<RegistersDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistersDashboardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
