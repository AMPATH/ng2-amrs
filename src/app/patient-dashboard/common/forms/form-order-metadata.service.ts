
import {throwError as observableThrowError,  ReplaySubject, Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import * as _ from 'lodash';

import { LocalStorageService } from '../../../utils/local-storage.service';
@Injectable()
export class FormOrderMetaDataService {
    private formsOrder = new ReplaySubject(1);
    constructor(private http: Http, private localStorageService: LocalStorageService) { }
    public getDefaultFormOrder(forceRefresh?: boolean) {
        if (!this.formsOrder.observers.length || forceRefresh) {
            this.http.get(
                './assets/schemas/form-order.json'
            ).pipe(map((res: Response) => res.json()))
                .subscribe(
                (data) => this.formsOrder.next(data),
                (error) => this.formsOrder.error(error)
                );
        }

        return this.formsOrder;
    }
    public setFavouriteForm(name: string) {
        let formNames = this.getFavouriteForm();
        let obj = {
            name: name
        };
        if (_.find(formNames, obj) === undefined) {
            formNames.push(obj);
            this.localStorageService.setObject('formNames', formNames);
        }

    }
    public removeFavouriteForm(name) {
        let formNames = this.getFavouriteForm();
        let obj = {
            name: name
        };
        formNames.splice(_.indexOf(formNames, _.find(formNames, obj)), 1);
        this.localStorageService.setObject('formNames', formNames);
    }
    public getFavouriteForm() {
        let storedData = this.localStorageService.getItem('formNames');
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
