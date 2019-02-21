/* tslint:disable:no-unused-variable */
// tslint:disable:directive-selector
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Directive, DebugElement } from '@angular/core';
import { PatientIdentifierComponent } from './patient-identifier.component';

@Directive({
  selector: `ng-content`
})

export class FakeNgContentDirective {
}

@Directive({
  selector: `edit-identifiers`
})

export class FakeEditIdentifierDirective {
}

describe('Component: PatientIdentifier', () => {
  let component: PatientIdentifierComponent;
  let fixture: ComponentFixture<PatientIdentifierComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientIdentifierComponent, FakeNgContentDirective,
        FakeEditIdentifierDirective],
    });

    fixture = TestBed.createComponent(PatientIdentifierComponent);

    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;

  });

  const identifiers = [
    {
      identifier: '16061-02511',
      identifierType: {
        name: 'CCC NUMBER',
        uuid: 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e'
      },
      location: {
        'name': 'Location Test'
      },
      uuid: '5bc55bb4-93e3-11e2-8aca-0026b9348838'
    },
    {
      identifier: '16061-02511',
      identifierType: {
        name: 'CCC NUMBER',
        uuid: 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e'
      },
      location: {
        'name': 'Location Test'
      },
      uuid: '5bc55bb4-93e3-11e2-8aca-0026b9348838'
    },
    {
      identifier: '16061-02511',
      identifierType: {
        name: 'CCC NUMBER',
        uuid: 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e'
      },
      location: {
        'name': 'Location Test'
      },
      uuid: '5bc55bb4-93e3-11e2-8aca-0026b9348838'
    }
  ];

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('on component initialization the identifiers should be undefined', () => {
    expect(component.identifiers).toBeDefined();
  });

  it('should take an array as its input', () => {
    component.identifiers = identifiers;
    expect(component.identifiers).toBeTruthy();
  });

  it('should render list of patient identifiers', () => {
    component.identifiers = identifiers;
    fixture.detectChanges();
    expect(el.querySelectorAll('tr').length).toBeGreaterThan(0);
  });

});
