import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { StudentTableMaintainerService } from '../../services/students-table-maintainer-service/students-table-maintainer.service';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudentsTableComponent {
  private readonly studentsTableMaintainerService = inject(StudentTableMaintainerService);

  readonly studentDetails$ = this.studentsTableMaintainerService.studentDetails$;
  activeMenuStudentId: string | null = null;

  toggleMenu(studentId: string): void {
    this.activeMenuStudentId = this.activeMenuStudentId === studentId ? null : studentId;
  }

  deleteStudent(studentId: string): void {
    this.activeMenuStudentId = null;

    this.studentsTableMaintainerService.deleteStudent(studentId).subscribe({
      next: () => {
        console.log('Student deleted successfully');
      },
      error: (error) => {
        console.error('Failed to delete student', error);
      },
    });
  }
}
