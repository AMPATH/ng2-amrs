import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AncRegisterComponent } from './anc-register.component';

describe('AncRegisterComponent', () => {
  let component: AncRegisterComponent;
  let fixture: ComponentFixture<AncRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AncRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AncRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
