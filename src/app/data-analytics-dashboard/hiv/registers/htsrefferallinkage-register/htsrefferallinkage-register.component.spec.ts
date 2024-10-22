import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtsrefferallinkageRegisterComponent } from './htsrefferallinkage-register.component';

describe('HtsrefferallinkageRegisterComponent', () => {
  let component: HtsrefferallinkageRegisterComponent;
  let fixture: ComponentFixture<HtsrefferallinkageRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HtsrefferallinkageRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtsrefferallinkageRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
