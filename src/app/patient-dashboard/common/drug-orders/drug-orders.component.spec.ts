import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrdersComponent } from './drug-orders.component';

describe('DrugOrdersComponent', () => {
  let component: DrugOrdersComponent;
  let fixture: ComponentFixture<DrugOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugOrdersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
