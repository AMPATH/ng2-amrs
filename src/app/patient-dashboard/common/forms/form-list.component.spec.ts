import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { Ng2FilterPipe } from '../../../shared/pipes/ng2-filter.pipe';

import { FormListService } from './form-list.service';
import { FormListComponent } from './form-list.component';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { forms } from './forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
  transform(value: any, decimalPlaces: number): any {
    return value;
  }
}

describe('FormList Component', () => {
  const fakeChangeDetectorRef = {
    markForCheck: () => {}
  };

  let fixture, nativeElement, comp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FormListComponent, FakeTranslatePipe, Ng2FilterPipe],
      providers: [
        LocalStorageService,
        AppSettingsService,
        { provide: ChangeDetectorRef, useValue: fakeChangeDetectorRef },
        FormsResourceService,
        FormOrderMetaDataService,
        FormListService
      ],
      imports: [HttpClientTestingModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormListComponent);
        comp = fixture.componentInstance;
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should defined', inject([FormListService], (service: FormListService) => {
    expect(comp).toBeDefined();
  }));
  it('should render form list properly given the forms are available', inject(
    [FormListService, FormOrderMetaDataService, FormsResourceService],
    (
      service: FormListService,
      formOrderMetaDataService: FormOrderMetaDataService,
      formsResourceService: FormsResourceService
    ) => {
      const favourite = [
        {
          name: 'form 5'
        },
        {
          name: 'form 3'
        }
      ];

      const defualtOrdering = [
        {
          name: 'form 2'
        },
        {
          name: 'form 3'
        }
      ];

      const expectedFormsList = [
        {
          name: 'form 2',
          display: 'form 2',
          published: true,
          uuid: 'uuid2',
          version: '1.0',
          favourite: false
        },
        {
          name: 'form 1',
          display: 'form 1',
          published: true,
          uuid: 'uuid',
          version: '1.0',
          favourite: false
        },
        {
          name: 'form 4',
          display: 'form 4',
          published: true,
          uuid: 'uuid4',
          version: '1.0',
          favourite: false
        }
      ];

      const favouriteFormsSpy = spyOn(
        formOrderMetaDataService,
        'getFavouriteForm'
      ).and.returnValue(of(favourite));
      const defaultOrderSpy = spyOn(
        formOrderMetaDataService,
        'getDefaultFormOrder'
      ).and.returnValue(of(defualtOrdering));
      const formListSpy = spyOn(
        formsResourceService,
        'getForms'
      ).and.returnValue(of(forms));
      const formServiceSpy = spyOn(service, 'getFormList').and.returnValue(
        of(forms)
      );
      const toggleFavouriteSpy = spyOn(comp, 'toggleFavourite');
      const formSelectedSypy = spyOn(comp, 'formSelected');

      comp.ngOnInit();
      fixture.detectChanges();
      const formList = nativeElement.querySelectorAll('.list-group-item');
      expect(comp.forms).toBeTruthy();
      expect(comp.forms.length).toEqual(6);
      expect(formList).toBeTruthy();
      expect(formList.length).toEqual(6);
      expect(formList[0].innerHTML).toContain('form 1');
    }
  ));
});
