import { TestBed, fakeAsync, inject } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { MOHReportService } from "./moh-731-report-pdf-view.service";
require("pdfmake/build/pdfmake.js");
require("pdfmake/build/vfs_fonts.js");

import { Moh731ResourceServiceMock } from "../../etl-api/moh-731-resource.service.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";
declare let pdfMake: any;

describe("Service: MOHReportService", () => {
  const params = {
    county: "Kakamega",
    district: "dsit",
    endDate: "2017-04-10",
    facility: "Location 2",
    facilityName: "Location 2",
    location_name: "Location 2",
    location_uuid: "Location-uuid",
    startDate: "2017-03-10",
  };
  const mock = new Moh731ResourceServiceMock();
  const data = mock.getTestData();
  const rowData = data.result;
  const sectionDefinitions = data.sectionDefinitions;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MOHReportService],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create an instance of MOHReportService", () => {
    const service: MOHReportService = TestBed.get(MOHReportService);
    expect(service).toBeTruthy();
  });

  it(
    "should initialize correctly when " + "MOHReportService is instantiated",
    () => {
      const service: MOHReportService = TestBed.get(MOHReportService);
      expect(service.generatePdf).toBeTruthy();
    }
  );

  it("should return correct pdf source (blob object URL), pdf definition, and  pdfProxy", (done) => {
    const service: MOHReportService = TestBed.get(MOHReportService);

    service.generatePdf(params, rowData, sectionDefinitions).subscribe(
      (pdf) => {
        expect(pdf.pdfSrc).toBeDefined();
        expect(pdf.pdfDefinition).toBeDefined();
        expect(pdf.pdfProxy).toBeDefined();
        done();
      },
      (err) => {
        expect(err).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
        done();
      }
    );
  });

  it("should return correct pdf definition with the correct object structure needed by pdfMake", (done) => {
    const service: MOHReportService = TestBed.get(MOHReportService);

    service.generatePdf(params, rowData, sectionDefinitions).subscribe(
      (pdf) => {
        expect(pdf.pdfSrc).toBeDefined();
        expect(pdf.pdfDefinition).toBeDefined();
        expect(pdf.pdfProxy).toBeDefined();

        // now check the structure
        expect(pdf.pdfDefinition.content).toBeDefined();
        expect(pdf.pdfDefinition.styles).toBeDefined();
        expect(pdf.pdfDefinition.defaultStyle).toBeDefined();
        expect(pdf.pdfDefinition.content.length).toBeGreaterThan(1); // should have at least 1 section

        done();
      },
      (err) => {
        expect(err).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
        done();
      }
    );
  });

  it("should create pdf url successfully of correct blob type: blob:http://", (done) => {
    const service: MOHReportService = TestBed.get(MOHReportService);
    service.generatePdf(params, rowData, sectionDefinitions).subscribe(
      (pdf) => {
        expect(pdf.pdfSrc).toBeDefined();

        // Should create a blob object URL
        expect(pdf.pdfSrc).toContain("blob:http://");

        done();
      },
      (err) => {
        expect(err).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
        done();
      }
    );
  });

  it("should throw error when pdf dependencies is null or undefined", (done) => {
    const service: MOHReportService = TestBed.get(MOHReportService);
    service.generatePdf(null, null, null).subscribe(
      (pdf) => {
        expect(pdf).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
        expect(pdf.pdfSrc).not.toBeDefined();
        expect(pdf.pdfDefinition).not.toBeDefined();
        expect(pdf.pdfProxy).not.toBeDefined();

        done();
      },
      (err) => {
        expect(err).toBeDefined(); // this means it has errored, we  expect this!!!!
        expect(err).toBe("some properties are missing");
        done();
      }
    );
  });
});
