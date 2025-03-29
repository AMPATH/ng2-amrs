import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaulterTracingRegisterComponent } from './defaulter-tracing-register.component';

describe('DefaulterTracingRegisterComponent', () => {
  let component: DefaulterTracingRegisterComponent;
  let fixture: ComponentFixture<DefaulterTracingRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaulterTracingRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaulterTracingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
