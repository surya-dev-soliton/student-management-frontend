import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BASE_URL } from '../../constants/api.constants';
import { StudentsHttpClient } from './students-http-client.service';

describe('StudentsHttpClient', () => {
  let service: StudentsHttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection()],
    });

    service = TestBed.inject(StudentsHttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request the student list from the expected endpoint', () => {
    let result: unknown;

    service.getStudents().subscribe((students) => {
      result = students;
    });

    const request = httpTestingController.expectOne(`${BASE_URL}/students`);
    expect(request.request.method).toBe('GET');

    request.flush([
      { id: 'student-1', name: 'Ada Lovelace', department: 'CS', enrolmentDate: '2020-01-01' },
    ]);

    expect(result).toEqual([
      { id: 'student-1', name: 'Ada Lovelace', department: 'CS', enrolmentDate: '2020-01-01' },
    ]);
  });

  it('should delete a student from the expected endpoint', () => {
    let deleted = false;

    service.deleteStudent('student-1').subscribe(() => {
      deleted = true;
    });

    const request = httpTestingController.expectOne(`${BASE_URL}/students/student-1`);
    expect(request.request.method).toBe('DELETE');

    request.flush(null);

    expect(deleted).toBeTrue();
  });
});
