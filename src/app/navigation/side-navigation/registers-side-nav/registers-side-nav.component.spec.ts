import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersSideNavComponent } from './registers-side-nav.component';

describe('RegistersSideNavComponent', () => {
  let component: RegistersSideNavComponent;
  let fixture: ComponentFixture<RegistersSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistersSideNavComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
