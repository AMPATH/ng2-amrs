import { Injectable } from "@angular/core";
import { LocalStorageService } from "../utils/local-storage.service";

@Injectable()
export class AppSettingsService {
  public static readonly DEFAULT_OPENMRS_SERVER_URL =
    "https://ngx.ampath.or.ke/amrs";
  public static readonly DEFAULT_ETL_SERVER_URL =
    "https://ngx.ampath.or.ke/etl-latest/etl";
  public static readonly DEFAULT_AMRSIDGEN_SERVER_URL =
    "https://ngx.ampath.or.ke/amrs-id-generator";

  public static readonly OPENMRS_LIST_STORAGE_KEY =
    "appSettings.openmrsServersList";
  public static readonly ETL_LIST_STORAGE_KEY = "appSettings.etlServersList";
  public static readonly AMRSIDGEN_SERVER_LIST_KEY =
    "appSettings.amrsIdGenServerList";

  public static readonly OPENMRS_SERVER_KEY = "appSettings.openmrsServer";
  public static readonly ETL_SERVER_KEY = "appSettings.etlServer";
  public static readonly AMRSIDGEN_SERVER_KEY = "appSettings.amrsIdGenServer";

  private static readonly OPENMRS_REST_SUFFIX = "ws/rest/v1/";
  private _openmrsServer: string;
  private _etlServer: string;
  private _amrsIdGenServer: string;

  private _openmrsServerUrls = [
    "http://localhost:8080/openmrs",
    // 'https://test2.ampath.or.ke:8443/amrs',
    // 'https://amrs.ampath.or.ke:8443/amrs'
    "https://ngx.ampath.or.ke/amrs",
    "https://ngx.ampath.or.ke/test-amrs",
  ];

  private _etlServerUrls = [
    "http://localhost:8002/etl",
    // 'https://test1.ampath.or.ke:8002/etl',
    // 'https://test2.ampath.or.ke:8002/etl',
    // 'https://amrsreporting.ampath.or.ke:8002/etl',
    "/etl-server-test-worcester/etl",
    "https://ngx.ampath.or.ke/etl-latest/etl",
  ];

  private _amrsIdGenServerUrls = [
    "/amrs-id-generator",
    "https://ngx.ampath.or.ke/amrs-id-generator",
  ];

  private templates = [
    {
      name: "AMRS POC",
      amrsUrl: "/amrs",
      etlUrl: "/etl-latest/etl",
      amrsIdGenUrl: "/amrs-id-generator",
    },
    {
      name: "AMRS POC Beta",
      amrsUrl: "/amrs",
      etlUrl: "https://ngx.ampath.or.ke/etl-server-beta/etl",
      amrsIdGenUrl: "/amrs-id-generator",
    },
    {
      name: "AMRS Test",
      amrsUrl: "/test-amrs",
      etlUrl: "/etl-server-test-worcester/etl",
      amrsIdGenUrl: "/amrs-id-generator",
    },
  ];

  get openmrsServerUrls(): string[] {
    return this._openmrsServerUrls;
  }

  get etlServerUrls(): string[] {
    return this._etlServerUrls;
  }

  get amrsIdGenServerUrls(): string[] {
    return this._amrsIdGenServerUrls;
  }

  constructor(private localStorageService: LocalStorageService) {
    const cachedUrls = localStorageService.getObject(
      AppSettingsService.OPENMRS_LIST_STORAGE_KEY
    );
    if (cachedUrls) {
      this._openmrsServerUrls = cachedUrls;
    } else {
      localStorageService.setObject(
        AppSettingsService.OPENMRS_LIST_STORAGE_KEY,
        this.openmrsServerUrls
      );
    }

    const cachedUrl = localStorageService.getItem(
      AppSettingsService.OPENMRS_SERVER_KEY
    );
    if (cachedUrl) {
      this._openmrsServer = cachedUrl;
    } else {
      this.setOpenmrsServer(AppSettingsService.DEFAULT_OPENMRS_SERVER_URL);
    }

    const cachedEtlUrls = localStorageService.getItem(
      AppSettingsService.ETL_LIST_STORAGE_KEY
    );
    if (cachedEtlUrls) {
      this._etlServerUrls = JSON.parse(cachedEtlUrls);
    } else {
      localStorageService.setItem(
        AppSettingsService.ETL_LIST_STORAGE_KEY,
        JSON.stringify(this.etlServerUrls)
      );
    }

    const cachedEtlUrl = localStorageService.getItem(
      AppSettingsService.ETL_SERVER_KEY
    );
    if (cachedEtlUrl) {
      this._etlServer = cachedEtlUrl;
    } else {
      this.setEtlServer(AppSettingsService.DEFAULT_ETL_SERVER_URL);
    }

    const cachedAmrsIdGenUrls = localStorageService.getItem(
      AppSettingsService.AMRSIDGEN_SERVER_LIST_KEY
    );
    if (cachedAmrsIdGenUrls) {
      this._amrsIdGenServerUrls = JSON.parse(cachedAmrsIdGenUrls);
    } else {
      localStorageService.setItem(
        AppSettingsService.AMRSIDGEN_SERVER_LIST_KEY,
        JSON.stringify(this.amrsIdGenServerUrls)
      );
    }

    const cachedAmrsIdGenUrl = localStorageService.getItem(
      AppSettingsService.DEFAULT_AMRSIDGEN_SERVER_URL
    );
    if (cachedAmrsIdGenUrl) {
      this._amrsIdGenServer = cachedAmrsIdGenUrl;
    } else {
      this.setAmrsIdGenServer(AppSettingsService.DEFAULT_AMRSIDGEN_SERVER_URL);
    }
  }

