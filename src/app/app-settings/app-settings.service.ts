import { Injectable } from '@angular/core';
import { LocalStorageService } from '../utils/local-storage.service';

@Injectable()
export class AppSettingsService {
  public static readonly DEFAULT_OPENMRS_SERVER_URL = 'https://ngx.ampath.or.ke/amrs';
  public static readonly DEFAULT_ETL_SERVER_URL = 'https://ngx.ampath.or.ke/etl-latest/etl';
  public static readonly OPENMRS_LIST_STORAGE_KEY = 'appSettings.openmrsServersList';
  public static readonly ETL_LIST_STORAGE_KEY = 'appSettings.etlServersList';
  public static readonly OPENMRS_SERVER_KEY = 'appSettings.openmrsServer';
  public static readonly ETL_SERVER_KEY = 'appSettings.etlServer';
  private static readonly OPENMRS_REST_SUFFIX = 'ws/rest/v1/';
  private _openmrsServer: string;
  private _etlServer: string;

  private _openmrsServerUrls = [
    'http://localhost:8080/openmrs',
    // 'https://test2.ampath.or.ke:8443/amrs',
    // 'https://amrs.ampath.or.ke:8443/amrs'
    'https://ngx.ampath.or.ke/amrs',
    'https://ngx.ampath.or.ke/test-amrs'
  ];

  private _etlServerUrls = [
    'http://localhost:8002/etl',
    // 'https://test1.ampath.or.ke:8002/etl',
    // 'https://test2.ampath.or.ke:8002/etl',
    // 'https://amrsreporting.ampath.or.ke:8002/etl',
    '/etl-server-test-worcester/etl',
    'https://ngx.ampath.or.ke/etl-latest/etl'
  ];

  private templates = [
    {
      name: 'AMRS POC',
      amrsUrl: '/amrs',
      etlUrl: '/etl-latest/etl'
    },
    {
      name: 'AMRS POC Beta',
      amrsUrl: '/amrs',
      etlUrl: 'https://ngx.ampath.or.ke/etl-server-beta/etl'
    },
    {
      name: 'AMRS Test',
      amrsUrl: '/test-amrs',
      etlUrl: '/etl-server-test-worcester/etl'
    }
  ];

  get openmrsServerUrls(): string[] {
    return this._openmrsServerUrls;
  }

  get etlServerUrls(): string[] {
    return this._etlServerUrls;
  }

  constructor(private localStorageService: LocalStorageService) {
    const cachedUrls =
      localStorageService.getObject(AppSettingsService.OPENMRS_LIST_STORAGE_KEY);
    if (cachedUrls) {
      this._openmrsServerUrls = cachedUrls;
    } else {
      localStorageService.setObject(AppSettingsService.OPENMRS_LIST_STORAGE_KEY,
        this.openmrsServerUrls);
    }

    const cachedUrl = localStorageService.getItem(AppSettingsService.OPENMRS_SERVER_KEY);
    if (cachedUrl) {
      this._openmrsServer = cachedUrl;
    } else {
      this.setOpenmrsServer(AppSettingsService.DEFAULT_OPENMRS_SERVER_URL);
    }

    const cachedEtlUrls = localStorageService.getItem(AppSettingsService.ETL_LIST_STORAGE_KEY);
    if (cachedEtlUrls) {
      this._etlServerUrls = JSON.parse(cachedEtlUrls);
    } else {
      localStorageService.setItem(AppSettingsService.ETL_LIST_STORAGE_KEY,
        JSON.stringify(this.etlServerUrls));
    }

    const cachedEtlUrl = localStorageService.getItem(AppSettingsService.ETL_SERVER_KEY);
    if (cachedEtlUrl) {
      this._etlServer = cachedEtlUrl;
    } else {
      this.setEtlServer(AppSettingsService.DEFAULT_ETL_SERVER_URL);
    }
  }

  public getServerTemplates(): Array<object> {
    return this.templates;
  }

  public getOpenmrsServer(): string {
    return this.localStorageService
      .getItem(AppSettingsService.OPENMRS_SERVER_KEY) || this._openmrsServer;
  }

  public setOpenmrsServer(value: string): void {
    if (this._openmrsServerUrls.indexOf(value) === -1) {
      this.addOpenmrsUrl(value);
    }
    this.localStorageService.setItem(AppSettingsService.OPENMRS_SERVER_KEY, value);
    this._openmrsServer = value;
  }

  public getEtlServer(): string {
    return this.localStorageService.getItem(AppSettingsService.ETL_SERVER_KEY) || this._etlServer;
  }

  public setEtlServer(value: string): void {
    if (this._etlServerUrls.indexOf(value) === -1) {
      this.addEtlUrl(value);
    }
    this.localStorageService.setItem(AppSettingsService.ETL_SERVER_KEY, value);
    this._etlServer = value;
  }

  public addAndSetUrl(url: string, urlType: string = 'openmrs') {
    if (urlType === 'etl') {
      this.addEtlUrl(url);
      this.setEtlServer(url);
    } else {
      this.addOpenmrsUrl(url);
      this.setOpenmrsServer(url);
    }
  }

  public addEtlUrl(url: string): void {
    this.etlServerUrls.push(url);
    this.localStorageService.setObject(AppSettingsService.ETL_LIST_STORAGE_KEY,
      this.etlServerUrls);
  }

  public addOpenmrsUrl(url: string): void {
    this.openmrsServerUrls.push(url);
    this.localStorageService.setObject(AppSettingsService.OPENMRS_LIST_STORAGE_KEY,
      this.openmrsServerUrls);
  }

  public getOpenmrsRestbaseurl(): string {
    if (this.getOpenmrsServer().endsWith('/')) {
      return this.getOpenmrsServer() + AppSettingsService.OPENMRS_REST_SUFFIX;
    } else {
      return this.getOpenmrsServer() + '/' + AppSettingsService.OPENMRS_REST_SUFFIX;
    }
  }

  public getEtlRestbaseurl(): string {
    if (this.getEtlServer().endsWith('/')) {
      return this.getEtlServer();
    } else {
      return this.getEtlServer() + '/';
    }
  }
}
