/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnterTheComponentName } from './enter-the-file-name.component';

describe('EnterTheComponentName', () => {
    let fixture: ComponentFixture<EnterTheComponentName>;
    let comp: EnterTheComponentName;
    let el;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EnterTheComponentName
            ],
            providers: [],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(EnterTheComponentName);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should enter the assertion', () => {
        fixture.detectChanges();

        
        expect(enterAValue).toBe(enterTheExpectedResult);

        // other examples
        // expect(el.nativeElement.textContent).toContain('Test Title');
        // fixture.whenStable().then(() => {
        //     fixture.detectChanges();
        //     expect((fixture.debugElement.classes as any).className).toBe(true);
        // });
    });
});
