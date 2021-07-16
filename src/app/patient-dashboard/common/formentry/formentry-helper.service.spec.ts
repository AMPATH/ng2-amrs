/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, inject } from "@angular/core/testing";
import { FormentryHelperService } from "./formentry-helper.service";

describe("Service: FormentryHelperService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormentryHelperService],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create an instance of FormentryHelperService", () => {
    const service: FormentryHelperService = TestBed.get(FormentryHelperService);
    expect(service).toBeTruthy();
  });
});
