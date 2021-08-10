import {
  Field,
  Record as AirtableRecord,
  Table
} from '@airtable/blocks/models';
import { FieldMapping, PersonRecord } from './types';

/**
 * Returns true if the mentees and mentors tables are validated. Returns false,
 * otherwise.
 */
export const areTablesValid = ([menteesTable, mentorsTable]: [
  Table,
  Table
]): boolean => {
  const hasPermissionToUpdate: boolean =
    menteesTable?.hasPermissionToUpdateRecords() &&
    mentorsTable?.hasPermissionToUpdateRecords();

  return (
    menteesTable &&
    mentorsTable &&
    menteesTable.id !== mentorsTable.id &&
    hasPermissionToUpdate
  );
};

/**
 * Returns a 2D array chunked into arrays of size N.
 *
 * @param elements - Array of elements to chunk.
 * @param chunkSize - Size of the chunked arrays.
 *
 * @example
 * // Returns [[1, 2], [3, 4], [5, 6]].
 * chunkifyArray([1, 2, 3, 4, 5, 6], 2)
 */
export function chunkifyArray<T>(elements: T[], chunkSize: number): T[][] {
  if (elements.length <= chunkSize) return [elements];

  const result: T[][] = [];

  elements.forEach((element: T, i: number) => {
    // Calculate the chunk index based on the element index and chunk size.
    const chunkIndex: number = Math.floor(i / chunkSize);

    // If no chunk exists with that chunk index yet, start a new chunk.
    if (!result[chunkIndex]) result[chunkIndex] = [];

    // Push the new item into the chunk!
    result[chunkIndex].push(element);
  });

  return result;
}

type FormatRecordsArgs = {
  fieldIds: string[];
  fieldMappings: Record<string, FieldMapping>;
  preferenceFieldId?: string;
  records: AirtableRecord[];
  table: Table;
};

/**
 * Returns the mapping ID based on the given field ID.
 *
 * @example
 * // Returns 'abcde'.
 * getMappingId({
 *  fieldId: 1,
 *  fieldMappings: { 'abcde': { menteesFieldId: 1, mentorsFieldId: 2 } }
 * })
 */
const getMappingId = ({
  fieldId,
  fieldMappings
}: Pick<FormatRecordsArgs, 'fieldMappings'> & { fieldId: string }): string => {
  const [mappingId]: [string, FieldMapping] = Object.entries(
    fieldMappings
  ).find(
    ([, { menteesFieldId, mentorsFieldId }]: [string, FieldMapping]) =>
      // Return the mapping with either menteesFieldId or mentorsFieldId
      // being the fieldId.
      fieldId === menteesFieldId || fieldId === mentorsFieldId
  );

  return mappingId;
};

/**
 * Returns formatted records as PersonRecord(s) from Airtable record(s).
 *
 * @example
 * // Returns { id: 'xyz', 'abc': 'Black/African-American' }.
 * formatRecords({
 *  fieldsIds: ['10'],
 *  fieldMappings: {
 *    'abc': { menteesFieldId: '10', mentorsFieldId: '11' }
 *  },
 *  records: [{ id: 'xyz' }],
 *  table: MenteesTable
 * })
 */
export const formatRecords = ({
  fieldIds,
  fieldMappings,
  preferenceFieldId,
  records,
  table
}: FormatRecordsArgs): PersonRecord[] =>
  records.map((record: AirtableRecord) => {
    const personRecord: PersonRecord = {
      id: record.id,
      preference: preferenceFieldId
        ? record.getCellValueAsString(preferenceFieldId)
        : null
    };

    fieldIds.forEach((fieldId: string) => {
      const field: Field = table.getFieldById(fieldId);
      const mappingId: string = getMappingId({ fieldId, fieldMappings });
      const value: string = record.getCellValueAsString(fieldId);

      personRecord[mappingId] = {
        fieldName: field.name,
        fieldType: field.type,
        value
      };
    });

    return personRecord;
  });

/**
 * Returns true if the linked field is valid. A linked field is valid if
 * the field exists on the mentor table that was specified earlier.
 */
export const isLinkedFieldValid = (
  [menteesTable, mentorsTable]: [Table, Table],
  menteesTableLinkedFieldId: string
): boolean => {
  if (!menteesTableLinkedFieldId) return false;

  // Get the linked field on the mentees side.
  const linkedField: Field = menteesTable.getFieldByIdIfExists(
    menteesTableLinkedFieldId
  );

  // ID of the table that the linked field links to (mentors side).
  const linkedTableId: string = linkedField?.options?.linkedTableId as string;

  return mentorsTable?.id === linkedTableId;
};
