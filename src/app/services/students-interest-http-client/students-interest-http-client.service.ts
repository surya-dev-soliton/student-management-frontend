import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentInterest } from '../../models/student-interest.model';
import { BASE_URL } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class StudentsInterestHttpClient {
  private readonly http = inject(HttpClient);

  getStudentInterests(): Observable<StudentInterest[]> {
    return this.http.get<StudentInterest[]>(`${BASE_URL}/interests`);
  }

  deleteStudentInterests(studentId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/interests/${studentId}`);
  }
}