  public getServerTemplates(): Array<object> {
    return this.templates;
  }

  public getOpenmrsServer(): string {
    return (
      this.localStorageService.getItem(AppSettingsService.OPENMRS_SERVER_KEY) ||
      this._openmrsServer
    );
  }

  public setOpenmrsServer(value: string): void {
    if (this._openmrsServerUrls.indexOf(value) === -1) {
      this.addOpenmrsUrl(value);
    }
    this.localStorageService.setItem(
      AppSettingsService.OPENMRS_SERVER_KEY,
      value
    );
    this._openmrsServer = value;
  }

  public getEtlServer(): string {
    return (
      this.localStorageService.getItem(AppSettingsService.ETL_SERVER_KEY) ||
      this._etlServer
    );
  }

  public setEtlServer(value: string): void {
    if (this._etlServerUrls.indexOf(value) === -1) {
      this.addEtlUrl(value);
    }
    this.localStorageService.setItem(AppSettingsService.ETL_SERVER_KEY, value);
    this._etlServer = value;
  }

  public setAmrsIdGenServer(value: string): void {
    if (this._amrsIdGenServerUrls.indexOf(value) === -1) {
      this.addAmrsIdGenUrl(value);
    }
    this.localStorageService.setItem(
      AppSettingsService.AMRSIDGEN_SERVER_KEY,
      value
    );
    this._amrsIdGenServer = value;
  }

  public getAmrsIdGenServer(): string {
    return (
      this.localStorageService.getItem(
        AppSettingsService.AMRSIDGEN_SERVER_KEY
      ) || this._amrsIdGenServer
    );
  }

  public addAndSetUrl(url: string, urlType: string = "openmrs") {
    switch (urlType) {
      case "etl":
        this.addEtlUrl(url);
        this.setEtlServer(url);
        break;
      case "openmrs":
        this.addOpenmrsUrl(url);
        this.setOpenmrsServer(url);
        break;
      case "amrsIdGen":
        this.addAmrsIdGenUrl(url);
        this.setAmrsIdGenServer(url);
        break;
      default:
        break;
    }
  }

  public addEtlUrl(url: string): void {
    this.etlServerUrls.push(url);
    this.localStorageService.setObject(
      AppSettingsService.ETL_LIST_STORAGE_KEY,
      this.etlServerUrls
    );
  }

  public addOpenmrsUrl(url: string): void {
    this.openmrsServerUrls.push(url);
    this.localStorageService.setObject(
      AppSettingsService.OPENMRS_LIST_STORAGE_KEY,
      this.openmrsServerUrls
    );
  }

  public addAmrsIdGenUrl(url: string): void {
    this.amrsIdGenServerUrls.push(url);
    this.localStorageService.setObject(
      AppSettingsService.OPENMRS_LIST_STORAGE_KEY,
      this.openmrsServerUrls
    );
  }

  public getOpenmrsRestbaseurl(): string {
    if (this.getOpenmrsServer().endsWith("/")) {
      return this.getOpenmrsServer() + AppSettingsService.OPENMRS_REST_SUFFIX;
    } else {
      return (
        this.getOpenmrsServer() + "/" + AppSettingsService.OPENMRS_REST_SUFFIX
      );
    }
  }

  public getEtlRestbaseurl(): string {
    if (this.getEtlServer().endsWith("/")) {
      return this.getEtlServer();
    } else {
      return this.getEtlServer() + "/";
    }
  }

  public getAmrsIdentifierRestbaseurl(): string {
    return this.getAmrsIdGenServer();
  }
}
