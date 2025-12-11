import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Moh731RegisterComponent } from './moh731-register.component';

describe('Moh731RegisterComponent', () => {
  let component: Moh731RegisterComponent;
  let fixture: ComponentFixture<Moh731RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Moh731RegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Moh731RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
