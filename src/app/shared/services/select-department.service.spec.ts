import { TestBed } from '@angular/core/testing';
import { SelectDepartmentService } from './select-department.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { BehaviorSubject } from 'rxjs';

describe('Service : Select Department Unit Tests', () => {
    let selectDepartmentService: SelectDepartmentService;
    let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
    const mockSelectedDepartmentSource = new BehaviorSubject<string>('CDM');
    const mockDefaultDepartment = [
        {
            itemName : 'CDM',
            id : 1
        }
    ];
    beforeEach(() => {
        const localStoragespy = jasmine.createSpyObj('LocalStorageService', ['getItem']);

        TestBed.configureTestingModule(
            {
                providers: [
                    SelectDepartmentService,
                    {
                        provide: LocalStorageService,
                        useValue: localStoragespy
                    }
                ]
            });
            selectDepartmentService = TestBed.get(SelectDepartmentService);
            localStorageServiceSpy = TestBed.get(LocalStorageService);
    });
    it('should return user set department', () => {
        localStorageServiceSpy.getItem.and.callFake((arg) => {
            if (arg === 'userDefaultDepartment') {
                return JSON.stringify(mockDefaultDepartment);
            } else {
                return undefined;
            }
        });

        expect(selectDepartmentService.getUserSetDepartment()).toBe('CDM', 'service returned stub value');
    });
    it('should set and emit correct department', () => {

        selectDepartmentService.setDepartment('CDM');
        expect(selectDepartmentService.selectedDepartmentSource).toEqual(mockSelectedDepartmentSource);
    });
});
