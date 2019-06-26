import {throwError as observableThrowError,  ReplaySubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { assetUrl } from 'src/single-spa/public-path';
@Injectable()
export class FormOrderMetaDataService {
    private formsOrder = new ReplaySubject(1);
    constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }
    public getDefaultFormOrder(forceRefresh?: boolean) {
        if (!this.formsOrder.observers.length || forceRefresh) {
            this.http.get(
                assetUrl('schemas/form-order.json')
            )
                .subscribe(
                (data) => {console.log(data); this.formsOrder.next(data); },
                (error) => this.formsOrder.error(error)
                );
        }

        return this.formsOrder;
    }
    public setFavouriteForm(name: string) {
        const formNames = this.getFavouriteForm();
        const obj = {
            name: name
        };
        if (_.find(formNames, obj) === undefined) {
            formNames.push(obj);
            this.localStorageService.setObject('formNames', formNames);
        }

    }
    public removeFavouriteForm(name) {
        const formNames = this.getFavouriteForm();
        const obj = {
            name: name
        };
        formNames.splice(_.indexOf(formNames, _.find(formNames, obj)), 1);
        this.localStorageService.setObject('formNames', formNames);
    }
    public getFavouriteForm() {
        const storedData = this.localStorageService.getItem('formNames');
        let arrayData = [];
        if (storedData) {
            arrayData = JSON.parse(storedData);
        }
        return arrayData;
    }

    private handleError(error: any) {
        return observableThrowError(error.message
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : 'Server Error');
    }
}
