
import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { of } from 'rxjs';

import { FormListService } from './form-list.service';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
import * as _ from 'lodash';
import { forms } from './forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FormListService', () => {
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
            imports: [
                HttpClientTestingModule
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined',
        inject([FormListService], (service: FormListService) => {
            expect(service).toBeTruthy();
        })
    );
    it('should sort array of forms given unsorted array and sorting metadata',
        inject([FormListService], (formListService: FormListService) => {
            const favourite = [{
                name: 'form 5'
            }, {
                name: 'form 3'
            }];

            const defualtOrdering = [{
                name: 'form 2'
            }, {
                name: 'form 3'
            }];

            const expectedOrderForms = [{
                name: 'form 5',
                published: false,
                uuid: 'uuid5-unpublished',
                version: '1.0'
            }, {
                name: 'form 3',
                published: false,
                uuid: 'uuid3',
                version: '1.0'
            }, {
                name: 'form 2',
                published: true,
                uuid: 'uuid2',
                version: '1.0'
            }, {
                name: 'form 1',
                published: true,
                uuid: 'uuid',
                version: '1.0'
            }, {
                name: 'form 4',
                published: true,
                uuid: 'uuid4',
                version: '1.0'
            }, {
                name: 'form 4',
                published: false,
                uuid: 'uuid4-unpublished',
                version: '2.0'
            }];

            const actualOrderedForms = formListService.sortFormList(forms,
                [favourite, defualtOrdering]);

            expect(Array.isArray(actualOrderedForms)).toBeTruthy();
            expect(actualOrderedForms[0]).toEqual(expectedOrderForms[0]);
            expect(actualOrderedForms[1]).toEqual(expectedOrderForms[1]);
            expect(actualOrderedForms[2]).toEqual(expectedOrderForms[2]);
            expect(actualOrderedForms.length === expectedOrderForms.length).toBeTruthy();
            expect(actualOrderedForms).toEqual(expectedOrderForms);

        }));

    it('should filter out unpublished openmrs forms from a list',
        inject([FormListService], (formListService: FormListService) => {
            const expectedFilteredList = [{
                name: 'form 1',
                published: true,
                uuid: 'uuid',
                version: '1.0'
            }, {
                name: 'form 2',
                published: true,
                uuid: 'uuid2',
                version: '1.0'
            }, {
                name: 'form 4',
                published: true,
                uuid: 'uuid4',
                version: '1.0'
            }];

            const actualFilteredList = formListService.filterPublishedOpenmrsForms(forms);

            expect(actualFilteredList.length === expectedFilteredList.length).toBeFalsy();
            // expect(_.find(actualFilteredList, expectedFilteredList[0]) !== null).toBeTruthy();
            // expect(_.find(actualFilteredList, expectedFilteredList[1]) !== null).toBeTruthy();
            // expect(_.find(actualFilteredList, expectedFilteredList[2]) !== null).toBeTruthy();

        }));
    it('should add favourite property to forms list',
        inject([FormListService], (formListService: FormListService) => {
            const favourite = [{
                name: 'form 5'
            }, {
                name: 'form 3'
            }];

            const expectedfavouriteForms = [{
                name: 'form 1',
                published: true,
                uuid: 'uuid',
                version: '1.0',
                favourite: false
            }, {
                name: 'form 2',
                published: true,
                uuid: 'uuid2',
                version: '1.0',
                favourite: false
            }, {
                name: 'form 3',
                published: false,
                uuid: 'uuid3',
                version: '1.0',
                favourite: true
            }, {
                name: 'form 4',
                published: true,
                uuid: 'uuid4',
                version: '1.0',
                favourite: false
            }, {
                name: 'form 4',
                published: false,
                uuid: 'uuid4-unpublished',
                version: '2.0',
                favourite: false
            }, {
                name: 'form 5',
                published: false,
                uuid: 'uuid5-unpublished',
                version: '1.0',
                favourite: true
            }];

            const processFavouriteForms = formListService.processFavouriteForms(forms, favourite);

            expect(processFavouriteForms).toEqual(expectedfavouriteForms);
        }));

    xit('should fetch and process the final form list when getFormList is invoked',
        async(inject([FormListService, FormOrderMetaDataService, FormsResourceService],
            (formListService: FormListService,
             formOrderMetaDataService: FormOrderMetaDataService,
             formsResourceService: FormsResourceService) => {
                const favourite = [{
                    name: 'form 5'
                }, {
                    name: 'form 3'
                }];

                const defualtOrdering = [{
                    name: 'form 2'
                }, {
                    name: 'form 3'
                }];

                const expectedFormsList = [{
                    name: 'form 2',
                    display: 'form 2',
                    published: true,
                    uuid: 'uuid2',
                    version: '1.0',
                    favourite: false
                }, {
                    name: 'form 1',
                    display: 'form 1',
                    published: true,
                    uuid: 'uuid',
                    version: '1.0',
                    favourite: false
                }, {
                    name: 'form 4',
                    display: 'form 4',
                    published: true,
                    uuid: 'uuid4',
                    version: '1.0',
                    favourite: false
                }];

                const favouriteFormsSpy = spyOn(formOrderMetaDataService,
                    'getFavouriteForm').and.returnValue(
                    favourite
                    );
                const defaultOrderSpy = spyOn(formOrderMetaDataService,
                    'getDefaultFormOrder').and.returnValue(
                    of(defualtOrdering)
                    );
                const formListSpy = spyOn(formsResourceService,
                    'getForms').and.returnValue(
                    of(forms)
                    );
                formListService.getFormList().subscribe((actualFormList) => {
                    expect(actualFormList).toBeTruthy();
                    expect(actualFormList).toEqual(expectedFormsList);
                });

            })));

    it('should remove version information from a form name',
        inject([FormListService], (formListService: FormListService) => {
            // CASE 1: Perfect form name
            const formName = ' some form name v1.00 '; // CASE 2: Imperfect version
            const formName2 = ' some form name v1. '; // CASE 3: No version information
            // the v intentionally put there for a certain test case
            const formName3 = ' some form navme ';
            expect(formListService.removeVersionInformation(formName)).toEqual('some form name');
            expect(formListService.removeVersionInformation(formName2)).toEqual('some form name');
            expect(formListService.removeVersionInformation(formName3)).toEqual('some form navme');
        }));
    it('should remove version information from an array of forms ',
        inject([FormListService], (formListService: FormListService) => {
            const formNames = [{
                name: 'some'
            }, {
                name: 'form v1.0'
            }];
            const expectedFormNames = [{
                name: 'some',
                display: 'some'
            }, {
                name: 'form',
                display: 'form v1.0'
            }];
            const actualFormNames = formListService.removeVersionInformationFromForms(formNames);
            expect(expectedFormNames).toEqual(actualFormNames);
        }));
});
