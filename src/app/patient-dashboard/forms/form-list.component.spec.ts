
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
    BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod, ResponseType
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Ng2FilterPipe } from '../../shared/pipes/ng2-filter.pipe';

import { FormListService } from './form-list.service';
import { FormListComponent } from './form-list.component';
import { FormsResourceService } from '../../openmrs-api/forms-resource.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { forms } from './forms';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
    transform(value: any, decimalPlaces: number): any {
        return value;
    }
}

describe('FormList Component', () => {
    let fakeChangeDetectorRef = {
        markForCheck: () => { }
    };

    let fixture, nativeElement, comp;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                FormListComponent,
                FakeTranslatePipe,
                Ng2FilterPipe
            ],
            providers: [
                MockBackend,
                BaseRequestOptions,
                LocalStorageService,
                AppSettingsService,
                { provide: ChangeDetectorRef, useValue: fakeChangeDetectorRef },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                FormsResourceService,
                FormOrderMetaDataService,
                FormListService
            ],
            imports: [
                HttpModule
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(FormListComponent);
                comp = fixture.componentInstance;
                nativeElement = fixture.nativeElement;
                fixture.detectChanges();
            });
    }));

    it('should defined', inject([FormListService], (service: FormListService) => {
        expect(comp).toBeTruthy();
    }));
    it('should render form list properly given the forms are available',
        inject([FormListService, FormOrderMetaDataService,
            FormsResourceService], (service: FormListService,
                formOrderMetaDataService: FormOrderMetaDataService,
                formsResourceService: FormsResourceService) => {
                let favourite = [{
                    name: 'form 5'
                }, {
                    name: 'form 3'
                }];

                let defualtOrdering = [{
                    name: 'form 2'
                }, {
                    name: 'form 3'
                }];

                let expectedFormsList = [{
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
                    Observable.of(favourite)
                    );
                const defaultOrderSpy = spyOn(formOrderMetaDataService,
                    'getDefaultFormOrder').and.returnValue(
                    Observable.of(defualtOrdering)
                    );
                const formListSpy = spyOn(formsResourceService,
                    'getForms').and.returnValue(
                    Observable.of(forms)
                    );
                const formServiceSpy = spyOn(service,
                    'getFormList').and.returnValue(
                    Observable.of(forms)
                    );
                let toggleFavouriteSpy = spyOn(comp, 'toggleFavourite');
                let formSelectedSypy = spyOn(comp, 'formSelected');

                comp.ngOnInit();
                fixture.detectChanges();
                let formList = nativeElement.querySelectorAll('.list-group-item');
                expect(comp.forms).toBeTruthy();
                expect(comp.forms.length).toEqual(6);
                expect(formList).toBeTruthy();
                expect(formList.length).toEqual(6);
                expect(formList[0].innerHTML).toContain('form 1');
            }));
});
