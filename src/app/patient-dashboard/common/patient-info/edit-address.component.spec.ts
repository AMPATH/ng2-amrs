import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../../../test-helpers';

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
    stateProvince: 'Municipio',
    uuid: 'uuid1'
  },
  {
    name: 'Test B',
    stateProvince: 'Condado',
    uuid: 'uuid2'
  }
];

const testPatient = new Patient({
  display: '0123456789-0 - Yet Another Test Patient',
  person: {
    preferredAddress: {
      address1: 'Foo',
      address2: 'Bar',
      cityVillage: 'Quux',
      country: 'Fakekistan',
      uuid: 'test-uuid'
    },
    uuid: 'test-person-uuid'
  }
});

const testPersonAddressPayload = {
  address1: 'Municipio',
  address2: 'Subcampo',
  address3: 'Fazenda',
  cityVillage: 'Cidade',
  latitude: undefined,
  longitude: undefined,
  uuid: 'test-uuid',
  address7: undefined
};

const testResponse = {};

const locationResourceServiceStub = {
  getLocations: () => of(testLocations)
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
      'label#county'
    );
    const subcountyLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#subcounty'
    );
    const estateLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#estate'
    );
    const cityLabel: HTMLLabelElement = nativeElement.querySelector(
      'label#city'
    );
    const cancelBtn: HTMLButtonElement = nativeElement.querySelector(
      'button#cancelBtn'
    );

    expect(component).toBeDefined();
    expect(component.display).toEqual(true);
    expect(component.patient).toBeDefined();

    dialogHeader = nativeElement.querySelector('.ui-dialog-title');

    expect(dialogHeader.textContent).toContain('Edit Address');
    expect(countyLabel.textContent).toEqual('County');
    expect(subcountyLabel.textContent).toEqual('Subcounty');
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

    // Set new values for county, subcounty, estate and city
    const countySelect: HTMLSelectElement = nativeElement.querySelector(
      'select#address1'
    );
    const subcountyInput: HTMLInputElement = nativeElement.querySelector(
      'input#address2'
    );
    const estateInput: HTMLInputElement = nativeElement.querySelector(
      'input#address3'
    );
    const cityInput: HTMLInputElement = nativeElement.querySelector(
      'input#cityVillage'
    );

    expect(component.address1).toEqual('Foo', 'county');
    expect(component.address2).toEqual('Bar', 'subcounty');
    expect(component.address3).not.toBeDefined(
      'Initial value for estate (undefined)'
    );
    expect(component.cityVillage).toEqual(
      'Quux',
      'Initial value for city/village (undefined)'
    );

    fixture
      .whenStable()
      .then(() => {
        countySelect.value = countySelect.options[0].value;
        subcountyInput.value = 'Subcampo';
        estateInput.value = 'Fazenda';
        cityInput.value = 'Cidade';

        countySelect.dispatchEvent(new Event('change'));
        subcountyInput.dispatchEvent(new Event('input'));
        estateInput.dispatchEvent(new Event('input'));
        cityInput.dispatchEvent(new Event('input'));

        click(saveBtn);

        fixture.detectChanges();
        return fixture.whenStable();
      })
      .then(() => {
        expect(component.address1).toEqual('Municipio', 'county');
        expect(component.address2).toEqual('Subcampo', 'subcounty');
        expect(component.address3).toEqual('Fazenda', 'estate');
        expect(component.cityVillage).toEqual('Cidade', 'city or village');
        expect(saveUpdatePersonSpy).toHaveBeenCalledTimes(1);
        expect(saveUpdatePersonSpy).toHaveBeenCalledWith(
          'test-person-uuid',
          jasmine.objectContaining({
            addresses: jasmine.arrayContaining([
              jasmine.objectContaining({ ...testPersonAddressPayload })
            ])
          })
        );

        const successMsg: HTMLDivElement = nativeElement.querySelector(
          'div#successMsg'
        );
        expect(successMsg.innerText).toContain(
          'Done! Address saved successfully'
        );
      });
  }));
});
