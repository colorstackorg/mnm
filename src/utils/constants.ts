import { FieldType } from '@airtable/blocks/models';

export const allowedTypes: FieldType[] = [
  FieldType.CHECKBOX,
  FieldType.MULTIPLE_SELECTS,
  FieldType.NUMBER,
  FieldType.SINGLE_SELECT
];

export enum FIELD {
  /**
   * Array of IDs representing each "mapping". A "mapping" is defined as the
   * pairing of a mentee field to a mentor field.
   */
  FIELD_MAPPING_IDS = 'fieldMappingIds',

  /**
   * Object that maps the ID of a mapping to the MENTEES_FIELD_ID and
   * MENTORS_FIELD_ID.
   */
  FIELD_MAPPINGS = 'fieldMappings',

  MENTEES_FIELD_ID = 'menteesFieldId',

  MENTEES_PREFERENCE_FIELD_ID = 'menteesPreferenceFieldId',

  MENTEES_TABLE_ID = 'menteesTableId',

  MENTEES_TABLE_LINKED_FIELD_ID = 'menteesTableLinkedFieldId',

  MENTORS_FIELD_ID = 'mentorsFieldId',

  MENTORS_TABLE_ID = 'mentorsTableId'
}
