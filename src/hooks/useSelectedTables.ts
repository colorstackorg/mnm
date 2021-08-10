import { Table } from '@airtable/blocks/models';
import { Store } from '../util/types';
import useStore from './useStore';
import useTable from './useTable';

/**
 * Returns a 2-tuple of the selected "mentees" and "mentors" tables.
 */
const useSelectedTables = (): [Table, Table] => {
  const { menteesTableId, mentorsTableId }: Store = useStore();

  const menteesTable: Table = useTable(menteesTableId);
  const mentorsTable: Table = useTable(mentorsTableId);

  return [menteesTable, mentorsTable];
};

export default useSelectedTables;
