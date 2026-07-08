import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentsFilterComponent } from './students-filter.component';
import { StudentTableMaintainerService } from '../../services/students-table-maintainer-service/students-table-maintainer.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('StudentsFilterComponent', () => {
  let component: StudentsFilterComponent;
  let fixture: ComponentFixture<StudentsFilterComponent>;

  let maintainerService: jasmine.SpyObj<StudentTableMaintainerService>;

  beforeEach(async () => {
    maintainerService = jasmine.createSpyObj<StudentTableMaintainerService>(
      'StudentTableMaintainerService',
      ['applyFilters', 'updateRefreshInterval'],
    );

    await TestBed.configureTestingModule({
      imports: [StudentsFilterComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: StudentTableMaintainerService,
          useValue: maintainerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyFilters', () => {
    it('should call applyFilters on the maintainer service', () => {
      component.filters.name = 'John';
      component.filters.nameOperator = 'equals';

      component.filters.department = 'CSE';
      component.filters.departmentOperator = 'equals';

      component.filters.enrolmentDate = '2024-01-01';
      component.filters.enrolmentOperator = 'after';

      component.applyFilters();

      expect(maintainerService.applyFilters).toHaveBeenCalledWith({
        name: 'John',
        nameOperator: 'equals',
        department: 'CSE',
        departmentOperator: 'equals',
        enrolmentDate: '2024-01-01',
        enrolmentOperator: 'after',
      });
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters to their default values', () => {
      component.filters.name = 'John';
      component.filters.department = 'ECE';
      component.filters.enrolmentDate = '2024-01-01';

      component.filters.nameOperator = 'notEquals';
      component.filters.departmentOperator = 'notEquals';
      component.filters.enrolmentOperator = 'before';

      component.clearFilters();

      expect(component.filters).toEqual({
        name: '',
        nameOperator: 'equals',

        department: '',
        departmentOperator: 'equals',

        enrolmentDate: '',
        enrolmentOperator: 'after',
      });
    });
  });

  describe('onRefreshIntervalChange', () => {
    it('should update the refresh interval', () => {
      component.refreshInterval = 10000;

      component.onRefreshIntervalChange();

      expect(maintainerService.updateRefreshInterval).toHaveBeenCalledOnceWith(10000);
    });

    it('should update the refresh interval to 30000', () => {
      component.refreshInterval = 30000;

      component.onRefreshIntervalChange();

      expect(maintainerService.updateRefreshInterval).toHaveBeenCalledOnceWith(30000);
    });
  });

  describe('template', () => {
    it('should render all filter labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('label');

      expect(labels.length).toBe(4);

      expect(labels[0].textContent.trim()).toBe('Name');
      expect(labels[1].textContent.trim()).toBe('Department');
      expect(labels[2].textContent.trim()).toBe('Enrolment Date');
      expect(labels[3].textContent.trim()).toBe('Auto Refresh');
    });

    it('should render two buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(buttons.length).toBe(2);

      expect(buttons[0].textContent.trim()).toBe('Apply Filters');
      expect(buttons[1].textContent.trim()).toBe('Clear');
    });

    it('should render three text/select filter groups and one refresh dropdown', () => {
      const selects = fixture.nativeElement.querySelectorAll('select');
      const inputs = fixture.nativeElement.querySelectorAll('input');

      expect(selects.length).toBe(4);
      expect(inputs.length).toBe(3);
    });
  });
});
