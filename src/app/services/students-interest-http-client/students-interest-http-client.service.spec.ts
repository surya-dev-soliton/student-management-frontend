import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BASE_URL } from '../../constants/api.constants';
import { StudentsInterestHttpClient } from './students-interest-http-client.service';

describe('StudentsInterestHttpClient', () => {
  let service: StudentsInterestHttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection()],
    });

    service = TestBed.inject(StudentsInterestHttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request the student interests from the expected endpoint', () => {
    let result: unknown;

    service.getStudentInterests().subscribe((interests) => {
      result = interests;
    });

    const request = httpTestingController.expectOne(`${BASE_URL}/interests`);
    expect(request.request.method).toBe('GET');

    request.flush([{ studentId: 'student-1', interests: ['AI', 'ML'] }]);

    expect(result).toEqual([{ studentId: 'student-1', interests: ['AI', 'ML'] }]);
  });

  it('should delete interests for a student from the expected endpoint', () => {
    let deleted = false;

    service.deleteStudentInterests('student-1').subscribe(() => {
      deleted = true;
    });

    const request = httpTestingController.expectOne(`${BASE_URL}/interests/student-1`);
    expect(request.request.method).toBe('DELETE');

    request.flush(null);

    expect(deleted).toBeTrue();
  });
});
