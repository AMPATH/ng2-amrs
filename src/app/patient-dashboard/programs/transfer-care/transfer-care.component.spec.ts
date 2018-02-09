

import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Http, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MdTabsModule } from '@angular/material';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import { ProgramsTransferCareService } from './transfer-care.service';
import { PatientProgramService } from '../patient-programs.service';
import { ProgramsTransferCareComponent } from './transfer-care.component';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { ProgramService } from '../program.service';
import { ProgramsContainerComponent } from '../programs-container.component';
import { DepartmentProgramsConfigService } from
'./../../../etl-api/department-programs-config.service';
import { DataCacheService } from './../../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}

describe('Component: ProgramsTransferCareComponent', () => {
  let fixture, component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        ProgramService,
        DepartmentProgramsConfigService,
        DataCacheService,
        CacheService,
        Location,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        ProgramsTransferCareService,
        PatientProgramService,
        MockBackend,
        BaseRequestOptions
      ],
      declarations: [ProgramsContainerComponent, ProgramsTransferCareComponent],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [FormsModule, NgamrsSharedModule, RouterTestingModule.withRoutes([]), MdTabsModule ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProgramsTransferCareComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', (done) => {
    expect(component).toBeDefined();
    done();
  });

  it('should add program to programsToTransfer', (done) => {
    spyOn(component, 'addToTransfer').and.callThrough();
    let programs = [{
      programUuid: '781d85b0-1359-11df-a1f1-0026b9348838',
      program: {
        display: 'STANDARD HIV TREATMENT'
      },
      isEnrolled: true,
      enrolledProgram: {
        location: {
          display: 'Location test',
        },
        dateEnrolled: '2017-11-06'
      }
    }];
    component.currentDepartmentEnrollments = programs;
    fixture.detectChanges();
    component.addToTransfer(programs[0]);
    expect(component.programsToTransfer.length).toBe(1);
    expect(component.programsToTransfer[0]['transfer']).toBeDefined();
    done();
  });

  it('should get enrolled programs by department',
    inject([PatientProgramService, PatientService, DepartmentProgramsConfigService , MockBackend],
      fakeAsync((patientProgramService, patientService, departmentProgramsConfigService,
                 mockBackend) => {
        spyOn(component, 'getSelectedDepartment').and.callThrough();
        let uuid: string = 'uuid';
        let patientObject: Patient = new Patient({uuid: uuid, encounters: []});

        // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the first time
        patientService.currentlyLoadedPatient.next(patientObject);
        patientService.currentlyLoadedPatientUuid.next(uuid);
        let programsResponse = [{
            programUuid: '781d85b0-1359-11df-a1f1-0026b9348838',
            program: {
              display: 'STANDARD HIV TREATMENT'
            },
            isEnrolled: true,
            enrolledProgram: {
              location: {
                display: 'Location test',
              },
              dateEnrolled: '2017-11-06'
            }
          }];
        mockBackend.connections.subscribe((conn) => {
          conn.mockRespond(new Response(
           new ResponseOptions({body: JSON.stringify(programsResponse)})));
        });
        // component.getSelectedDepartment('HIV');
        fixture.detectChanges();
      })));
});
