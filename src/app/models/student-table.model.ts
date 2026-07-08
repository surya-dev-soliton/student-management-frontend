import { StudentStatus } from './student-status.enum';

export interface StudentTable {
  id: string;
  name: string;
  department: string;
  enrolmentDate: string;
  interests: string;
  status: StudentStatus;
}
