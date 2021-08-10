import { Record, Table, TableOrViewQueryResult } from '@airtable/blocks/models';

/**
 * Returns an async function to fetch records from an Airtable Table.
 *
 * @param table - Table to return records from.
 */
const useLazyFetchRecords =
  (table: Table): ((fields: string[]) => Promise<Record[]>) =>
  async (fields: string[]): Promise<Record[]> => {
    const query: TableOrViewQueryResult = await table.selectRecordsAsync({
      fields
    });

    const { records } = query;
    query.unloadData();
    return records;
  };

export default useLazyFetchRecords;
