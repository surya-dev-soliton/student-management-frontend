export interface StudentFilters {
  name?: string;
  nameOperator?: 'equals' | 'notEquals';

  department?: string;
  departmentOperator?: 'equals' | 'notEquals';

  enrolmentDate?: string;
  enrolmentOperator?: 'before' | 'after';
}
