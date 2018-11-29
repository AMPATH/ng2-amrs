import { TestBed, async, inject } from '@angular/core/testing';
import { LabelService } from './label-service';

describe('LabelService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LabelService
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should return a blob url of pdf file', async(inject([LabelService], (s: LabelService) => {
        const labels = [{
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
        s.generateBarcodes(labels).subscribe((url) => {
            expect(typeof url).toBe('string');
        });
    })));

});
