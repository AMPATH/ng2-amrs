import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { FileUploadResourceService } from './file-upload-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
class MockAppsettings {
    getEtlRestbaseurl() {
        return 'etl.ampath.or.ke';
    }
}
describe('FileUploadResourceService', () => {
    let s, httpMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppSettingsService, useClass: MockAppsettings },
                FileUploadResourceService
            ]
        });
        s = TestBed.get(FileUploadResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined', () => {
        expect(s).toBeDefined();
    });

    it('should upload file when upload is called', () => {

        s.upload({}).subscribe((response: any) => {
            expect(response.image).toBe('uploaded-image');
        });

        const req = httpMock.expectOne(s.getUrl());
        expect(req.request.method).toBe('POST');
        req.flush({ image: 'uploaded-image' });
    });
});
