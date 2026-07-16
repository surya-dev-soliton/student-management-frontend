import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';
import { BASE_URL } from '../../constants/api.constants';
import { StudentStatus } from '../../models/student-status.enum';
import { StudentTableMaintainerService } from './students-table-maintainer.service';

describe('StudentTableMaintainerService', () => {
  let service: StudentTableMaintainerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection()],
    });

    service = TestBed.inject(StudentTableMaintainerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should map combined student and interest data into table rows with calculated statuses', (done) => {
    // Arrange
    let actualRows: any[] = [];

    const expectedStudents = [
      {
        id: 'student-1',
        name: 'Ada Lovelace',
        department: 'Computer Science',
        enrolmentDate: '2018-01-01',
      },
    ];

    const expectedInterests = [
      {
        studentId: 'student-1',
        interests: ['AI', 'ML'],
      },
    ];

    // Act
    service.studentDetails$.pipe(take(1)).subscribe((rows) => {
      actualRows = rows;
    });

    const studentsRequest = httpTestingController.expectOne(`${BASE_URL}/students`);
    studentsRequest.flush(expectedStudents);

    const interestsRequest = httpTestingController.expectOne(`${BASE_URL}/interests`);
    interestsRequest.flush(expectedInterests);

    // Assert
    expect(actualRows.length).toBe(1);
    expect(actualRows[0].interests).toBe('AI, ML');
    expect(actualRows[0].status).toBe(StudentStatus.Alumni);
    expect(actualRows[0].actionsLabel).toBe('⋮');

    done();
  });

  it('should delete a student using the expected endpoint', () => {
    // Arrange
    let deleted = false;
    const studentId = 'student-1';
    const endpoint = `${BASE_URL}/students/${studentId}`

    // Act
    service.deleteStudent(studentId).subscribe(() => {
      deleted = true;
    });

    const request = httpTestingController.expectOne(endpoint);

    request.flush(null);

    // Assert
    expect(request.request.method).toBe('DELETE');
    expect(deleted).toBeTrue();
  });
});
