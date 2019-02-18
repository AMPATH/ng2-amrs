import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';

import * as _ from 'lodash';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
@Injectable()
export class FormListService {

    constructor(private formsResourceService: FormsResourceService,
                private formOrderMetaDataService: FormOrderMetaDataService) { }
    public removeVersionFromFormNames(pocForms) {
        _.each(pocForms, (form: any) => {
            form.display = form.name;
        });
        return pocForms;
    }

    public sortFormList(unsortArray, sortingMetadataArrays) {
        if (!Array.isArray(unsortArray)) {
            throw new Error('unsortedArray must be an array');
        }

        if (!Array.isArray(sortingMetadataArrays)) {
            throw new Error('sortingMetadataArrays must be an array');
        }

        _.each(sortingMetadataArrays, (array) => {
            if (!Array.isArray(array)) {
                throw new Error('Every member of the sortingMetadataArrays  must be an array');
            }
        });

        const sortedArray = [];

        // add items to the list of sorted array by using the metadata provided
        _.each(sortingMetadataArrays, (sortingMetadata) => {
            _.each(sortingMetadata, (metadata: any) => {
                const found = this._findItemByName(metadata.name, unsortArray);
                if (found) {
                    this._addMemberToArray(found, sortedArray);
                }
            });
        });

        // add missing items that weren't in the sorting metadata
        _.each(unsortArray, (item) => {
            const found = this._findItemByName(item.name, sortedArray);
            if (_.isEmpty(found)) {
                const toAdd = this._findItemByName(item.name, unsortArray);
                this._addMemberToArray(toAdd, sortedArray);
            }
        });

        return sortedArray;
    }

    public filterPublishedOpenmrsForms(unsortArray) {
        if (!Array.isArray(unsortArray)) {
            throw new Error('Input must be an array');
        }
        // comment out /*item.published && */ for all unretired forms (NOTE : ng-forms build)
        const publishedOpenmrsForms = _.filter(unsortArray, (item) => {
          return this.isRequiredForm(item) && /*item.published &&*/ !item.retired;
        });

        return publishedOpenmrsForms;
    }

    public processFavouriteForms(openmrsForms, favouriteForms) {
        if (!Array.isArray(openmrsForms)) { throw new Error('unsortedArray must be an array'); }
        if (!Array.isArray(favouriteForms)) { throw new Error('favourite must be an array'); }
        _.each(openmrsForms, (form) => {
            if (this._findItemByName(form.name, favouriteForms)) {
                form.favourite = true;
            } else {
                form.favourite = false;
            }

        });
        return openmrsForms;
    }

    public removeVersionInformationFromForms(formsArray) {
        _.each(formsArray, (form: any) => {
            form.display = _.clone(form.name);
            form.name = this.removeVersionInformation(form.name);
        });
        return formsArray;
    }

    public removeVersionInformation(formName) {
        if (typeof formName !== 'string') { throw new Error('formName should be a string'); }
        const trimmed = formName.trim();
        // minimum form length is 5 characters
        if (trimmed.length < 5) {
            return trimmed;
        }
        const lastFiveCharacters = trimmed.substr(trimmed.length - 5);
        const indexOfV = lastFiveCharacters.search('v') === -1 ? lastFiveCharacters
            .search('V') : lastFiveCharacters.search('v');
        if (indexOfV === -1 || indexOfV === (lastFiveCharacters.length - 1)) {
            return trimmed;
        }
        if (this._isVersionInformation(lastFiveCharacters
            .substr(indexOfV, lastFiveCharacters.length - indexOfV))) {
            return trimmed.substr(0, (trimmed.length - (5 - indexOfV))).trim();
        }
        return trimmed;
    }

  public getFormList() {
    const formList = new BehaviorSubject([]);
    const favouriteForms = this.formOrderMetaDataService.getFavouriteForm();
    this.formsResourceService.getForms().subscribe((forms) => {
      this.formOrderMetaDataService.getDefaultFormOrder().subscribe((defaultOrder) => {
        const formlist = this.processFavouriteForms(this._getFormList(forms,
          [favouriteForms, defaultOrder]), favouriteForms);
        formList.next(formlist);
      });
    });
    return formList;
  }

  private isRequiredForm(item: any) {
    const requiredSet = [
      'bcb914ea-1e03-4c7f-9fd5-1baba5841e78',
      'b84b2f7a-3062-4029-8f26-8b47e1e6c84e',
      '21de4ceb-8262-4416-8325-e98f97d3fc87',
      'cd9d8815-c9bf-4796-97b6-f63427fc4c34',
      '303ef24d-34e0-4d1c-9ff0-4e48f4670168',
      'bf6d0d9a-e6af-48fd-9245-6d1939adb37d',
      '1edd2d8e-bfc6-4b08-b8e0-3c3a4dd50ac1'
    ];
    return _.includes(requiredSet, item.uuid) && !item.published || !_.includes(requiredSet, item.uuid) && item.published;
  }

    private _getFormList(pocForms, formOrderArray) {
        // first filter out unpublished forms
        const effectiveForms = this.removeVersionInformationFromForms(pocForms);
        const publishedForms = this.filterPublishedOpenmrsForms(effectiveForms);
        const sortedList = this.sortFormList(publishedForms, formOrderArray);
        return sortedList;
    }
    private _isVersionInformation(subString) {
        if (subString.length < 2) { return false; }
        if (subString.substr(0, 1) !== 'v' && subString.substr(0, 1) !== 'V') { return false; }
        if (!this._isNumeric(subString.substr(1, 1))) { return false; }
        return true;
    }

    private _isNumeric(str) {
        return /^\d+$/.test(str);
    }

    private _findItemByName(name, array) {
        const foundItems = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < array.length; i++) {
            // TODO: find a way to compare strings by first eliminating the spaces
            if (array[i] && name === array[i].name) {
                foundItems.push(array[i]);
            }
        }
        return foundItems.length === 0 ?
            undefined : foundItems.length === 1 ? foundItems[0] : foundItems;
    }

    private _findItemByUuid(uuid, array) {
        const foundItems = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < array.length; i++) {
            // TODO: find a way to compare strings by first eliminating the spaces
            if (array[i] && uuid === array[i].uuid) {
                foundItems.push(array[i]);
            }
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
            if (member && !this._arrayHasMember(member, array)) {
                array.push(member);
            }
        }

    }
}
