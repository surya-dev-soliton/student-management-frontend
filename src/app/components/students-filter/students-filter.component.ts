import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StudentFilters } from '../../models/student-filter.model';
import { StudentTableMaintainerService } from '../../services/students-table-maintainer-service/students-table-maintainer.service';
import { NimbleSelectModule, NimbleTextFieldModule } from '@ni/nimble-angular';

@Component({
  selector: 'app-students-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, NimbleTextFieldModule, NimbleSelectModule],
  templateUrl: './students-filter.component.html',
  styleUrls: ['./students-filter.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudentsFilterComponent {
  private readonly studentsTableMaintainerService = inject(StudentTableMaintainerService);

  readonly filters: StudentFilters = {
    name: '',
    nameOperator: 'equals',

    department: '',
    departmentOperator: 'equals',

    enrolmentDate: '',
    enrolmentOperator: 'after',
  };

  refreshInterval = '5000';

  onRefreshIntervalChange(): void {
    this.studentsTableMaintainerService.updateRefreshInterval(Number(this.refreshInterval));
  }

  applyFilters(): void {
    this.studentsTableMaintainerService.applyFilters({
      ...this.filters,
    });
  }

  clearFilters(): void {
    this.filters.name = '';
    this.filters.department = '';
    this.filters.enrolmentDate = '';

    this.filters.nameOperator = 'equals';
    this.filters.departmentOperator = 'equals';
    this.filters.enrolmentOperator = 'after';

    this.studentsTableMaintainerService.applyFilters({
      ...this.filters,
    });
  }
}
