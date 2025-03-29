import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PncRegisterComponent } from './pnc-register.component';

describe('PncRegisterComponent', () => {
  let component: PncRegisterComponent;
  let fixture: ComponentFixture<PncRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PncRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PncRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
