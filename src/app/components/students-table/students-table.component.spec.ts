import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentTable } from '../../models/student-table.model';
import { StudentStatus } from '../../models/student-status.enum';
import { StudentTableMaintainerService } from '../../services/students-table-maintainer-service/students-table-maintainer.service';
import { StudentsTableComponent } from './students-table.component';

class StudentsTablePageObject {
  constructor(private readonly fixture: ComponentFixture<StudentsTableComponent>) {}

  get tableRows(): HTMLTableRowElement[] {
    return Array.from(this.fixture.nativeElement.querySelectorAll('tbody tr'));
  }

  get kebabButtons(): HTMLButtonElement[] {
    return Array.from(this.fixture.nativeElement.querySelectorAll('button.kebab-button'));
  }

  openFirstMenu(): void {
    this.kebabButtons[0].click();
    this.fixture.detectChanges();
  }

  get menuActions(): string[] {
    return Array.from(
      this.fixture.nativeElement.querySelectorAll('.menu button') as NodeListOf<HTMLButtonElement>,
    ).map((button: HTMLButtonElement) => button.textContent?.trim() ?? '');
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
    },
    {
      id: 'student-2',
      name: 'Grace Hopper',
      department: 'Engineering',
      enrolmentDate: '2024-01-01',
      interests: 'Cloud',
      status: StudentStatus.CurrentStudent,
    },
  ];

  beforeEach(async () => {
    maintainerService = jasmine.createSpyObj('StudentTableMaintainerService', ['deleteStudent'], {
      studentDetails$: of(students),
    });

    await TestBed.configureTestingModule({
      imports: [StudentsTableComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: StudentTableMaintainerService, useValue: maintainerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsTableComponent);
    pageObject = new StudentsTablePageObject(fixture);
    fixture.detectChanges();
  });

  it('should render the student data and expose the student details stream', () => {
    expect(fixture.componentInstance.studentDetails$).toBeDefined();
    expect(pageObject.tableRows.length).toBe(2);
    expect(pageObject.tableRows[0].textContent).toContain('Ada Lovelace');
    expect(pageObject.tableRows[0].textContent).toContain('Computer Science');
  });

  it('should expose a delete action from the kebab menu and call the service', () => {
    pageObject.openFirstMenu();

    expect(pageObject.menuActions).toContain('Delete');

    maintainerService.deleteStudent.and.returnValue(of(void 0));

    const deleteButton = fixture.nativeElement.querySelector('.menu button') as HTMLButtonElement;
    deleteButton.click();

    expect(maintainerService.deleteStudent).toHaveBeenCalledWith('student-1');
  });
});
