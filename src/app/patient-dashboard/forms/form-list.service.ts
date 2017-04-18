import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';

import * as _ from 'lodash';
import { FormsResourceService } from '../../openmrs-api/forms-resource.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
@Injectable()
export class FormListService {

    constructor(private formsResourceService: FormsResourceService,
        private formOrderMetaDataService: FormOrderMetaDataService) { }
    removeVersionFromFormNames(pocForms) {
        _.each(pocForms, (form) => {
            form.display = form.name;
        });
        return pocForms;
    }

    sortFormList(unsortArray, sortingMetadataArrays) {
        if (!Array.isArray(unsortArray)) throw new Error('unsortedArray must be an array');

        if (!Array.isArray(sortingMetadataArrays))
            throw new Error('sortingMetadataArrays must be an array');

        _.each(sortingMetadataArrays, (array) => {
            if (!Array.isArray(array))
                throw new Error('Every member of the sortingMetadataArrays  must be an array');
        });

        let sortedArray = [];

        // add items to the list of sorted array by using the metadata provided
        _.each(sortingMetadataArrays, (sortingMetadata) => {
            _.each(sortingMetadata, (metadata) => {
                let found = this._findItemByName(metadata.name, unsortArray);
                if (found) {
                    this._addMemberToArray(found, sortedArray);
                }
            });
        });

        // add missing items that weren't in the sorting metadata
        _.each(unsortArray, (item) => {
            let found = this._findItemByName(item.name, sortedArray);
            if (_.isEmpty(found)) {
                let toAdd = this._findItemByName(item.name, unsortArray);
                this._addMemberToArray(toAdd, sortedArray);
            }
        });

        return sortedArray;
    }




    filterPublishedOpenmrsForms(unsortArray) {
        if (!Array.isArray(unsortArray)) throw new Error('Input must be an array');

        let publishedOpenmrsForms = [];

        _.each(unsortArray,
            (item) => {
                if (this.isVersion22xForm(item) ||
                    (!this.isToBeExcludedInVersion22xForm(item) &&
                        item.published === true)) {
                    publishedOpenmrsForms.push(item);
                }
            });
        return publishedOpenmrsForms;
    }

    isVersion22xForm(form) {
        let toInclude = [
            '4f6db4d0-1d27-4d2a-bad0-a04dee2c54fe',
            'c9f3a707-c640-4e55-96e7-e5a6d0126844',
            '98296b2f-4c15-46be-81c6-268cc9085d19',
            '86ff76f4-6a20-4166-b65f-db7d4d3d104e',
            '86e538cb-c8a0-4974-b709-dd5ccd804524',
            'ce5cf699-b2da-4e2d-9f18-17d1ef7e68a0'
        ];

        return toInclude.indexOf(form.uuid) >= 0;
    }

    isToBeExcludedInVersion22xForm(form) {
        let toExclude = [
            '38f6f2c8-6cb0-4aa1-aa84-fd4904bd2143',
            'b8c817b5-c8fd-4f3c-8558-bf989c905234',
            '3b1e50a6-df61-4b8f-b37d-235032f2c645',
            '25ac6008-3b65-4435-b5b6-a8f0f3dd2b0d',
            '9416746d-1e9f-47e8-aa2d-035aab6f3824',
            '81f92a8a-ff5c-415d-a34c-b5bdca2406be'
        ];

        return toExclude.indexOf(form.uuid)  >= 0;
    }

    processFavouriteForms(openmrsForms, favouriteForms) {
        if (!Array.isArray(openmrsForms)) throw new Error('unsortedArray must be an array');
        if (!Array.isArray(favouriteForms)) throw new Error('favourite must be an array');
        _.each(openmrsForms, (form) => {
            if (this._findItemByName(form.name, favouriteForms)) {
                form.favourite = true;
            } else {
                form.favourite = false;
            }

        });
        return openmrsForms;
    }

    removeVersionInformationFromForms(formsArray) {
        _.each(formsArray, (form) => {
            form.display = _.clone(form.name);
            form.name = this.removeVersionInformation(form.name);
        });
        return formsArray;
    }

    removeVersionInformation(formName) {
        if (typeof formName !== 'string') throw new Error('formName should be a string');
        let trimmed = formName.trim();
        // minimum form length is 5 characters
        if (trimmed.length < 5)
            return trimmed;
        let lastFiveCharacters = trimmed.substr(trimmed.length - 5);
        let indexOfV = lastFiveCharacters.search('v') === -1 ? lastFiveCharacters
            .search('V') : lastFiveCharacters.search('v');
        if (indexOfV === -1 || indexOfV === (lastFiveCharacters.length - 1))
            return trimmed;
        if (this._isVersionInformation(lastFiveCharacters
            .substr(indexOfV, lastFiveCharacters.length - indexOfV))) {
            return trimmed.substr(0, (trimmed.length - (5 - indexOfV))).trim();
        }
        return trimmed;
    }


    getFormList() {
        let formList = new BehaviorSubject([]);
        let favouriteForms = this.formOrderMetaDataService.getFavouriteForm();
        this.formsResourceService.getForms().subscribe((forms) => {
            this.formOrderMetaDataService.getDefaultFormOrder().subscribe((defaultOrder) => {
                let formlist = this.processFavouriteForms(this._getFormList(forms,
                    [favouriteForms, defaultOrder]), favouriteForms);
                formList.next(formlist);
            });
        });
        return formList;
    }

    private _getFormList(pocForms, formOrderArray) {
        // first filter out unpublished forms
        let effectiveForms = this.removeVersionInformationFromForms(pocForms);
        let publishedForms = this.filterPublishedOpenmrsForms(effectiveForms);
        let sortedList = this.sortFormList(publishedForms, formOrderArray);
        return sortedList;
    }
    private _isVersionInformation(subString) {
        if (subString.length < 2) return false;
        if (subString.substr(0, 1) !== 'v' && subString.substr(0, 1) !== 'V') return false;
        if (!this._isNumeric(subString.substr(1, 1))) return false;
        return true;
    }

    private _isNumeric(str) {
        return /^\d+$/.test(str);
    }

    private _findItemByName(name, array) {
        let foundItems = [];
        for (let i = 0; i < array.length; i++) {
            // TODO: find a way to compare strings by first eliminating the spaces
            if (array[i] && name === array[i].name)
                foundItems.push(array[i]);
        }
        return foundItems.length === 0 ?
            undefined : foundItems.length === 1 ? foundItems[0] : foundItems;
    }

    private _findItemByUuid(uuid, array) {
        let foundItems = [];
        for (let i = 0; i < array.length; i++) {
            // TODO: find a way to compare strings by first eliminating the spaces
            if (array[i] && uuid === array[i].uuid)
                foundItems.push(array[i]);
        }
        return foundItems.length === 0 ?
            undefined : foundItems.length === 1 ? foundItems[0] : foundItems;
    }

    private _arrayHasMember(member, array) {
        return array.indexOf(member) !== -1;
    }

    private _addMemberToArray(member, array) {
        if (Array.isArray(member)) {
            // add individual members to array
            _.each(member, (item) => {
                this._addMemberToArray(item, array);
            });
        } else {
            if (member && !this._arrayHasMember(member, array))
                array.push(member);
        }

    }
}
