/*
 * Testing a Component with async services
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#component-with-async-service
 */
import { TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

import { DraftedFormsService } from './drafted-forms.service';
import { Form } from 'ng2-openmrs-formentry';

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

    it('should be injected ', () => {
        let service = TestBed.get(DraftedFormsService);
        expect(service).toBeTruthy();
    });

    it('should notify subscribers when a drafted form is set', (done) => {
        let service = TestBed.get(DraftedFormsService);

        let sampleForm: Form = new Form(null, null, null);
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

