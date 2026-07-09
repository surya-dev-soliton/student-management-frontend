import { StudentStatus } from './student-status.enum';
import type { TableRecord } from '@ni/nimble-angular/table';

export interface StudentTable extends TableRecord {
  id: string;
  name: string;
  department: string;
  enrolmentDate: string;
  interests: string;
  status: StudentStatus;
}
