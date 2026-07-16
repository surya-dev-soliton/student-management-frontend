import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { StudentTableMaintainerService } from '../../services/students-table-maintainer-service/students-table-maintainer.service';
import { NimbleTableModule } from '@ni/nimble-angular/table';
import { NimbleTableColumnTextModule } from '@ni/nimble-angular/table-column/text';
import {
  MenuButtonColumnToggleEventDetail,
  NimbleTableColumnMenuButtonModule,
} from '@ni/nimble-angular/table-column/menu-button';
import { NimbleMenuModule, NimbleMenuItemModule } from '@ni/nimble-angular';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [
    CommonModule,
    NimbleTableModule,
    NimbleTableColumnTextModule,
    NimbleTableColumnMenuButtonModule,
    NimbleMenuModule,
    NimbleMenuItemModule,
    NimbleTableColumnMenuButtonModule,
  ],
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudentsTableComponent {
  private readonly studentsTableMaintainerService = inject(StudentTableMaintainerService);

  readonly studentDetails$ = this.studentsTableMaintainerService.studentDetails$;
  activeMenuStudentId: string | null = null;

  onMenuBeforeToggle(event: Event): void {
    const detail = (event as CustomEvent<MenuButtonColumnToggleEventDetail>).detail;
    if (detail.newState) {
      this.activeMenuStudentId = detail.recordId;
    }
  }

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
