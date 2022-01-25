import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrderListComponent } from './drug-order-list.component';

describe('DrugOrderListComponent', () => {
  let component: DrugOrderListComponent;
  let fixture: ComponentFixture<DrugOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugOrderListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
