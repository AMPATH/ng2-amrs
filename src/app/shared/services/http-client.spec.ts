import {
  ComponentFixture,
  TestBed,
  async,
  inject,
} from "@angular/core/testing";
import { CacheModule, CacheService } from "ionic-cache";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
// Load the implementations that should be tested

describe("Service : HttpClient Unit Tests", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient],
      imports: [HttpClientTestingModule],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should be injected with all dependencies", inject(
    [HttpClient],
    (httpClient: HttpClient) => {
      expect(httpClient).toBeDefined();
    }
  ));
});
