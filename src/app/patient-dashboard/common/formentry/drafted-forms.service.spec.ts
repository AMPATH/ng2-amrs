/*
 * Testing a Component with async services
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#component-with-async-service
 */
import { TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

import { DraftedFormsService } from './drafted-forms.service';
import { Form } from 'ngx-openmrs-formentry';

describe('Drafted Forms Service:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                DraftedFormsService
            ],
            imports: []
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be injected ', () => {
        const service = TestBed.get(DraftedFormsService);
        expect(service).toBeTruthy();
    });

    it('should have all the required functions defined and callable', () => {
        const service = TestBed.get(DraftedFormsService);
        spyOn(service, 'getRouteSnapshot').and.callFake(() => { });
        service.getRouteSnapshot();
        expect(service.getRouteSnapshot).toHaveBeenCalled();

        spyOn(service, 'setCancelState').and.callFake(() => { });
        service.setCancelState();
        expect(service.setCancelState).toHaveBeenCalled();

        const sampleForm: Form = new Form(null, null, null);
        spyOn(service, 'setDraftedForm').and.callFake(() => { });
        service.setDraftedForm(sampleForm);
        expect(service.setDraftedForm).toHaveBeenCalled();
    });

    it('should notify subscribers when a drafted form is set', (done) => {
        const service = TestBed.get(DraftedFormsService);

        const sampleForm: Form = new Form(null, null, null);
        service.draftedForm.subscribe(form => {
            if (form) {
                expect(service.lastDraftedForm).toBe(sampleForm);
                expect(form).toBe(sampleForm);
                done();
            }
        });
        service.setDraftedForm(sampleForm);
    });
});

