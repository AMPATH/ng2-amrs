import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSearchInputComponent } from './group-search-input.component';

describe('GroupSearchInputComponent', () => {
  let component: GroupSearchInputComponent;
  let fixture: ComponentFixture<GroupSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
