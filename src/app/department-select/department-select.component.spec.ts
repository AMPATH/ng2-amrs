import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { DepartmentSelectComponent } from "./department-select.component";
import { LocalStorageService } from "src/app/utils/local-storage.service";
import { RouterTestingModule } from "@angular/router/testing";

describe("Department-select component Tests", () => {
  let comp: DepartmentSelectComponent;
  let fixture: ComponentFixture<DepartmentSelectComponent>;

  // tslint:disable:quotemark

  const routes = [
    {
      path: "clinic-dashboard",
      component: DepartmentSelectComponent,
    },
  ];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [LocalStorageService],
      declarations: [DepartmentSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentSelectComponent);
    comp = fixture.componentInstance;
  });

  it("should be defined", () => {
    expect(comp).toBeDefined();
  });

  it("should have required properties", () => {
    expect(comp.departments).toBeUndefined();
    expect(comp.currentDepartment).toBeDefined();
    expect(comp.clinicDashboardDepts).toBeDefined();
    expect(comp.setDefaultDepartment).toBeDefined();
    expect(comp.getCurrentDepartment).toBeDefined();
  });

  it("should filter clinic dashboard departments", () => {
    const dashRoute = "/clinic-dashboard";
    const departments = [
      {
        departmentName: "HIV",
        baseRoute: "hiv",
      },
      {
        departmentName: "HEMATO-ONCOLOGY",
        baseRoute: "oncology",
      },
      {
        departmentName: "CDM",
        baseRoute: "cdm",
      },
    ];
    const filteredDepts = [
      {
        name: "HIV",
        baseRoute: "hiv",
      },
      {
        name: "HEMATO-ONCOLOGY",
        baseRoute: "oncology",
      },
      {
        name: "CDM",
        baseRoute: "cdm",
      },
    ];
    comp.clinicDashboardDepts(departments, dashRoute);
    expect(comp.departments).toEqual(filteredDepts);
  });

  it("should set session default department", async(() => {
    const service = new LocalStorageService();
    const defaultDepartment = {
      name: "HIV",
      id: "hiv",
    };

    const departmentObj = [
      {
        itemName: "HIV",
        id: "",
      },
    ];
    comp.dashRoute = "/clinic-dashboard";
    comp.setDefaultDepartment(defaultDepartment);
    fixture.detectChanges();
    const sessionDept = service.getObject("userDefaultDepartment");
    expect(sessionDept).toEqual(departmentObj);
  }));

  it("should get  current department", () => {
    comp.getCurrentDepartment();
    expect(comp.currentDepartment).toBe("HIV");
  });
});
