import { Record as AirtableRecord, Table } from '@airtable/blocks/models';
import { FieldId, RecordId } from '@airtable/blocks/types';
import createPreferenceLists from '../core/createPreferenceLists';
import runGaleShapley from '../core/runGaleShapley';
import { FIELD } from '../util/constants';
import { FieldMapping, Person, PersonRecord, Store } from '../util/types';
import { chunkifyArray, formatRecords } from '../util/util';
import useLazyFetchRecords from './useLazyFetchRecords';
import useStore from './useStore';
import useTable from './useTable';

type UpdateRecordsData = {
  readonly id: RecordId;
  readonly fields: Record<FieldId | string, unknown>;
};

/**
 * Returns an async function that retrieves mentee/mentor records from Airtable,
 * formats them into objects, runs the Gale Shapley algorithm on the
 * formatted objects and updates the mentee records with their appropriate
 * mentors.
 */
const useUpdateMenteeRecords = (): (() => Promise<void>) => {
  const {
    fieldMappingIds,
    fieldMappings,
    menteesPreferenceFieldId,
    menteesTableId,
    menteesTableLinkedFieldId,
    mentorsTableId
  }: Store = useStore();

  const menteesTable: Table = useTable(menteesTableId);
  const mentorsTable: Table = useTable(mentorsTableId);

  const fetchMenteeRecords = useLazyFetchRecords(menteesTable);
  const fetchMentorRecords = useLazyFetchRecords(mentorsTable);

  const updateMenteeRecords = async () => {
    // Consolidate all of the fieldIds that we need from the mentees table.
    const menteeFieldIds: string[] = fieldMappingIds.map(
      (mappingId: string) => {
        const fieldMapping: FieldMapping = fieldMappings[mappingId];
        return fieldMapping[FIELD.MENTEES_FIELD_ID];
      }
    );

    // Consolidate all of the fieldIds that we need from the mentors table.
    const mentorFieldIds: string[] = fieldMappingIds.map(
      (mappingId: string) => {
        const fieldMapping: FieldMapping = fieldMappings[mappingId];
        return fieldMapping[FIELD.MENTORS_FIELD_ID];
      }
    );

    const [menteeRecords, mentorRecords]: [AirtableRecord[], AirtableRecord[]] =
      await Promise.all([
        fetchMenteeRecords([...menteeFieldIds, menteesPreferenceFieldId]),
        fetchMentorRecords([...mentorFieldIds])
      ]);

    const formattedMenteeRecords: PersonRecord[] = formatRecords({
      fieldIds: menteeFieldIds,
      fieldMappings,
      preferenceFieldId: menteesPreferenceFieldId,
      records: menteeRecords,
      table: menteesTable
    });

    const formattedMentorRecords: PersonRecord[] = formatRecords({
      fieldIds: mentorFieldIds,
      fieldMappings,
      records: mentorRecords,
      table: mentorsTable
    });

    const [mentees, mentors]: [Person[], Person[]] = createPreferenceLists(
      formattedMenteeRecords,
      formattedMentorRecords
    );

    const matches: [string, string][] = runGaleShapley(mentees, mentors);

    const recordsToUpdate: UpdateRecordsData[] = matches.map(
      ([menteeId, mentorId]: [string, string]) => ({
        fields: { [menteesTableLinkedFieldId]: [{ id: mentorId }] },
        id: menteeId
      })
    );

    // Split the update records into chunks of 50 to abide by Airtable's
    // rate limiting guidelines.
    const batches: UpdateRecordsData[][] = chunkifyArray(recordsToUpdate, 50);

    // Have to run these batches synchronously, instead of in parallel
    // (Promise.all) in order to stay under the rate limit.
    // eslint-disable-next-line no-restricted-syntax
    for (const batch of batches) {
      // eslint-disable-next-line no-await-in-loop
      await menteesTable.updateRecordsAsync(batch);
    }
  };

  return updateMenteeRecords;
};

export default useUpdateMenteeRecords;
