/*
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash';
import { forms } from './forms';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { FormListService } from './form-list.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';

describe('FormListService', () => {
  let service: FormListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        FormListService,
        FormsResourceService,
        LocalStorageService,
        FormOrderMetaDataService,
        AppSettingsService,
        HttpClientTestingModule
      ],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(FormListService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should sort an array of forms given an unsorted array and sorting metadata', () => {
    const favourite = [
      {
        name: 'form 5'
      },
      {
        name: 'form 3'
      }
    ];

    const defaultOrder = [
      {
        name: 'form 2'
      },
      {
        name: 'form 3'
      }
    ];

    const expectedOrder = [
      {
        name: 'form 5',
        published: false,
        uuid: 'uuid5-unpublished',
        version: '1.0'
      },
      {
        name: 'form 3',
        published: false,
        uuid: 'uuid3',
        version: '1.0'
      },
      {
        name: 'form 2',
        published: true,
        uuid: 'uuid2',
        version: '1.0'
      },
      {
        name: 'form 1',
        published: true,
        uuid: 'uuid',
        version: '1.0'
      },
      {
        name: 'form 4',
        published: true,
        uuid: 'uuid4',
        version: '1.0'
      },
      {
        name: 'form 4',
        published: false,
        uuid: 'uuid4-unpublished',
        version: '2.0'
      }
    ];

    const actualOrder = service.sortFormList(forms, [favourite, defaultOrder]);

    expect(actualOrder.length).toEqual(expectedOrder.length);
    expect(actualOrder).toEqual(expectedOrder);
  });

  it('should filter out unpublished OpenMRS forms from the form list', () => {
    const expectedFilteredList = [
      {
        name: 'form 1',
        published: true,
        uuid: 'uuid',
        version: '1.0'
      },
      {
        name: 'form 2',
        published: true,
        uuid: 'uuid2',
        version: '1.0'
      },
      {
        name: 'form 4',
        published: true,
        uuid: 'uuid4',
        version: '1.0'
      }
    ];

    const actualFilteredList = service.filterPublishedOpenmrsForms(forms);

    expect(actualFilteredList.length).toEqual(3);
    expect(actualFilteredList).toEqual(expectedFilteredList);
  });

  it('should add favourite property to forms list', () => {
    const favourite = [
      {
        name: 'form 5'
      },
      {
        name: 'form 3'
      }
    ];

    const expectedfavouriteForms = [
      {
        name: 'form 1',
        published: true,
        uuid: 'uuid',
        version: '1.0',
        favourite: false
      },
      {
        name: 'form 2',
        published: true,
        uuid: 'uuid2',
        version: '1.0',
        favourite: false
      },
      {
        name: 'form 3',
        published: false,
        uuid: 'uuid3',
        version: '1.0',
        favourite: true
      },
      {
        name: 'form 4',
        published: true,
        uuid: 'uuid4',
        version: '1.0',
        favourite: false
      },
      {
        name: 'form 4',
        published: false,
        uuid: 'uuid4-unpublished',
        version: '2.0',
        favourite: false
      },
      {
        name: 'form 5',
        published: false,
        uuid: 'uuid5-unpublished',
        version: '1.0',
        favourite: true
      }
    ];

    const processFavouriteForms = service.processFavouriteForms(
      forms,
      favourite
    );

    expect(processFavouriteForms).toEqual(expectedfavouriteForms);
  });

  it('should remove version information from a form name', () => {
    // CASE 1: Perfect form name
    const formName = ' some form name v1.00 '; // CASE 2: Imperfect version
    const formName2 = ' some form name v1. '; // CASE 3: No version information
    // the v intentionally put there for a certain test case
    const formName3 = ' some form navme ';
    expect(service.removeVersionInformation(formName)).toEqual(
      'some form name'
    );
    expect(service.removeVersionInformation(formName2)).toEqual(
      'some form name'
    );
    expect(service.removeVersionInformation(formName3)).toEqual(
      'some form navme'
    );
  });

  it('should remove version information from an array of forms ', () => {
    const formNames = [
      {
        name: 'some'
      },
      {
        name: 'form v1.0'
      }
    ];
    const expectedFormNames = [
      {
        name: 'some',
        display: 'some'
      },
      {
        name: 'form',
        display: 'form v1.0'
      }
    ];
    const actualFormNames = service.removeVersionInformationFromForms(
      formNames
    );
    expect(expectedFormNames).toEqual(actualFormNames);
  });
});
*/
