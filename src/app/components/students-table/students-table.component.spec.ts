import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentTable } from '../../models/student-table.model';
import { StudentStatus } from '../../models/student-status.enum';
import { StudentTableMaintainerService } from '../../services/students-table-maintainer-service/students-table-maintainer.service';
import { StudentsTableComponent } from './students-table.component';

class StudentsTablePageObject {
  constructor(private readonly fixture: ComponentFixture<StudentsTableComponent>) {}

  get table(): HTMLElement | null {
    return this.fixture.nativeElement.querySelector(
        '[data-testid="students-table"]'
    );
  }

  get menuButton(): HTMLElement | null {
    return this.fixture.nativeElement.querySelector(
        'nimble-table-column-menu-button'
    );
  }

  get deleteMenuItem(): HTMLElement | null {
    return this.fixture.nativeElement.querySelector(
        'nimble-menu-item'
    );
  }
}

describe('StudentsTableComponent', () => {
  let fixture: ComponentFixture<StudentsTableComponent>;
  let pageObject: StudentsTablePageObject;
  let maintainerService: jasmine.SpyObj<StudentTableMaintainerService>;

  const students: StudentTable[] = [
    {
      id: 'student-1',
      name: 'Ada Lovelace',
      department: 'Computer Science',
      enrolmentDate: '2020-01-01',
      interests: 'AI, ML',
      status: StudentStatus.Alumni,
       actionsLabel: '⋮',
    },
    {
      id: 'student-2',
      name: 'Grace Hopper',
      department: 'Engineering',
      enrolmentDate: '2024-01-01',
      interests: 'Cloud',
      status: StudentStatus.CurrentStudent,
       actionsLabel: '⋮',
    },
  ];

  beforeEach(async () => {
    maintainerService = jasmine.createSpyObj(
      'StudentTableMaintainerService',
      ['deleteStudent'],
      {
        studentDetails$: of(students),
      },
    );

    maintainerService.deleteStudent.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [StudentsTableComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: StudentTableMaintainerService,
          useValue: maintainerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsTableComponent);
    pageObject = new StudentsTablePageObject(fixture);
    fixture.detectChanges();
  });

  it('should expose the student details stream and render the table', () => {
    // Arrange
    const component = fixture.componentInstance;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.studentDetails$).toBeDefined();
    expect(pageObject.table).toBeTruthy();
  });

  it('should call deleteStudent on the maintainer service', () => {
    // Arrange
    const studentId = 'student-1';

    // Act
    fixture.componentInstance.deleteStudent(studentId);

    // Assert
    expect(maintainerService.deleteStudent).toHaveBeenCalledOnceWith(studentId);
  });
});
