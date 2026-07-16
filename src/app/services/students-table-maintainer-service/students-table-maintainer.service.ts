import { inject, Injectable } from '@angular/core';
import { StudentsHttpClient } from '../students-http-client/students-http-client.service';
import { StudentsInterestHttpClient } from '../students-interest-http-client/students-interest-http-client.service';
import { BehaviorSubject, combineLatest, forkJoin, map, Observable, switchMap, timer } from 'rxjs';
import { StudentTable } from '../../models/student-table.model';
import { StudentStatus } from '../../models/student-status.enum';
import { StudentFilters } from '../../models/student-filter.model';

@Injectable({
  providedIn: 'root',
})
export class StudentTableMaintainerService {
  private readonly studentsHttpClient = inject(StudentsHttpClient);

  private readonly studentsInteresetHttpClient = inject(StudentsInterestHttpClient);

  private readonly filtersSubject = new BehaviorSubject<StudentFilters>({});

  private readonly refreshIntervalSubject = new BehaviorSubject<number>(5000);

  applyFilters(filters: StudentFilters): void {
    this.filtersSubject.next(filters);
  }

  updateRefreshInterval(interval: number): void {
    this.refreshIntervalSubject.next(interval);
  }

  readonly studentDetails$: Observable<StudentTable[]> = this.refreshIntervalSubject.pipe(
    switchMap((interval) => combineLatest([timer(0, interval), this.filtersSubject])),
    switchMap(([_, filters]) =>
      forkJoin({
        students: this.studentsHttpClient.getStudents(filters),
        interests: this.studentsInteresetHttpClient.getStudentInterests(),
      }),
    ),
    map(({ students, interests }) =>
      students.map((student) => {
        const studentInterest = interests.find((interest) => interest.studentId === student.id);

        return {
          ...student,
          interests: (studentInterest?.interests ?? []).join(', '),
          status: this.calculateStatus(student.enrolmentDate),
          actionsLabel: '⋮',
        };
      }),
    ),
  );

  deleteStudent(studentId: string): Observable<void> {
    return this.studentsHttpClient.deleteStudent(studentId);
  }

  private calculateStatus(enrolmentDate: string): StudentStatus {
    const today = new Date();

    const enrolled = new Date(enrolmentDate);

    if (enrolled > today) {
      return StudentStatus.Upcoming;
    }

    const years = (today.getTime() - enrolled.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    if (years > 6) {
      return StudentStatus.Alumni;
    }

    if (years >= 4) {
      return StudentStatus.RecentPassOut;
    }

    return StudentStatus.CurrentStudent;
  }
}
