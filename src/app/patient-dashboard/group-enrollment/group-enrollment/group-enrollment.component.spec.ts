import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEnrollmentComponent } from './group-enrollment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgamrsSharedModule } from 'src/app/shared/ngamrs-shared.module';

describe('GroupEnrollmentComponent', () => {
  let component: GroupEnrollmentComponent;
  let fixture: ComponentFixture<GroupEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClientTestingModule,
        NgamrsSharedModule
      ],
      declarations: [GroupEnrollmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
