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
    // Arrange
    let actualResult: unknown;
    const expectedInterests = [
      {
        studentId: 'student-1',
        interests: ['AI', 'ML'],
      },
    ];
    const endpoint = `${BASE_URL}/interests`

    // Act
    service.getStudentInterests().subscribe((interests) => {
      actualResult = interests;
    });

    const request = httpTestingController.expectOne(endpoint);
    request.flush(expectedInterests);
    
    // Assert
    expect(request.request.method).toBe('GET');
    expect(actualResult).toEqual(expectedInterests);
  });
});
