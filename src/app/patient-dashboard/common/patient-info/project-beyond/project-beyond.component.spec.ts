import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBeyondComponent } from './project-beyond.component';

describe('ProjectBeyondComponent', () => {
  let component: ProjectBeyondComponent;
  let fixture: ComponentFixture<ProjectBeyondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectBeyondComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBeyondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
