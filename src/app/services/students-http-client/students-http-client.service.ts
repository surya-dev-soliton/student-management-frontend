import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '../../constants/api.constants';
import { Student } from '../../models/student.model';
import { StudentFilters } from '../../models/student-filter.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsHttpClient {
  private readonly http = inject(HttpClient);

  getStudents(filters?: StudentFilters): Observable<Student[]> {
    let params = new HttpParams();

    if (filters?.name) {
      params = params
        .set('name', filters.name)
        .set('nameOperator', filters.nameOperator ?? 'equals');
    }

    if (filters?.department) {
      params = params
        .set('department', filters.department)
        .set('departmentOperator', filters.departmentOperator ?? 'equals');
    }

    if (filters?.enrolmentDate) {
      params = params
        .set('enrolmentDate', filters.enrolmentDate)
        .set('enrolmentOperator', filters.enrolmentOperator ?? 'after');
    }

    return this.http.get<Student[]>(`${BASE_URL}/students`, {
      params,
    });
  }

  deleteStudent(studentId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/students/${studentId}`);
  }
}
