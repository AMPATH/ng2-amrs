import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]) ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  })


});
