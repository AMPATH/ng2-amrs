import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from './app-settings.service';

describe('AppSettingsServices Unit Tests', () => {
  let service: AppSettingsService;
  let localStorageService: LocalStorageService;
  const url = 'http://example.url.com';
  let initialNumberOfOpenmrsUrls: number;
  let initialNumberOfEtlUrls: number;
  beforeAll(() => {
    localStorageService = new LocalStorageService();
  });

  beforeEach(() => {
    localStorageService.clear();
    service = new AppSettingsService(localStorageService);
    initialNumberOfOpenmrsUrls = service.openmrsServerUrls.length;
    initialNumberOfEtlUrls = service.etlServerUrls.length;
  });

  it('Should add url to proper list and set it correctly', () => {
    service.addAndSetUrl(url, 'etl');
    expect(service.etlServerUrls.length).toEqual(initialNumberOfEtlUrls + 1);
    expect(service.getEtlServer()).toEqual(url);

    service.addAndSetUrl(url);
    expect(service.openmrsServerUrls.length).toEqual(initialNumberOfOpenmrsUrls + 1);
    expect(service.getOpenmrsServer()).toEqual(url);
  });

  it('Should set ETL url to new value and add it to the list', () => {
    const aUrl = 'http://another.url.ex';
    service.setEtlServer(aUrl);
    expect(service.getEtlServer()).toEqual(aUrl);
    expect(service.etlServerUrls.length).toEqual(initialNumberOfEtlUrls + 1);
    expect(service.etlServerUrls.indexOf(aUrl)).not.toEqual(-1);
  });

  it('Should set Openmrs url to new value and add it to the list', () => {
    service.setOpenmrsServer(url);
    expect(service.getOpenmrsServer()).toEqual(url);
    expect(service.openmrsServerUrls.length).toEqual(
      initialNumberOfOpenmrsUrls + 1,
      'Number of url should increase by 1 in the list');
    expect(service.openmrsServerUrls.indexOf(url)).not.toEqual(-1);
  });

  it('Should Return the correct openmrs base rest URL', () => {
    service.setOpenmrsServer(url);
    const expected = url + '/ws/rest/v1/';
    expect(service.getOpenmrsRestbaseurl()).toEqual(expected,
      'must be correct Openmrs REST base Url');

    service.setOpenmrsServer(url + '/');
    expect(service.getOpenmrsRestbaseurl()).toEqual(expected,
      'must be correct Openmrs REST base Url');
  });
});
