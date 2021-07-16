import { TestBed } from "@angular/core/testing";
import { RisonService } from "./rison-service";
describe("Service : Ridon object encoder/decoder Unit Tests", () => {
  let service: RisonService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RisonService] });
  });
  it("should encode an object to be url friendly", () => {
    service = TestBed.get(RisonService);
    expect(service.encode({ any: "json", yes: true })).toBe(
      "(any:json,yes:!t)"
    );
  });

  it("should decode an encoded data back into an object", () => {
    service = TestBed.get(RisonService);
    expect(service.decode("(any:json,yes:!t)")).toEqual({
      any: "json",
      yes: true,
    });
  });
});
