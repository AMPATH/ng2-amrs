import { TestBed, async, inject } from '@angular/core/testing';

import { FormOrderMetaDataService } from './form-order-metadata.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
class MockError extends Response implements Error {
  name: any;
  message: any;
}
describe('Form Order Metadata Service', () => {
  let httpMock: HttpTestingController;
  let service: FormOrderMetaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [FormOrderMetaDataService, LocalStorageService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(FormOrderMetaDataService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
  describe('Favorite Helper functions', () => {
    it('should be favorite a form when setFavouriteForm is called', () => {
      service.setFavouriteForm('form1');
      const favorites = JSON.parse(localStorage.getItem('formNames'));
      expect(favorites).toBeTruthy();
      expect(favorites[0].name).toBe('form1');
    });
    it('should return a list of favorites when getFavouriteForm is called', () => {
      localStorage.setItem(
        'formNames',
        JSON.stringify([{ name: 'form1' }, { name: 'form2' }])
      );
      const favorites = service.getFavouriteForm();
      expect(favorites).toBeTruthy();
      expect(favorites[0].name).toBe('form1');
    });
    it('should return an empty list if no favorites are set when getFavouriteForm is called', () => {
      const favorites = service.getFavouriteForm();
      expect(favorites).toBeTruthy();
      expect(favorites.length).toBe(0);
    });

    it('should remove a favorite when removeFavouriteForm', () => {
      localStorage.setItem(
        'formNames',
        JSON.stringify([{ name: 'form1' }, { name: 'form2' }])
      );
      service.removeFavouriteForm('form1');
      const favorites = service.getFavouriteForm();
      expect(favorites).toBeTruthy();
      expect(favorites.length).toBe(1);
    });
  });

  describe('get form order metadata', () => {
    const forms = [
      {
        name: 'Ampath POC Triage Encounter Form'
      },
      {
        name: 'AMPATH POC Adult Return Visit Form'
      },
      {
        name: 'AMPATH POC Resistance Clinic Encounter Form'
      },
      {
        name: 'AMPATH POC Pediatric Return Visit Form'
      }
    ];
    it('should call the right endpoint', () => {
      const result = service.getDefaultFormOrder().subscribe();

      const req = httpMock.expectOne('./assets/schemas/form-order.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('./assets/schemas/form-order.json');
      req.flush({ body: JSON.stringify(forms) });
    });

    it('should parse response of the forms metadata', () => {
      //
      const uuid = 'uuid';

      const result = service.getDefaultFormOrder();

      result.subscribe((res) => {
        expect(res).toBeDefined();
      });

      const req = httpMock.expectOne('./assets/schemas/form-order.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('./assets/schemas/form-order.json');
      req.flush({ body: JSON.stringify(forms) });
    });

    it('should parse errors', () => {
      const opts = { type: Error, status: 404, statusText: 'val' };
      const result = service.getDefaultFormOrder();

      result.subscribe(
        (res) => {},
        (err) => {
          expect(err.status).toBe(404);
        }
      );

      const req = httpMock.expectOne('./assets/schemas/form-order.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('./assets/schemas/form-order.json');
      req.flush({ body: JSON.stringify(opts) });
    });
  });
});
