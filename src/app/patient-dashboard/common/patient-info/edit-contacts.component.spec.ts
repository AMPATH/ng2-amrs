import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { EditContactsComponent } from './edit-contacts.component';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { PatientService } from '../../services/patient.service';
import { PatientRelationshipTypeService } from '../patient-relationships/patient-relation-type.service';

describe('Component: EditContacts Unit Tests', () => {

  let personResourceService: PersonResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, patientService: PatientService,
    relationshipTypes: PatientRelationshipTypeService,
    component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FakeAppFeatureAnalytics,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: PersonResourceService,
        },
        {
          provide: PatientService
        },
        {
          provide: PatientRelationshipTypeService
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    patientService = TestBed.get(PatientService);
    personResourceService = TestBed.get(PersonResourceService);
    relationshipTypes = TestBed.get(PatientRelationshipTypeService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = new EditContactsComponent(patientService, personResourceService, relationshipTypes);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
  const personAttributePayload = {
    attributes: [{
      value: '2222',
      attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
    }, {
      value: 'alternativePhoneNumber',
      attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
    }, {
      value: 'nextofkinPhoneNumber',
      attributeType: 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d'
    }, {
      value: 'patnerPhoneNumber',
      attributeType: 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46'
    }]
  };

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });
  it('should have required properties', (done) => {
    expect(component.display).toBe(false);
    expect(component.alternativePhoneNumber).toBeUndefined();
    expect(component.patientPhoneNumber).toBeUndefined();
    expect(component.patnerPhoneNumber).toBeUndefined();
    expect(component.nextofkinPhoneNumber).toBeUndefined();

    done();

  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'getPatient').and.callFake((err, data) => {
    });
    component.getPatient((err, data) => {
    });
    expect(component.getPatient).toHaveBeenCalled();
    spyOn(component, 'getPersonAttributeByAttributeTypeUuid').and.callFake((err, data) => {
    });
    component.getPersonAttributeByAttributeTypeUuid((err, data) => {
    });
    expect(component.getPersonAttributeByAttributeTypeUuid).toHaveBeenCalled();
    spyOn(component, 'filterUndefinedUuidFromPayLoad').and.callFake((err, data) => {

    });
    component.filterUndefinedUuidFromPayLoad((err, data) => {
    });
    expect(component.filterUndefinedUuidFromPayLoad).toHaveBeenCalled();


    done();

  });
  it('should generate the correct payload when value is not edited', (done) => {
    const personAttributPayload = {
      attributes: [{
        value: '2222',
        attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
      }, {
        value: 'alternativePhoneNumber',
        attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
      }]
    };

    const originalAttributes = [{
      value: '2222',
      attributeType: { uuid: '72a759a8-1359-11df-a1f1-0026b9348838' },
    }, {
      value: 'alternativePhoneNumber',
      attributeType: { uuid: 'type-uuid-2' },
    }];
    const results = component.generatePersonAttributePayload(personAttributPayload,
      originalAttributes);
    expect(results).toBeTruthy();
    expect(results[0].value).toEqual('2222');
    expect(results[0].attributeType).toEqual('72a759a8-1359-11df-a1f1-0026b9348838');
    done();
  });
  it('should generate the correct payload when value is voided', (done) => {
    const personAttributPayloads = {
      attributes: [{
        value: '',
        uuid: 'person-atttribute-uuid-1',
        voided: true
      }, {
        value: 'alternativePhoneNumber',
        attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
      }]
    };

    const originalAttributes = [{
      value: '2222',
      attributeType: { uuid: '72a759a8-1359-11df-a1f1-0026b9348838' },
      uuid: 'person-atttribute-uuid-1'
    }, {
      value: 'alternativePhoneNumber',
      attributeType: { uuid: 'type-uuid-2' },
      uuid: 'person-atttribute-uuid-2'
    }];
    const results = component.generatePersonAttributePayload(personAttributPayloads,
      originalAttributes);
    expect(results).toBeTruthy();
    expect(results[0].voided).toEqual(true);
    expect(results[0].attributeType).toBeUndefined();
    done();
  });
  it('should generate the correct payload when value existed and it is edited', (done) => {
    const personAttributesPayload = {
      attributes: [{
        value: '11111',
        attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
      }, {
        value: 'alternativePhoneNumber',
        attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
      }]
    };

    const originalAttributes = [{
      value: '2222',
      attributeType: { uuid: '72a759a8-1359-11df-a1f1-0026b9348838' },
      uuid: 'person-atttribute-uuid-1'
    }, {
      value: 'alternativePhoneNumber',
      attributeType: { uuid: 'type-uuid-2' },
      uuid: 'person-atttribute-uuid-2'
    }];
    const results = component.generatePersonAttributePayload(personAttributesPayload,
      originalAttributes);
    expect(results).toBeTruthy();
    expect(results[0].value).toEqual('11111');
    expect(results[0].attributeType).toEqual('72a759a8-1359-11df-a1f1-0026b9348838');
    // case value is e
    done();
  });
  it('should generate the correct payload when new value is created ', (done) => {
    const personAttributPayload = {
      attributes: [{
        value: '11111',
        attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
      }, {
        value: 'alternativePhoneNumber',
        attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
      }]
    };

    const originalAttributes = [{
      value: '',
      attributeType: '',
    }, {
      value: 'alternativePhoneNumber',
      attributeType: { uuid: 'type-uuid-2' },
      uuid: 'person-atttribute-uuid-2'
    }];
    const results = component.generatePersonAttributePayload(personAttributPayload,
      originalAttributes);
    expect(results).toBeTruthy();
    expect(results[0].value).toEqual('11111');
    expect(results[0].attributeType).toEqual('72a759a8-1359-11df-a1f1-0026b9348838');
    done();
  });

});

