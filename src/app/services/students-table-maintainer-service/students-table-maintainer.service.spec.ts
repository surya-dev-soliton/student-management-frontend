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
    let rows: Array<{ interests: string; status: StudentStatus }> = [];

    service.studentDetails$.pipe(take(1)).subscribe((result) => {
      rows = result;
      expect(rows[0].interests).toBe('AI, ML');
      expect(rows[0].status).toBe(StudentStatus.Alumni);
      done();
    });

    setTimeout(() => {
      const studentsRequest = httpTestingController.expectOne(`${BASE_URL}/students`);
      studentsRequest.flush([
        {
          id: 'student-1',
          name: 'Ada Lovelace',
          department: 'Computer Science',
          enrolmentDate: '2020-01-01',
        },
      ]);

      const interestsRequest = httpTestingController.expectOne(`${BASE_URL}/interests`);
      interestsRequest.flush([{ studentId: 'student-1', interests: ['AI', 'ML'] }]);
    }, 0);
  });

  it('should delete a student and their interests using the expected endpoints', () => {
    let completed = false;

    service.deleteStudent('student-1').subscribe({
      next: () => {
        completed = true;
      },
    });

    const studentDeleteRequest = httpTestingController.expectOne(`${BASE_URL}/students/student-1`);
    studentDeleteRequest.flush(null);

    const interestDeleteRequest = httpTestingController.expectOne(
      `${BASE_URL}/interests/student-1`,
    );
    interestDeleteRequest.flush(null);

    expect(completed).toBeTrue();
  });
});
