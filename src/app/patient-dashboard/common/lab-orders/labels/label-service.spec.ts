import { TestBed, async, inject } from '@angular/core/testing';
import { LabelService } from './label-service';

describe('LabelService', () => {
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LabelService
            ]
        });
    });

    afterAll(() => {
        TestBed.resetTestingModule();
    });

    it('should return a blob url of pdf file', async(inject([LabelService], (s: LabelService) => {
        let labels = [{
            orderDate: '20/03/2017',
            testName: 'CD4-PANEL',
            identifier: 'ME',
            orderNumber: 'ORD-10'
        }, {
            orderDate: '20/03/2017',
            testName: 'VL',
            identifier: 'ME',
            orderNumber: 'ORD-100'
        }];
        s.generateBarcodes(labels).take(1).subscribe((url) => {
            expect(typeof url).toBe('string');
        });
    })));

});
