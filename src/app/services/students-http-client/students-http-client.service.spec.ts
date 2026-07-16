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

    // Arrange
    let result: unknown;
    const mockStudents = [
      { id: 'student-1', name: 'Ada Lovelace', department: 'CS', enrolmentDate: '2020-01-01' }
    ]
    const endpoint = `${BASE_URL}/students`

    // Act
    service.getStudents().subscribe((students) => {
      result = students;
    });

    const request = httpTestingController.expectOne(endpoint);
    request.flush(mockStudents);
    
    // Assert
    expect(request.request.method).toBe('GET');
    expect(result).toEqual(mockStudents);
  });

  it('should delete a student from the expected endpoint', () => {

    // Arrange
    let deleted = false;
    const studentId = "student-1"
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
