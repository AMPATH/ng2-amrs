import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DialogModule } from 'primeng/primeng';
import { BehaviorSubject, of } from 'rxjs';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { PatientService } from '../../services/patient.service';
import { EditAddressComponent } from './edit-address.component';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { Patient } from '../../../models/patient.model';

const testLocations = [
  {
    name: 'Test A',
    uuid: 'uuid1'
  },
  {
    name: 'Test B',
    uuid: 'uuid2'
  }
];

const testAdministrativeUnitsData = {
  counties: [
    {
      name: 'Foo',
      subcounties: [
        {
          name: 'Bar',
          wards: ['Baz', 'Quux']
        }
      ]
    }
  ]
};

const testPatient = new Patient({
  display: '0123456789-0 - Yet Another Test Patient',
  person: {
    preferredAddress: {
      address1: 'Foo',
      address2: 'Bar',
      address7: 'Baz',
      country: 'Fakekistan',
      uuid: 'test-uuid'
    },
    uuid: 'test-person-uuid'
  }
});

const testPersonAddressPayload = {
  addresses: [
    {
      address1: 'Foo',
      address2: 'Bar',
      address3: 'Fazenda',
      address7: 'Quux',
      cityVillage: 'Cidade',
      latitude: undefined,
      longitude: undefined,
      uuid: 'test-uuid'
    }
  ]
};

const testResponse = {};

const locationResourceServiceStub = {
  getLocations: () => of(testLocations),
  getAdministrativeUnits: () => of(testAdministrativeUnitsData)
};

const personResourceServiceStub = {
  saveUpdatePerson: (personUuid, personAddressPayload) => {
    return of(testResponse);
  }
};

class PatientServiceStub {
  public patient: Patient;
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(
    null
  );

  reloadCurrentPatient() {}

  constructor(patient) {
    this.currentlyLoadedPatient.next(patient);
  }
}

describe('Component: EditAddressComponent Unit Tests', () => {
  let component: EditAddressComponent;
  let fixture: ComponentFixture<EditAddressComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;
  let dialogHeader: HTMLElement;
  let saveBtn: HTMLButtonElement;
  let personResourceService: PersonResourceService;
  let saveUpdatePersonSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DialogModule,
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [EditAddressComponent],
      providers: [
        AppSettingsService,
        EncounterResourceService,
        FakeAppFeatureAnalytics,
        LocalStorageService,
        PatientResourceService,
        PatientProgramService,
        ProgramService,
        ProgramResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        RoutesProviderService,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: LocationResourceService,
          useValue: locationResourceServiceStub
        },
        {
          provide: PatientService,
          useFactory: () => new PatientServiceStub(testPatient)
        },
        {
          provide: PersonResourceService,
          useValue: personResourceServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditAddressComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    personResourceService = TestBed.get(PersonResourceService);

    component.showDialog();
    fixture.detectChanges();
    saveBtn = nativeElement.querySelector('button#saveBtn');
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', () => {
    const countyLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#address1'
    );
    const subcountyLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#address2'
    );
    const wardLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#address7'
    );
    const estateLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#address3'
    );
    const cityLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#cityVillage'
    );
    const cancelBtn: HTMLButtonElement = nativeElement.querySelector(
      'button#cancelBtn'
    );

    expect(component).toBeDefined();
    expect(component.display).toEqual(true);
    expect(component.counties).toEqual(testAdministrativeUnitsData.counties);
    expect(component.subcounties).toContain(
      jasmine.objectContaining({ name: 'Bar' })
    );
    expect(component.wards).toContain('Baz');
    expect(component.wards).toContain('Quux');
    expect(component.patient).toBeDefined();

    dialogHeader = nativeElement.querySelector('.ui-dialog-title');

    expect(dialogHeader.textContent).toContain('Edit Address');
    expect(countyLabel.textContent).toEqual('County');
    expect(subcountyLabel.textContent).toEqual('Sub-county');
    expect(wardLabel.textContent).toEqual('Ward');
    expect(estateLabel.textContent).toMatch(/Estate\/Nearest Center/);
    expect(cityLabel.textContent).toEqual('City');
    expect(cancelBtn.textContent).toEqual('Cancel');
    expect(saveBtn.textContent).toEqual('Save');
  });

  it('should submit the form when the save button is clicked after filling the form', async(() => {
    saveUpdatePersonSpy = spyOn(
      personResourceService,
      'saveUpdatePerson'
    ).and.callThrough();

    // Set new values for ward, estate and city/village
    const wardSelect: HTMLSelectElement = nativeElement.querySelector(
      'select#address7'
    );
    const estateInput: HTMLInputElement = nativeElement.querySelector(
      'input#address3'
    );
    const cityInput: HTMLInputElement = nativeElement.querySelector(
      'input#cityVillage'
    );

    expect(component.address1).toEqual('Foo', 'county');
    expect(component.address2).toEqual('Bar', 'subcounty');
    expect(component.address7).toEqual(
      'Baz',
      'Initial value for ward (to be changed below)'
    );
    expect(component.address3).not.toBeDefined(
      'Initial value for estate (undefined)'
    );
    expect(component.cityVillage).not.toBeDefined(
      'Initial value for city/village (undefined)'
    );

    fixture
      .whenStable()
      .then(() => {
        expect(estateInput.value).toEqual('');
        expect(cityInput.value).toEqual('');

        wardSelect.value = wardSelect.options[1].value;
        estateInput.value = 'Fazenda';
        cityInput.value = 'Cidade';

        wardSelect.dispatchEvent(new Event('change'));
        estateInput.dispatchEvent(new Event('input'));
        cityInput.dispatchEvent(new Event('input'));

        click(saveBtn);

        fixture.detectChanges();
        return fixture.whenStable();
      })
      .then(() => {
        expect(component.address3).toEqual('Fazenda', 'estate');
        expect(component.cityVillage).toEqual('Cidade', 'city or village');
        expect(component.address7).toEqual('Quux', 'new value for ward');
        expect(saveUpdatePersonSpy).toHaveBeenCalledTimes(1);
        expect(saveUpdatePersonSpy).toHaveBeenCalledWith(
          'test-person-uuid',
          testPersonAddressPayload
        );

        const successMsg: HTMLDivElement = nativeElement.querySelector(
          'div#successMsg'
        );
        expect(successMsg.innerText).toContain(
          'Done! Address saved successfully'
        );
      });
  }));

  it('should hide the dialog when the close button is pressed', () => {
    let closeBtn: HTMLElement = nativeElement.querySelector(
      '.ui-dialog-titlebar-close'
    );
    expect(closeBtn).toBeDefined();
    expect(dialogHeader).toBeDefined();
    click(closeBtn);

    fixture.detectChanges();
    closeBtn = nativeElement.querySelector('.ui-dialog-titlebar-close');
  });
});

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
