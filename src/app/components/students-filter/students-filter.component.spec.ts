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

      // Arrange
      component.filters = {
        name: 'John',
        nameOperator: 'equals',
        department: 'CSE',
        departmentOperator: 'equals',
        enrolmentDate: '2024-01-01',
        enrolmentOperator: 'after',
      };
     
      // Act
      component.applyFilters();

      // Assert
      expect(maintainerService.applyFilters).toHaveBeenCalledWith(component.filters);
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters to their default values', () => {
      // Arrange
      component.filters = {
        name: 'John',
        nameOperator: 'notEquals',
        department: 'ECE',
        departmentOperator: 'notEquals',
        enrolmentDate: '2024-01-01',
        enrolmentOperator: 'before',
      };

      // Act
      component.clearFilters();


      // Assert
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
      // Arrange
      component.refreshInterval = '10000';

      // Act
      component.onRefreshIntervalChange();

      // Assert
      expect(maintainerService.updateRefreshInterval).toHaveBeenCalledOnceWith(10000);
    });

    it('should update the refresh interval to 30000', () => {
      // Arrange
      component.refreshInterval = '30000';

      // Act
      component.onRefreshIntervalChange();

      // Assert
      expect(maintainerService.updateRefreshInterval).toHaveBeenCalledOnceWith(30000);
    });
  });

  describe('template', () => {
    it('should render all filter labels', () => {

      // Arrange & act
      fixture.detectChanges();

      const labels = fixture.nativeElement.querySelectorAll('label');

      // Assert
      expect(labels.length).toBe(4);

      expect(labels[0].textContent.trim()).toBe('Name');
      expect(labels[1].textContent.trim()).toBe('Department');
      expect(labels[2].textContent.trim()).toBe('Enrolment Date');
      expect(labels[3].textContent.trim()).toBe('Auto Refresh');
    });

    it('should render two nimble buttons', () => {

      // Arrange & act
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('button');

      // Assert
      expect(buttons.length).toBe(2);
    });

    it('should render all filter controls', () => {
      // Arrange & Act
      fixture.detectChanges();

      const selects =
        fixture.nativeElement.querySelectorAll('nimble-select');

      const textFields =
        fixture.nativeElement.querySelectorAll('nimble-text-field');

      const dateInput =
        fixture.nativeElement.querySelector('input[type="date"]');

      // Assert
      expect(selects.length).toBe(4);
      expect(textFields.length).toBe(2);
      expect(dateInput).toBeTruthy();
    });
  });
});
