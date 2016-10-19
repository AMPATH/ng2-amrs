import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { UtilsModule } from '../utils/utils.module';
import { AppSettingsComponent } from './app-settings.component';
import { AppSettingsService } from './app-settings.service';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

describe('AppSettingsComponent Tests', () => {
  let comp:    AppSettingsComponent;
  let fixture: ComponentFixture<AppSettingsComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, Ng2Bs3ModalModule, UtilsModule ],
      declarations: [ AppSettingsComponent ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AppSettingsService,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AppSettingsComponent);
      comp = fixture.componentInstance;
      debugElement = fixture.debugElement.query(By.css('div .form-group'));
    });
  }));

  it('AppSettingsComponent should exist', () => {
    expect(comp).toBeTruthy;
  });

  it('Should display default Openmrs server url', () => {
    fixture.detectChanges();
    expect(debugElement.nativeElement.textContent).toContain(comp.openmrsServerUrls[0]);
  });
  
  it('Should display default ETL server url', () => {
    fixture.autoDetectChanges();
    let formElements = fixture.debugElement.queryAll(By.css('div .form-group'));
    expect(formElements[1].nativeElement.textContent).toContain(comp.etlServerUrls[0]);
  });
});
